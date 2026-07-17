const { supabase, supabaseAdmin } = require('../config/supabase');

// Mock data list matching seed.sql
const mockBookings = [
  {
    id: 'db000000-0000-0000-0000-000000000001',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    service_id: 's1111111-1111-1111-1111-111111111111',
    provider_id: 'b1111111-1111-1111-1111-111111111111',
    booking_date: '2026-07-20',
    booking_time: '14:00:00',
    status_id: 4, // Paid
    notes: 'Need it integrated with my personal domain',
    price: 120.00,
    created_at: new Date().toISOString(),
    service: { title: 'Vite + React Web App Portfolio', price: 120.00 },
    customer: { profiles: { full_name: 'Bob Sterling' } },
    provider: { profiles: { full_name: 'David Adebayo' } }
  }
];

const createBooking = async (req, res, next) => {
  const { service_id, booking_date, booking_time, notes } = req.body;
  const customer_id = req.user.id;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    
    // Fetch service details for pricing and provider info
    let service;
    if (isMock) {
      const mockServices = [
        { id: 's1111111-1111-1111-1111-111111111111', provider_id: 'b1111111-1111-1111-1111-111111111111', price: 120.00, title: 'Vite + React Web App Portfolio' },
        { id: 's2222222-2222-2222-2222-222222222222', provider_id: 'b1111111-1111-1111-1111-111111111111', price: 15.00, title: 'Creative Poster & Flyer Design' },
        { id: 's3333333-3333-3333-3333-333333333333', provider_id: 'b2222222-2222-2222-2222-222222222222', price: 45.00, title: 'Knotless Braids' }
      ];
      service = mockServices.find(s => s.id === service_id) || mockServices[0];
    } else {
      const { data } = await supabase.from('services').select('*').eq('id', service_id).single();
      service = data;
    }

    if (!service) {
      return res.status(404).json({ success: false, message: 'Selected service not found.' });
    }

    if (isMock) {
      const mockId = require('crypto').randomUUID();
      const newBooking = {
        id: mockId,
        customer_id,
        service_id,
        provider_id: service.provider_id,
        booking_date,
        booking_time,
        status_id: 1, // Pending
        notes,
        price: service.price,
        created_at: new Date().toISOString(),
        service: { title: service.title, price: service.price },
        customer: { profiles: { full_name: req.user.name } },
        provider: { profiles: { full_name: 'David Adebayo' } }
      };
      mockBookings.push(newBooking);
      return res.status(201).json({ success: true, message: 'Booking requested successfully (Mock Mode)', booking: newBooking });
    }

    // Insert booking
    const { data: booking, error } = await supabase
      .from('bookings')
      .insert([{
        customer_id,
        service_id,
        provider_id: service.provider_id,
        booking_date,
        booking_time,
        status_id: 1, // 1 = pending
        notes,
        price: service.price
      }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Send notifications
    await supabase.from('notifications').insert([{
      user_id: service.provider_id,
      title: 'New Booking Request',
      message: `You have a new booking request for "${service.title}" on ${booking_date} at ${booking_time}.`,
      type: 'booking'
    }]);

    res.status(201).json({ success: true, message: 'Booking requested successfully.', booking });
  } catch (err) {
    next(err);
  }
};

const getBookings = async (req, res, next) => {
  const { role, id } = req.user;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      let filtered = [...mockBookings];
      if (role === 'customer') {
        filtered = filtered.filter(b => b.customer_id === id);
      } else if (role === 'provider') {
        filtered = filtered.filter(b => b.provider_id === id);
      }
      return res.status(200).json({ success: true, bookings: filtered });
    }

    let query = supabase
      .from('bookings')
      .select(`
        *, 
        service:services(title, price), 
        customer:customers(profiles(full_name, avatar_url, phone)), 
        provider:providers(profiles(full_name, avatar_url, phone))
      `);

    if (role === 'customer') {
      query = query.eq('customer_id', id);
    } else if (role === 'provider') {
      query = query.eq('provider_id', id);
    } // Admin gets all

    const { data: bookings, error } = await query.order('created_at', { ascending: false });
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, bookings });
  } catch (err) {
    next(err);
  }
};

