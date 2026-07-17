const { supabase, supabaseAdmin } = require('../config/supabase');

const getStats = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        stats: {
          totalUsers: 154,
          totalProviders: 42,
          totalRevenue: 2450.00,
          totalServices: 89,
          pendingBookings: 8,
          activeReports: 2,
          recentActivity: [
            { id: '1', action: 'New User Registered', detail: 'Alice Cooper created a customer profile', time: '10 mins ago' },
            { id: '2', action: 'Verification Submitted', detail: 'Sarah Jenkins submitted student ID', time: '1 hour ago' },
            { id: '3', action: 'Payment Escrowed', detail: '$120.00 added to escrow by Bob Sterling', time: '3 hours ago' }
          ]
        }
      });
    }

    // Real DB statistics aggregating
    const { count: totalUsers } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: totalProviders } = await supabase.from('providers').select('*', { count: 'exact', head: true });
    const { count: totalServices } = await supabase.from('services').select('*', { count: 'exact', head: true });
    const { count: pendingBookings } = await supabase.from('bookings').select('*', { count: 'exact', head: true }).eq('status_id', 1);
    const { count: activeReports } = await supabase.from('reports').select('*', { count: 'exact', head: true }).eq('status', 'pending');

    // Calculate total revenue from successful transactions
    const { data: paySums } = await supabase.from('payments').select('amount');
    const totalRevenue = (paySums || []).reduce((acc, curr) => acc + parseFloat(curr.amount), 0.00);

    // Fetch recent audit logs
    const { data: recentLogs } = await supabase
      .from('audit_logs')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(5);

    res.status(200).json({
      success: true,
      stats: {
        totalUsers: totalUsers || 0,
        totalProviders: totalProviders || 0,
        totalRevenue: totalRevenue || 0.00,
        totalServices: totalServices || 0,
        pendingBookings: pendingBookings || 0,
        activeReports: activeReports || 0,
        recentActivity: recentLogs || []
      }
    });
  } catch (err) {
    next(err);
  }
};

const getVerificationRequests = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        requests: [
          { id: 'vr1', provider_id: 'b3333333-3333-3333-3333-333333333333', status: 'pending', document_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643', reviewer_notes: 'Upload of tutor student identity card.', provider: { profiles: { full_name: 'Professor Tutoring' } } }
        ]
      });
    }

    const { data, error } = await supabase
      .from('verification_requests')
      .select('*, provider:providers(profiles(full_name))')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, requests: data });
  } catch (err) {
    next(err);
  }
};

const updateVerificationStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status, reviewer_notes } = req.body; // approved, rejected

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({ success: true, message: `Verification status marked as ${status} (Mock Mode)` });
    }

    // Fetch verification request
    const { data: request } = await supabase.from('verification_requests').select('*').eq('id', id).single();
    if (!request) {
      return res.status(404).json({ success: false, message: 'Verification request not found.' });
    }

    // 1. Update request status
    await supabaseAdmin
      .from('verification_requests')
      .update({ status, reviewer_notes, processed_at: new Date() })
      .eq('id', id);

    // 2. Update provider verification status
    await supabaseAdmin
      .from('providers')
      .update({ verification_status: status })
      .eq('id', request.provider_id);

    // 3. Notify provider
    await supabase.from('notifications').insert([{
      user_id: request.provider_id,
      title: 'Verification Update',
      message: `Your professional profile verification request has been ${status}. ${reviewer_notes || ''}`,
      type: 'verification'
    }]);

    res.status(200).json({ success: true, message: `Verification request ${status} successfully.` });
  } catch (err) {
    next(err);
  }
};

const updateUserStatus = async (req, res, next) => {
  const { userId } = req.params;
  const { status } = req.body; // active, suspended

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({ success: true, message: `User status changed to ${status} (Mock Mode)` });
    }

    const { data, error } = await supabaseAdmin
      .from('profiles')
      .update({ status, updated_at: new Date() })
      .eq('id', userId)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: `User account is now ${status}.`, profile: data });
  } catch (err) {
    next(err);
  }
};

const getWithdrawalRequests = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        requests: [
          { id: 'w1', amount: 150.00, status: 'pending', payout_method: 'bank_transfer', payout_details: { bank_name: 'GTBank', account_number: '0123456789', account_name: 'David Adebayo' }, provider: { profiles: { full_name: 'David Adebayo' } } }
        ]
      });
    }

    const { data, error } = await supabase
      .from('withdrawals')
      .select('*, provider:providers(profiles(full_name))')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, requests: data });
  } catch (err) {
    next(err);
  }
};

const updateWithdrawalStatus = async (req, res, next) => {
  const { id } = req.params;
  const { status } = req.body; // approved, rejected

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({ success: true, message: `Withdrawal request ${status} (Mock Mode)` });
    }

    const { data: request } = await supabase.from('withdrawals').select('*').eq('id', id).single();
    if (!request) {
      return res.status(404).json({ success: false, message: 'Withdrawal request not found.' });
    }

    if (request.status !== 'pending') {
      return res.status(400).json({ success: false, message: 'This request is already processed.' });
    }

    // 1. Update request status
    await supabaseAdmin
      .from('withdrawals')
      .update({ status, processed_at: new Date() })
      .eq('id', id);

    // 2. Perform financial balancing
    const { data: wallet } = await supabase.from('wallets').select('*').eq('id', request.wallet_id).single();
    if (wallet) {
      if (status === 'approved') {
        // Approve: Complete the ledger entry
        await supabaseAdmin.from('wallet_transactions').update({
          status: 'completed'
        }).eq('reference_id', request.id);
      } else if (status === 'rejected') {
        // Reject: Refund the deducted amount back to active balance
        const newBalance = parseFloat(wallet.balance) + parseFloat(request.amount);
        await supabaseAdmin.from('wallets').update({
          balance: newBalance,
          updated_at: new Date()
        }).eq('id', wallet.id);

        // Mark ledger entry as failed
        await supabaseAdmin.from('wallet_transactions').update({
          status: 'failed',
          description: `Withdrawal rejected: ${request.amount} refunded to balance.`
        }).eq('reference_id', request.id);
      }
    }

    // 3. Notify provider
    await supabase.from('notifications').insert([{
      user_id: request.provider_id,
      title: 'Withdrawal Update',
      message: `Your withdrawal request for $${request.amount} has been ${status}.`,
      type: 'withdrawal'
    }]);

    res.status(200).json({ success: true, message: `Withdrawal status marked as ${status}.` });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getStats,
  getVerificationRequests,
  updateVerificationStatus,
  updateUserStatus,
  getWithdrawalRequests,
  updateWithdrawalStatus
};
