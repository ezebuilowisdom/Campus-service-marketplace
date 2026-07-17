const express = require('express');
const { 
  getAllServices, 
  getServiceById, 
  createService, 
  updateService, 
  deleteService, 
  getCategories 
} = require('../controllers/serviceController');
const { requireAuth, requireRole } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const createServiceSchema = z.object({
  body: z.object({
    category_id: z.number().int('Category ID must be an integer'),
    title: z.string().min(5, 'Title must be at least 5 characters'),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    price: z.number().nonnegative('Price must be greater than or equal to 0'),
    duration_minutes: z.number().int().positive('Duration must be positive minutes'),
    location_type: z.enum(['online', 'campus', 'delivery']),
    building_name: z.string().optional(),
    room_number: z.string().optional()
  })
});

router.get('/', getAllServices);
router.get('/categories', getCategories);
router.get('/:id', getServiceById);
router.post('/', requireAuth, requireRole(['provider']), validate(createServiceSchema), createService);
router.put('/:id', requireAuth, requireRole(['provider']), updateService);
router.delete('/:id', requireAuth, requireRole(['provider']), deleteService);

module.exports = router;
