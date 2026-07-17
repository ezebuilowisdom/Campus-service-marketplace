const jwt = require('jsonwebtoken');
const { supabase, supabaseAdmin } = require('../config/supabase');

// Helper to sign JWT
const signToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      user_metadata: { 
        role: user.role, 
        full_name: user.name 
      } 
    },
    process.env.JWT_SECRET || 'campus_service_marketplace_dev_jwt_secret_key_12345',
    { expiresIn: '30d' }
  );
};

const signup = async (req, res, next) => {
  const { email, password, full_name, role, matric_number, department, bio } = req.body;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    
    if (isMock) {
      // Mock signup logic for offline demo
      const mockId = require('crypto').randomUUID();
      const token = signToken({ id: mockId, email, name: full_name, role });
      
      return res.status(201).json({
        success: true,
        message: 'Registration successful (Mock Mode)',
        token,
        user: { id: mockId, email, name: full_name, role, status: 'active' }
      });
    }

    // 1. Register user in Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name,
          role
        }
      }
    });

    if (authError) {
      return res.status(400).json({ success: false, message: authError.message });
    }

    const userId = authData.user.id;

    // 2. Insert role mapping, profile, wallet & specific table
    const { data: roleRow } = await supabase.from('roles').select('id').eq('name', role).single();
    const roleId = roleRow ? roleRow.id : 3; // default customer

    // Profiles
    const { error: profileErr } = await supabaseAdmin.from('profiles').insert([{
      id: userId,
      email,
      full_name,
      role_id: roleId,
      status: 'active'
    }]);

    if (profileErr) {
      return res.status(400).json({ success: false, message: profileErr.message });
    }

    // Wallet
    await supabaseAdmin.from('wallets').insert([{ user_id: userId, balance: 0.00, escrow_balance: 0.00 }]);

    // Specific profiles
    if (role === 'customer') {
      await supabaseAdmin.from('customers').insert([{ id: userId, matric_number, department }]);
    } else if (role === 'provider') {
      await supabaseAdmin.from('providers').insert([{ id: userId, bio: bio || '', verification_status: 'pending' }]);
      // Create verification request record so it appears on the Admin Panel
      await supabaseAdmin.from('verification_requests').insert([{
        provider_id: userId,
        status: 'pending',
        document_url: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?auto=format&fit=crop&w=600&q=80',
        reviewer_notes: 'Verification requested during provider account registration.'
      }]);
    }

    const token = signToken({ id: userId, email, name: full_name, role });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Welcome!',
      token,
      user: {
        id: userId,
        email,
        name: full_name,
        role,
        status: 'active'
      }
    });
  } catch (err) {
    next(err);
  }
};

const login = async (req, res, next) => {
  const { email, password } = req.body;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');

    if (isMock) {
      // Mock login for developer testing
      let role = 'customer';
      let full_name = 'Test Student';
      let mockId = 'c1111111-1111-1111-1111-111111111111';

      if (email.startsWith('admin')) {
        role = 'admin';
        full_name = 'Professor Clark (Admin)';
        mockId = 'a1111111-1111-1111-1111-111111111111';
      } else if (email.startsWith('provider') || email.includes('dave') || email.includes('sarah')) {
        role = 'provider';
        full_name = email.includes('dave') ? 'David Adebayo' : 'Sarah Jenkins';
        mockId = email.includes('dave') ? 'b1111111-1111-1111-1111-111111111111' : 'b2222222-2222-2222-2222-222222222222';
      }

      const token = signToken({ id: mockId, email, name: full_name, role });
      return res.status(200).json({
        success: true,
        message: 'Login successful (Mock Mode)',
        token,
        user: { id: mockId, email, name: full_name, role, status: 'active' }
      });
    }

    // 1. Authenticate with Supabase auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
    if (authError) {
      return res.status(401).json({ success: false, message: authError.message });
    }

    const userId = authData.user.id;

    // 2. Fetch full profile and role
    const { data: profile, error: profileErr } = await supabase
      .from('profiles')
      .select('*, roles(name)')
      .eq('id', userId)
      .single();

    if (profileErr || !profile) {
      return res.status(404).json({ success: false, message: 'User profile not found in database.' });
    }

    if (profile.status === 'suspended') {
      return res.status(403).json({ success: false, message: 'This account has been suspended by the Administrator.' });
    }

    const userRole = profile.roles ? profile.roles.name : 'customer';
    const token = signToken({ id: profile.id, email: profile.email, name: profile.full_name, role: userRole });

    res.status(200).json({
      success: true,
      message: 'Login successful. Welcome back!',
      token,
      user: {
        id: profile.id,
        email: profile.email,
        name: profile.full_name,
        role: userRole,
        status: profile.status
      }
    });
  } catch (err) {
    next(err);
  }
};

const getProfile = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        profile: {
          id: req.user.id,
          email: req.user.email,
          full_name: req.user.name,
          role: req.user.role,
          status: req.user.status,
          phone: '+2348123456789',
          avatar_url: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde',
          wallet: { balance: 250.00, escrow_balance: 120.00 },
          verification_status: req.user.role === 'provider' ? 'pending' : 'approved'
        }
      });
    }

    const { data: profile, error } = await supabase
      .from('profiles')
      .select('*, roles(name), wallets(balance, escrow_balance), providers(verification_status)')
      .eq('id', req.user.id)
      .single();

    if (error || !profile) {
      return res.status(404).json({ success: false, message: 'Profile not found.' });
    }

    const providerData = Array.isArray(profile.providers) ? profile.providers[0] : profile.providers;
    const verificationStatus = providerData ? providerData.verification_status : 'approved';

    res.status(200).json({
      success: true,
      profile: {
        id: profile.id,
        email: profile.email,
        full_name: profile.full_name,
        role: profile.roles ? profile.roles.name : 'customer',
        status: profile.status,
        phone: profile.phone,
        avatar_url: profile.avatar_url,
        wallet: profile.wallets || { balance: 0.00, escrow_balance: 0.00 },
        verification_status: verificationStatus
      }
    });
  } catch (err) {
    next(err);
  }
};

const updateProfile = async (req, res, next) => {
  const { full_name, phone, avatar_url } = req.body;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({
        success: true,
        message: 'Profile updated successfully (Mock Mode)',
        profile: { id: req.user.id, full_name, phone, avatar_url, role: req.user.role }
      });
    }

    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name, phone, avatar_url, updated_at: new Date() })
      .eq('id', req.user.id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({
      success: true,
      message: 'Profile updated successfully.',
      profile: data
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  signup,
  login,
  getProfile,
  updateProfile
};