const updateBookingStatus = async (req, res, next) => {
  const { id } = req.params;
  const { action } = req.body; // accept, reject, complete, confirm, cancel

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    
    // Status mapping: 1=pending, 2=accepted, 3=rejected, 4=paid, 5=completed, 6=confirmed, 7=cancelled
    let newStatusId;
    let notificationTitle;
    let notificationMsg;

    const transitionText = action.toLowerCase();

    if (transitionText === 'accept') {
      newStatusId = 2;
      notificationTitle = 'Booking Accepted';
      notificationMsg = 'Your booking has been accepted! You can now proceed to payment.';
    } else if (transitionText === 'reject') {
      newStatusId = 3;
      notificationTitle = 'Booking Rejected';
      notificationMsg = 'Your booking was declined by the provider.';
    } else if (transitionText === 'complete') {
      newStatusId = 5;
      notificationTitle = 'Job Completed';
      notificationMsg = 'The provider marked the job as completed. Please confirm to release funds.';
    } else if (transitionText === 'confirm') {
      newStatusId = 6;
      notificationTitle = 'Funds Released!';
      notificationMsg = 'The customer confirmed completion. Escrow funds have been added to your wallet.';
    } else if (transitionText === 'cancel') {
      newStatusId = 7;
      notificationTitle = 'Booking Cancelled';
      notificationMsg = 'A booking was cancelled.';
    } else {
      return res.status(400).json({ success: false, message: 'Invalid booking action.' });
    }

    if (isMock) {
      const idx = mockBookings.findIndex(b => b.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Booking not found.' });

      const booking = mockBookings[idx];
      booking.status_id = newStatusId;

      // Handle escrow release simulator logic
      if (transitionText === 'confirm') {
        // Mock Release Escrow Funds: customer releases funds to provider balance
        console.log(`Mock releasing $${booking.price} from escrow to provider ${booking.provider_id}`);
      }

      return res.status(200).json({ success: true, message: `Booking status updated to ${action} (Mock Mode)`, booking });
    }

    // Database flow
    // 1. Fetch booking details to verify access and price
    const { data: booking, error: fetchErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', id)
      .single();

    if (fetchErr || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found.' });
    }

    // 2. Perform safety checks depending on action
    if (transitionText === 'confirm' && booking.status_id !== 5) {
      return res.status(400).json({ success: false, message: 'You can only confirm bookings that have been marked completed.' });
    }

    // 3. Update status
    const { data: updatedBooking, error: updateErr } = await supabase
      .from('bookings')
      .update({ status_id: newStatusId, updated_at: new Date() })
      .eq('id', id)
      .select()
      .single();

    if (updateErr) {
      return res.status(400).json({ success: false, message: updateErr.message });
    }

    const notifyUser = req.user.role === 'customer' ? booking.provider_id : booking.customer_id;

    // Send notifications
    await supabase.from('notifications').insert([{
      user_id: notifyUser,
      title: notificationTitle,
      message: notificationMsg,
      type: 'booking'
    }]);

    // 4. ESCROW FUNDS RELEASE LOGIC: When customer CONFIRMS completion, release from escrow balance to usable balance
    if (transitionText === 'confirm') {
      const providerId = booking.provider_id;
      
      // Fetch provider wallet
      const { data: wallet } = await supabase.from('wallets').select('*').eq('user_id', providerId).single();
      
      if (wallet) {
        // Calculate service price less platform fee (e.g. 5% platform fee)
        const feePercentObj = await supabase.from('system_settings').select('value').eq('key', 'platform_fee_percent').single();
        const feePercent = feePercentObj ? parseFloat(feePercentObj.data.value) : 5.0;
        const feeAmount = (booking.price * feePercent) / 100.0;
        const providerShare = booking.price - feeAmount;

        const newEscrowBal = Math.max(0, parseFloat(wallet.escrow_balance) - booking.price);
        const newBal = parseFloat(wallet.balance) + providerShare;

        // Perform Wallet Update
        await supabaseAdmin.from('wallets').update({
          balance: newBal,
          escrow_balance: newEscrowBal,
          updated_at: new Date()
        }).eq('id', wallet.id);

        // Record wallet transaction
        await supabaseAdmin.from('wallet_transactions').insert([
          {
            wallet_id: wallet.id,
            amount: providerShare,
            type: 'escrow_release',
            status: 'completed',
            reference_id: booking.id,
            description: `Released escrow earnings from booking ${booking.id} (Ref. Fee ${feeAmount.toFixed(2)})`
          }
        ]);

        // Mark payment escrow status as released
        await supabaseAdmin.from('payments').update({
          escrow_status: 'released',
          updated_at: new Date()
        }).eq('booking_id', booking.id);
      }
    }

    res.status(200).json({ success: true, message: `Booking marked as ${action}.`, booking: updatedBooking });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createBooking,
  getBookings,
  updateBookingStatus
};
