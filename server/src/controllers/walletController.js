const { supabase, supabaseAdmin } = require('../config/supabase');

const getWallet = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        wallet: { balance: 450.00, escrow_balance: 120.00 }
      });
    }

    const { data: wallet, error } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    res.status(200).json({ success: true, wallet });
  } catch (err) {
    next(err);
  }
};

const getWalletTransactions = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        transactions: [
          { id: 'wt1', amount: 120.00, type: 'escrow_hold', status: 'completed', description: 'Escrow hold for Web App Portfolio', created_at: new Date().toISOString() },
          { id: 'wt2', amount: 450.00, type: 'earning', status: 'completed', description: 'Earning released from Knotless Braids', created_at: new Date().toISOString() }
        ]
      });
    }

    // Fetch wallet ID
    const { data: wallet } = await supabase.from('wallets').select('id').eq('user_id', req.user.id).single();
    if (!wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    const { data: transactions, error } = await supabase
      .from('wallet_transactions')
      .select('*')
      .eq('wallet_id', wallet.id)
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, transactions });
  } catch (err) {
    next(err);
  }
};

const requestWithdrawal = async (req, res, next) => {
  const { amount, payout_method, bank_name, account_number, account_name } = req.body;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      if (parseFloat(amount) > 450.00) {
        return res.status(400).json({ success: false, message: 'Insufficient active balance.' });
      }
      return res.status(200).json({
        success: true,
        message: 'Withdrawal request submitted successfully (Mock Mode)',
        withdrawal: { amount, status: 'pending', payout_method }
      });
    }

    // Fetch user wallet
    const { data: wallet, error: walletErr } = await supabase
      .from('wallets')
      .select('*')
      .eq('user_id', req.user.id)
      .single();

    if (walletErr || !wallet) {
      return res.status(404).json({ success: false, message: 'Wallet not found.' });
    }

    if (parseFloat(wallet.balance) < parseFloat(amount)) {
      return res.status(400).json({ success: false, message: 'Insufficient wallet balance for withdrawal.' });
    }

    // 1. Submit withdrawal request in status pending
    const { data: withdrawal, error: withdrawErr } = await supabaseAdmin
      .from('withdrawals')
      .insert([{
        provider_id: req.user.id,
        wallet_id: wallet.id,
        amount: parseFloat(amount),
        status: 'pending',
        payout_method,
        payout_details: { bank_name, account_number, account_name }
      }])
      .select()
      .single();

    if (withdrawErr) {
      return res.status(400).json({ success: false, message: withdrawErr.message });
    }

    // 2. Lock funds by deducting from active balance and placing in a temporary hold / transaction status
    const newBalance = parseFloat(wallet.balance) - parseFloat(amount);
    await supabaseAdmin
      .from('wallets')
      .update({ balance: newBalance, updated_at: new Date() })
      .eq('id', wallet.id);

    // 3. Log a pending withdrawal transaction
    await supabaseAdmin.from('wallet_transactions').insert([{
      wallet_id: wallet.id,
      amount: -parseFloat(amount),
      type: 'withdrawal',
      status: 'pending',
      reference_id: withdrawal.id,
      description: `Withdrawal request submitted to ${bank_name} (${account_number})`
    }]);

    res.status(200).json({
      success: true,
      message: 'Withdrawal request submitted successfully. It will be reviewed by admin.',
      withdrawal
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getWallet,
  getWalletTransactions,
  requestWithdrawal
};
