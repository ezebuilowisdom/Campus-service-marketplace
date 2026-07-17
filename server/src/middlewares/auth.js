const jwt = require('jsonwebtoken');
const { supabase } = require('../config/supabase');

const requireAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ success: false, message: 'Authorization token required. Please login.' });
    }

    const token = authHeader.split(' ')[1];

    // 1. Try to get user from Supabase auth session
    let user;
    let error;

    if (process.env.SUPABASE_URL && !process.env.SUPABASE_URL.includes('placeholder')) {
      const { data, error: sbError } = await supabase.auth.getUser(token);
      user = data.user;
      error = sbError;
    }

    // 2. If Supabase keys are not set, fallback to local JWT verification for offline coding/demo
    if (!user) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'campus_service_marketplace_dev_jwt_secret_key_12345');
        user = {
          id: decoded.id || decoded.sub,
          email: decoded.email,
          user_metadata: decoded.user_metadata || {}
        };
      } catch (jwtErr) {
        return res.status(401).json({ 
          success: false, 
          message: error ? error.message : 'Invalid or expired authentication token.' 
        });
      }
    }

    // 3. Fetch user profile from public.profiles to check role and suspension status
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', user.id)
      .single();

    if (profileError || !profile) {
      // In offline/development mode, mock a profile if database is unreachable
      if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.includes('placeholder')) {
        req.user = {
          id: user.id,
          email: user.email,
          name: user.user_metadata.full_name || 'Mock Student',
          role: user.user_metadata.role || 'customer',
          status: 'active'
        };
        return next();
      }
      return res.status(404).json({ success: false, message: 'User profile not found.' });
    }

    if (profile.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'Your account has been suspended. Please contact the administrator.' });
    }

    // Attach user information to request
    req.user = {
      id: profile.id,
      email: profile.email,
      name: profile.full_name,
      role: profile.roles ? profile.roles.name : 'customer',
      status: profile.status
    };

    next();
  } catch (err) {
    next(err);
  }
};

const requireRole = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required.' });
    }

    if (!allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Forbidden: Access restricted. Requires one of: ${allowedRoles.join(', ')}` 
      });
    }

    next();
  };
};

module.exports = {
  requireAuth,
  requireRole
};
