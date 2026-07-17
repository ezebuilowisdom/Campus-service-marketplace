const { supabase, supabaseAdmin } = require('../config/supabase');

const initiatePayment = async (req, res, next) => {
  const { booking_id, gateway, card_details, phone_number } = req.body;
  const customer_id = req.user.id;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    const transactionRef = `TXN-${gateway.toUpperCase()}-${Math.floor(1000000 + Math.random() * 9000000)}`;

    if (isMock) {
      return res.status(200).json({
        success: true,
        message: 'Payment completed successfully via Simulator (Mock Mode)',
        transaction_reference: transactionRef,
        escrow_status: 'escrow',
        booking_id
      });
    }

    // Database flow:
    // 1. Fetch booking to ensure correctness
    const { data: booking, error: bookingErr } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', booking_id)
      .single();

    if (bookingErr || !booking) {
      return res.status(404).json({ success: false, message: 'Booking record not found.' });
    }

    if (booking.status_id === 4) {
      return res.status(400).json({ success: false, message: 'This booking has already been paid for.' });
    }

    // 2. Perform payments record insertion
    const { data: payment, error: payErr } = await supabaseAdmin
      .from('payments')
      .insert([{
        booking_id: booking.id,
        customer_id,
        provider_id: booking.provider_id,
        amount: booking.price,
        gateway,
        transaction_reference: transactionRef,
        escrow_status: 'escrow'
      }])
      .select()
      .single();

    if (payErr) {
      return res.status(400).json({ success: false, message: payErr.message });
    }

    // 3. Update booking status to 4 (Paid)
    await supabaseAdmin
      .from('bookings')
      .update({ status_id: 4, updated_at: new Date() })
      .eq('id', booking.id);

    // 4. Place funds in provider wallet escrow_balance
    const { data: wallet } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', booking.provider_id)
      .single();

    if (wallet) {
      const newEscrow = parseFloat(wallet.escrow_balance) + parseFloat(booking.price);
      
      await supabaseAdmin
        .from('wallets')
        .update({ escrow_balance: newEscrow, updated_at: new Date() })
        .eq('id', wallet.id);

      // Log wallet transaction
      await supabaseAdmin.from('wallet_transactions').insert([{
        wallet_id: wallet.id,
        amount: booking.price,
        type: 'escrow_hold',
        status: 'completed',
        reference_id: booking.id,
        description: `Escrow hold for booking payment: ${booking.id}`
      }]);
    }

    // 5. Send Notification
    await supabase.from('notifications').insert([
      {
        user_id: booking.provider_id,
        title: 'Payment Received (Escrow)',
        message: `Customer paid ${booking.price} for your service. Funds are held in escrow until completion.`,
        type: 'payment'
      },
      {
        user_id: customer_id,
        title: 'Payment Successful',
        message: `Successfully paid ${booking.price} for booking ${booking.id}. Funds are secure in escrow.`,
        type: 'payment'
      }
    ]);

    res.status(200).json({
      success: true,
      message: 'Payment received. Funds successfully loaded into Escrow.',
      payment,
      transaction_reference: transactionRef
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  initiatePayment
};
