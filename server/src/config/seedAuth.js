const { supabaseAdmin } = require('./supabase');

const demoUsers = [
  { id: 'a1111111-1111-1111-1111-111111111111', email: 'admin@campusmarketplace.edu', full_name: 'Professor Clark (Admin)', role: 'admin' },
  { id: 'b1111111-1111-1111-1111-111111111111', email: 'dave.dev@campusmarketplace.edu', full_name: 'David Adebayo', role: 'provider' },
  { id: 'b2222222-2222-2222-2222-222222222222', email: 'sarah.braids@campusmarketplace.edu', full_name: 'Sarah Jenkins', role: 'provider' },
  { id: 'b3333333-3333-3333-3333-333333333333', email: 'prof.tutor@campusmarketplace.edu', full_name: 'Professor Tutoring', role: 'provider' },
  { id: 'c1111111-1111-1111-1111-111111111111', email: 'alice.student@campusmarketplace.edu', full_name: 'Alice Cooper', role: 'customer' },
  { id: 'c2222222-2222-2222-2222-222222222222', email: 'bob.freshman@campusmarketplace.edu', full_name: 'Bob Sterling', role: 'customer' }
];

async function seedAuthUsers() {
  console.log('🌱 Syncing demo auth users into Supabase Auth...');
  for (const user of demoUsers) {
    try {
      const { data, error } = await supabaseAdmin.auth.admin.createUser({
        id: user.id,
        email: user.email,
        password: 'password123',
        email_confirm: true,
        user_metadata: { full_name: user.full_name, role: user.role }
      });
      if (error) {
        if (error.message.includes('already') || error.status === 422) {
          // Reset password if user already exists
          await supabaseAdmin.auth.admin.updateUserById(user.id, { password: 'password123' });
          console.log(`  ✓ Demo user ${user.email} updated`);
        } else {
          console.warn(`  ⚠️ Could not create ${user.email}: ${error.message}`);
        }
      } else {
        console.log(`  ✓ Demo user ${user.email} created with id ${user.id}`);
      }
    } catch (err) {
      console.warn(`  ⚠️ Exception seeding ${user.email}: ${err.message}`);
    }
  }
}

module.exports = seedAuthUsers;
