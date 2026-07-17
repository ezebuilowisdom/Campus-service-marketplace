const express = require('express');
const { 
  getStats, 
  getVerificationRequests, 
  updateVerificationStatus, 
  updateUserStatus,
  getWithdrawalRequests,
  updateWithdrawalStatus
} = require('../controllers/adminController');
const { requireAuth, requireRole } = require('../middlewares/auth');

const router = express.Router();

router.get('/stats', requireAuth, requireRole(['admin']), getStats);
router.get('/verifications', requireAuth, requireRole(['admin']), getVerificationRequests);
router.put('/verifications/:id', requireAuth, requireRole(['admin']), updateVerificationStatus);
router.put('/users/:userId/status', requireAuth, requireRole(['admin']), updateUserStatus);
router.get('/withdrawals', requireAuth, requireRole(['admin']), getWithdrawalRequests);
router.put('/withdrawals/:id', requireAuth, requireRole(['admin']), updateWithdrawalStatus);

module.exports = router;
