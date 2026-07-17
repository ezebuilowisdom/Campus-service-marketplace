-- Seed data for Campus Service Marketplace

-- Insert Roles
INSERT INTO public.roles (id, name) VALUES
(1, 'admin'),
(2, 'provider'),
(3, 'customer')
ON CONFLICT (id) DO NOTHING;

-- Insert Booking Statuses
INSERT INTO public.booking_status (id, name) VALUES
(1, 'pending'),
(2, 'accepted'),
(3, 'rejected'),
(4, 'paid'),
(5, 'completed'),
(6, 'confirmed'),
(7, 'cancelled')
ON CONFLICT (id) DO NOTHING;

-- Insert Payment Methods
INSERT INTO public.payment_methods (id, name) VALUES
(1, 'card'),
(2, 'bank_transfer'),
(3, 'ussd'),
(4, 'wallet')
ON CONFLICT (id) DO NOTHING;

-- Insert Categories
INSERT INTO public.categories (id, name, slug, icon, image_url, description) VALUES
(1, 'Graphic Design', 'graphic-design', 'FiTrendingUp', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80', 'Logos, flyers, brand identity, and custom graphics.'),
(2, 'Web Development', 'web-development', 'FiGlobe', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80', 'Custom portfolios, websites, and bug fixes.'),
(3, 'Mobile App Development', 'mobile-app', 'FiSmartphone', 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80', 'Android and iOS mobile applications.'),
(4, 'Photography', 'photography', 'FiCamera', 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', 'Convocations, photo shoots, and campus events.'),
(5, 'Videography', 'videography', 'FiVideo', 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80', 'Event coverage, short videos, reels, and editing.'),
(6, 'Hair Dressing', 'hair-dressing', 'FiScissors', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', 'Braids, twists, wig installation, and styling.'),
(7, 'Barbering', 'barbering', 'FiScissors', 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80', 'Haircuts, hair dye, shaving, and line-ups.'),
(8, 'Laundry', 'laundry', 'FiLayers', 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80', 'Wash, dry, iron, and delivery packages.'),
(9, 'Cleaning', 'cleaning', 'FiTrash', 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', 'Hostel room clean-ups and moving-in cleaning.'),
(10, 'Laptop Repair', 'laptop-repair', 'FiCpu', 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80', 'OS installation, screen replacement, and RAM upgrades.'),
(11, 'Phone Repair', 'phone-repair', 'FiSmartphone', 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', 'Screen fix, charging port repair, and battery swaps.'),
(12, 'Tutoring', 'tutoring', 'FiBookOpen', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', 'Maths, Coding, Physics, and course-specific tutorials.'),
(13, 'Assignment Typing', 'assignment-typing', 'FiFileText', 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80', 'Fast typing, latex formatting, and proofreading.'),
(14, 'CV Writing', 'cv-writing', 'FiEdit3', 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', 'Professional CVs, cover letters, and LinkedIn optimize.'),
(15, 'Printing', 'printing', 'FiPrinter', 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', 'Document printing, spiral binding, and project delivery.'),
(16, 'Fashion Design', 'fashion-design', 'FiGift', 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', 'Traditional wear, repairs, fitting, and bespoke outfits.'),
(17, 'Makeup', 'makeup', 'FiEye', 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', 'Convocations, birthdays, and beauty sessions.'),
(18, 'Event Decoration', 'event-decoration', 'FiMapPin', 'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&w=600&q=80', 'Birthday setups, student union event planning.'),
(19, 'Delivery Services', 'delivery-services', 'FiTruck', 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80', 'Errands, food pick-up, and hostel packages.'),
(20, 'Others', 'others', 'FiPlusCircle', 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', 'Other custom campus-tailored gigs and services.')
ON CONFLICT (id) DO NOTHING;

-- Insert System Settings
INSERT INTO public.system_settings (key, value, description) VALUES
('platform_fee_percent', '5.0', 'Platform fee percentage charged on escrow withdrawals'),
('allow_automatic_refunds', 'true', 'Automatically refund customer if booking rejected'),
('max_payout_days', '3', 'Number of days to process withdrawal request')
ON CONFLICT (key) DO NOTHING;

-- Insert Mock Profiles
-- 1. Admin
INSERT INTO public.profiles (id, email, full_name, role_id, status) VALUES
('a1111111-1111-1111-1111-111111111111', 'admin@campusmarketplace.edu', 'Professor Clark (Admin)', 1, 'active')
ON CONFLICT (id) DO NOTHING;

-- 2. Providers
INSERT INTO public.profiles (id, email, full_name, role_id, status) VALUES
('b1111111-1111-1111-1111-111111111111', 'dave.dev@campusmarketplace.edu', 'David Adebayo', 2, 'active'),
('b2222222-2222-2222-2222-222222222222', 'sarah.braids@campusmarketplace.edu', 'Sarah Jenkins', 2, 'active'),
('b3333333-3333-3333-3333-333333333333', 'prof.tutor@campusmarketplace.edu', 'Professor Tutoring', 2, 'active')
ON CONFLICT (id) DO NOTHING;

-- 3. Customers
INSERT INTO public.profiles (id, email, full_name, role_id, status) VALUES
('c1111111-1111-1111-1111-111111111111', 'alice.student@campusmarketplace.edu', 'Alice Cooper', 3, 'active'),
('c2222222-2222-2222-2222-222222222222', 'bob.freshman@campusmarketplace.edu', 'Bob Sterling', 3, 'active')
ON CONFLICT (id) DO NOTHING;

-- Populate Wallets
INSERT INTO public.wallets (user_id, balance, escrow_balance) VALUES
('a1111111-1111-1111-1111-111111111111', 1500.00, 0.00),
('b1111111-1111-1111-1111-111111111111', 450.00, 120.00),
('b2222222-2222-2222-2222-222222222222', 280.00, 0.00),
('b3333333-3333-3333-3333-333333333333', 0.00, 0.00),
('c1111111-1111-1111-1111-111111111111', 200.00, 0.00),
('c2222222-2222-2222-2222-222222222222', 500.00, 120.00)
ON CONFLICT (user_id) DO NOTHING;

-- Populate Providers
INSERT INTO public.providers (id, bio, verification_status, rating_average) VALUES
('b1111111-1111-1111-1111-111111111111', 'Computer Science student specializing in building high-quality websites, landing pages, and API integrations.', 'approved', 4.85),
('b2222222-2222-2222-2222-222222222222', 'Experienced stylist and hairdresser. Specializing in knotless braids, dreadlocks, crochet, and wig sewing.', 'approved', 5.00),
('b3333333-3333-3333-3333-333333333333', 'Graduate tutor helping students ace courses in Calculus, Linear Algebra, and Intro Python.', 'pending', 0.00)
ON CONFLICT (id) DO NOTHING;

-- Populate Customers
INSERT INTO public.customers (id, matric_number, department) VALUES
('c1111111-1111-1111-1111-111111111111', 'MATRIC/2023/1004', 'Electrical Engineering'),
('c2222222-2222-2222-2222-222222222222', 'MATRIC/2024/0987', 'Business Administration')
ON CONFLICT (id) DO NOTHING;

-- Insert Mock Services
-- Services for David Adebayo (b1111111...)
INSERT INTO public.services (id, provider_id, category_id, title, description, price, duration_minutes, location_type, status, image_url) VALUES
('s1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', 2, 'Vite + React Web App Portfolio', 'A premium, modern, lightning-fast portfolio website designed with Tailwind CSS. Includes 3 pages, responsiveness, and deployment to Netlify or Vercel.', 120.00, 1440, 'online', 'active', 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80'),
('s2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 1, 'Creative Poster & Flyer Design', 'Stunning design for campus clubs, events, parties, and corporate presentations. Includes high-resolution source files (PSD/Figma).', 15.00, 480, 'online', 'active', 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- Services for Sarah Jenkins (b2222222...)
INSERT INTO public.services (id, provider_id, category_id, title, description, price, duration_minutes, location_type, status, image_url) VALUES
('s3333333-3333-3333-3333-333333333333', 'b2222222-2222-2222-2222-222222222222', 6, 'Knotless Braids - Medium/Long', 'Professional knotless braids styled directly at your hostel room or my studio. Duration is roughly 4 hours. Hair extensions not provided.', 45.00, 240, 'campus', 'active', 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80'),
('s4444444-4444-4444-4444-444444444444', 'b2222222-2222-2222-2222-222222222222', 6, 'Wig Installation & Styling', 'Clean wig customization, hairline plucking, bleaching knots, glueless or glued installation and styling.', 25.00, 90, 'campus', 'active', 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- Services for Professor Tutoring (b3333333...)
INSERT INTO public.services (id, provider_id, category_id, title, description, price, duration_minutes, location_type, status, image_url) VALUES
('s5555555-5555-5555-5555-555555555555', 'b3333333-3333-3333-3333-333333333333', 12, 'Calculus & Algebra Prep Session', 'Private 1-on-1 prep session for upcoming midterm exams. Focuses on solved past papers and clarifying doubts.', 10.00, 60, 'campus', 'active', 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80')
ON CONFLICT (id) DO NOTHING;

-- Service Locations
INSERT INTO public.service_locations (service_id, building_name, room_number) VALUES
('s3333333-3333-3333-3333-333333333333', 'Block C Hall of Residence', 'Room 205'),
('s4444444-4444-4444-4444-444444444444', 'Block C Hall of Residence', 'Room 205'),
('s5555555-5555-5555-5555-555555555555', 'Main Library Annex', 'Study Room 4')
ON CONFLICT DO NOTHING;

-- Availability schedule
INSERT INTO public.availability_schedule (provider_id, day_of_week, start_time, end_time, is_available) VALUES
('b1111111-1111-1111-1111-111111111111', 1, '09:00:00', '18:00:00', true),
('b1111111-1111-1111-1111-111111111111', 3, '09:00:00', '18:00:00', true),
('b1111111-1111-1111-1111-111111111111', 5, '09:00:00', '18:00:00', true),
('b2222222-2222-2222-2222-222222222222', 2, '10:00:00', '20:00:00', true),
('b2222222-2222-2222-2222-222222222222', 4, '10:00:00', '20:00:00', true),
('b2222222-2222-2222-2222-222222222222', 6, '08:00:00', '22:00:00', true)
ON CONFLICT DO NOTHING;

-- Portfolios
INSERT INTO public.portfolio (provider_id, media_url, media_type, title, description) VALUES
('b1111111-1111-1111-1111-111111111111', 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8', 'image', 'E-commerce UI Mockup', 'A clean layout designed for a campus clothing shop.'),
('b2222222-2222-2222-2222-222222222222', 'https://images.unsplash.com/photo-1595476108010-b4d1f102b1b1', 'image', 'Cornrows styling project', 'Neat braids project completed for a customer during convocation week.')
ON CONFLICT DO NOTHING;

-- Mock Booking
INSERT INTO public.bookings (id, customer_id, service_id, provider_id, booking_date, booking_time, status_id, notes, price) VALUES
('db000000-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 's1111111-1111-1111-1111-111111111111', 'b1111111-1111-1111-1111-111111111111', '2026-07-20', '14:00:00', 4, 'Need it integrated with my personal domain', 120.00)
ON CONFLICT (id) DO NOTHING;

-- Mock Payment (matching the escrow status)
INSERT INTO public.payments (id, booking_id, customer_id, provider_id, amount, gateway, transaction_reference, escrow_status) VALUES
('p8888888-8888-8888-8888-888888888888', 'db000000-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 120.00, 'simulator', 'TXN-SIM-9874523-CR', 'escrow')
ON CONFLICT (id) DO NOTHING;

-- Mock Wallet Transactions
INSERT INTO public.wallet_transactions (wallet_id, amount, type, status, reference_id, description) VALUES
((SELECT id FROM public.wallets WHERE user_id = 'b1111111-1111-1111-1111-111111111111'), 120.00, 'escrow_hold', 'completed', 'db000000-0000-0000-0000-000000000001', 'Escrow hold for Web App Portfolio booking')
ON CONFLICT DO NOTHING;

-- Mock Reviews (to show ratings)
-- Dave adequacy rating
INSERT INTO public.reviews (booking_id, customer_id, provider_id, service_id, rating, comment) VALUES
('db000000-0000-0000-0000-000000000001', 'c2222222-2222-2222-2222-222222222222', 'b1111111-1111-1111-1111-111111111111', 's1111111-1111-1111-1111-111111111111', 5, 'Dave is extremely talented! The portfolio page is breathtaking. Excellent work and fast delivery!')
ON CONFLICT DO NOTHING;

-- Verification Request
INSERT INTO public.verification_requests (provider_id, status, document_url, reviewer_notes) VALUES
('b3333333-3333-3333-3333-333333333333', 'pending', 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643', 'Upload of tutor student identity card.')
ON CONFLICT DO NOTHING;
