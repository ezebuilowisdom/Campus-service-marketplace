const express = require('express');
const { getWallet, getWalletTransactions, requestWithdrawal } = require('../controllers/walletController');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { z } = require('zod');

const router = express.Router();

const withdrawSchema = z.object({
  body: z.object({
    amount: z.number().positive('Withdrawal amount must be greater than zero'),
    payout_method: z.string().min(3, 'Payout method details are required'),
    bank_name: z.string().min(2, 'Bank name is required'),
    account_number: z.string().min(5, 'Account number is too short'),
    account_name: z.string().min(2, 'Account holder name is required')
  })
});

router.get('/', requireAuth, getWallet);
router.get('/transactions', requireAuth, getWalletTransactions);
router.post('/withdraw', requireAuth, requireRole(['provider']), validate(withdrawSchema), requestWithdrawal);

module.exports = router;
