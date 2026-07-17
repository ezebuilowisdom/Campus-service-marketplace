const express = require('express');
const { createBooking, getBookings, updateBookingStatus } = require('../controllers/bookingController');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { z } = require('zod');

const router = express.Router();

const bookingSchema = z.object({
  body: z.object({
    service_id: z.string().uuid('Invalid service ID format'),
    booking_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
    booking_time: z.string().regex(/^\d{2}:\d{2}(:\d{2})?$/, 'Time must be in HH:MM format'),
    notes: z.string().optional()
  })
});

router.post('/', requireAuth, requireRole(['customer']), validate(bookingSchema), createBooking);
router.get('/', requireAuth, getBookings);
router.put('/:id/status', requireAuth, updateBookingStatus);

module.exports = router;
