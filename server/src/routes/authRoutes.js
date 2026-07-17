const express = require('express');
const { signup, login, getProfile, updateProfile } = require('../controllers/authController');
const { requireAuth } = require('../middlewares/auth');
const validate = require('../middlewares/validator');
const { z } = require('zod');

const router = express.Router();

// Validation schemas
const signupSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    full_name: z.string().min(2, 'Name is too short'),
    role: z.enum(['customer', 'provider', 'admin']),
    matric_number: z.string().optional(),
    department: z.string().optional(),
    bio: z.string().optional()
  })
});

const loginSchema = z.object({
  body: z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required')
  })
});

router.post('/signup', validate(signupSchema), signup);
router.post('/login', validate(loginSchema), login);
router.get('/profile', requireAuth, getProfile);
router.put('/profile', requireAuth, updateProfile);

module.exports = router;
