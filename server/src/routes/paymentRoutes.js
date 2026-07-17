const express = require('express');
const { initiatePayment } = require('../controllers/paymentController');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { z } = require('zod');

const router = express.Router();

const checkoutSchema = z.object({
  body: z.object({
    booking_id: z.string().uuid('Invalid booking ID format'),
    gateway: z.enum(['stripe', 'paystack', 'wallet', 'simulator']),
    card_details: z.object({
      card_number: z.string(),
      expiry: z.string(),
      cvv: z.string()
    }).optional(),
    phone_number: z.string().optional()
  })
});

router.post('/checkout', requireAuth, requireRole(['customer']), validate(checkoutSchema), initiatePayment);

module.exports = router;
