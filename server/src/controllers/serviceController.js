const { supabase } = require('../config/supabase');

// Mock data list matching seed.sql
const mockServices = [
  {
    id: 's1111111-1111-1111-1111-111111111111',
    provider_id: 'b1111111-1111-1111-1111-111111111111',
    category_id: 2,
    title: 'Vite + React Web App Portfolio',
    description: 'A premium, modern, lightning-fast portfolio website designed with Tailwind CSS. Includes 3 pages, responsiveness, and deployment to Netlify or Vercel.',
    price: 120.00,
    duration_minutes: 1440,
    location_type: 'online',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1547082299-de196ea013d6?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    provider: {
      full_name: 'David Adebayo',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      rating_average: 4.85
    },
    category: { name: 'Web Development', slug: 'web-development' }
  },
  {
    id: 's2222222-2222-2222-2222-222222222222',
    provider_id: 'b1111111-1111-1111-1111-111111111111',
    category_id: 1,
    title: 'Creative Poster & Flyer Design',
    description: 'Stunning design for campus clubs, events, parties, and corporate presentations. Includes high-resolution source files (PSD/Figma).',
    price: 15.00,
    duration_minutes: 480,
    location_type: 'online',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    provider: {
      full_name: 'David Adebayo',
      avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6',
      rating_average: 4.85
    },
    category: { name: 'Graphic Design', slug: 'graphic-design' }
  },
  {
    id: 's3333333-3333-3333-3333-333333333333',
    provider_id: 'b2222222-2222-2222-2222-222222222222',
    category_id: 6,
    title: 'Knotless Braids - Medium/Long',
    description: 'Professional knotless braids styled directly at your hostel room or my studio. Duration is roughly 4 hours. Hair extensions not provided.',
    price: 45.00,
    duration_minutes: 240,
    location_type: 'campus',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    provider: {
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating_average: 5.00
    },
    category: { name: 'Hair Dressing', slug: 'hair-dressing' }
  },
  {
    id: 's4444444-4444-4444-4444-444444444444',
    provider_id: 'b2222222-2222-2222-2222-222222222222',
    category_id: 6,
    title: 'Wig Installation & Styling',
    description: 'Clean wig customization, hairline plucking, bleaching knots, glueless or glued installation and styling.',
    price: 25.00,
    duration_minutes: 90,
    location_type: 'campus',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1492106087820-71f1a00d2b11?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    provider: {
      full_name: 'Sarah Jenkins',
      avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330',
      rating_average: 5.00
    },
    category: { name: 'Hair Dressing', slug: 'hair-dressing' }
  },
  {
    id: 's5555555-5555-5555-5555-555555555555',
    provider_id: 'b3333333-3333-3333-3333-333333333333',
    category_id: 12,
    title: 'Calculus & Algebra Prep Session',
    description: 'Private 1-on-1 prep session for upcoming midterm exams. Focuses on solved past papers and clarifying doubts.',
    price: 10.00,
    duration_minutes: 60,
    location_type: 'campus',
    status: 'active',
    image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80',
    created_at: new Date().toISOString(),
    provider: {
      full_name: 'Professor Tutoring',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e',
      rating_average: 0.00
    },
    category: { name: 'Tutoring', slug: 'tutoring' }
  }
];

const mockCategories = [
  { id: 1, name: 'Graphic Design', slug: 'graphic-design', icon: 'FiTrendingUp', image_url: 'https://images.unsplash.com/photo-1626785774573-4b799315345d?auto=format&fit=crop&w=600&q=80', description: 'Logos, flyers, brand identity, and custom graphics.' },
  { id: 2, name: 'Web Development', slug: 'web-development', icon: 'FiGlobe', image_url: 'https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=600&q=80', description: 'Custom portfolios, websites, and bug fixes.' },
  { id: 3, name: 'Mobile App Development', slug: 'mobile-app', icon: 'FiSmartphone', image_url: 'https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=600&q=80', description: 'Android and iOS mobile applications.' },
  { id: 4, name: 'Photography', slug: 'photography', icon: 'FiCamera', image_url: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&w=600&q=80', description: 'Convocations, photo shoots, and campus events.' },
  { id: 5, name: 'Videography', slug: 'videography', icon: 'FiVideo', image_url: 'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?auto=format&fit=crop&w=600&q=80', description: 'Event coverage, short videos, reels, and editing.' },
  { id: 6, name: 'Hair Dressing', slug: 'hair-dressing', icon: 'FiScissors', image_url: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?auto=format&fit=crop&w=600&q=80', description: 'Braids, twists, wig installation, and styling.' },
  { id: 7, name: 'Barbering', slug: 'barbering', icon: 'FiScissors', image_url: 'https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=600&q=80', description: 'Haircuts, hair dye, shaving, and line-ups.' },
  { id: 8, name: 'Laundry', slug: 'laundry', icon: 'FiLayers', image_url: 'https://images.unsplash.com/photo-1545173168-9f1947eebd01?auto=format&fit=crop&w=600&q=80', description: 'Wash, dry, iron, and delivery packages.' },
  { id: 9, name: 'Cleaning', slug: 'cleaning', icon: 'FiTrash', image_url: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80', description: 'Hostel room clean-ups and moving-in cleaning.' },
  { id: 10, name: 'Laptop Repair', slug: 'laptop-repair', icon: 'FiCpu', image_url: 'https://images.unsplash.com/photo-1588508065123-287b28e013da?auto=format&fit=crop&w=600&q=80', description: 'OS installation, screen replacement, and RAM upgrades.' },
  { id: 11, name: 'Phone Repair', slug: 'phone-repair', icon: 'FiSmartphone', image_url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80', description: 'Screen fix, charging port repair, and battery swaps.' },
  { id: 12, name: 'Tutoring', slug: 'tutoring', icon: 'FiBookOpen', image_url: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=600&q=80', description: 'Maths, Coding, Physics, and course-specific tutorials.' },
  { id: 13, name: 'Assignment Typing', slug: 'assignment-typing', icon: 'FiFileText', image_url: 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?auto=format&fit=crop&w=600&q=80', description: 'Fast typing, latex formatting, and proofreading.' },
  { id: 14, name: 'CV Writing', slug: 'cv-writing', icon: 'FiEdit3', image_url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?auto=format&fit=crop&w=600&q=80', description: 'Professional CVs, cover letters, and LinkedIn optimize.' },
  { id: 15, name: 'Printing', slug: 'printing', icon: 'FiPrinter', image_url: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=600&q=80', description: 'Document printing, spiral binding, and project delivery.' },
  { id: 16, name: 'Fashion Design', slug: 'fashion-design', icon: 'FiGift', image_url: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?auto=format&fit=crop&w=600&q=80', description: 'Traditional wear, repairs, fitting, and bespoke outfits.' },
  { id: 17, name: 'Makeup', slug: 'makeup', icon: 'FiEye', image_url: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80', description: 'Convocations, birthdays, and beauty sessions.' },
  { id: 18, name: 'Event Decoration', slug: 'event-decoration', icon: 'FiMapPin', image_url: 'https://images.unsplash.com/photo-1478812954026-9c750f0e89fc?auto=format&fit=crop&w=600&q=80', description: 'Birthday setups, student union event planning.' },
  { id: 19, name: 'Delivery Services', slug: 'delivery-services', icon: 'FiTruck', image_url: 'https://images.unsplash.com/photo-1527018601619-a508a2be00cd?auto=format&fit=crop&w=600&q=80', description: 'Errands, food pick-up, and hostel packages.' },
  { id: 20, name: 'Others', slug: 'others', icon: 'FiPlusCircle', image_url: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80', description: 'Other custom campus-tailored gigs and services.' }
];

const getAllServices = async (req, res, next) => {
  const { search, category, minPrice, maxPrice, location, rating, sort } = req.query;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      let filtered = [...mockServices];

      if (search) {
        filtered = filtered.filter(s => 
          s.title.toLowerCase().includes(search.toLowerCase()) || 
          s.description.toLowerCase().includes(search.toLowerCase())
        );
      }

      if (category) {
        filtered = filtered.filter(s => s.category.slug === category);
      }

      if (minPrice) {
        filtered = filtered.filter(s => s.price >= parseFloat(minPrice));
      }

      if (maxPrice) {
        filtered = filtered.filter(s => s.price <= parseFloat(maxPrice));
      }

      if (location) {
        filtered = filtered.filter(s => s.location_type === location);
      }

      if (rating) {
        filtered = filtered.filter(s => s.provider.rating_average >= parseFloat(rating));
      }

      if (sort) {
        if (sort === 'price_asc') filtered.sort((a, b) => a.price - b.price);
        if (sort === 'price_desc') filtered.sort((a, b) => b.price - a.price);
        if (sort === 'rating') filtered.sort((a, b) => b.provider.rating_average - a.provider.rating_average);
        if (sort === 'newest') filtered.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
      }

      return res.status(200).json({ success: true, count: filtered.length, services: filtered });
    }

    // Database querying
    let query = supabase
      .from('services')
      .select('*, provider:providers(rating_average, profiles(full_name, avatar_url)), category:categories(name, slug)')
      .eq('status', 'active');

    if (search) {
      query = query.ilike('title', `%${search}%`);
    }

    if (category) {
      // Fetch category ID from slug
      const { data: catData } = await supabase.from('categories').select('id').eq('slug', category).single();
      if (catData) {
        query = query.eq('category_id', catData.id);
      }
    }

    if (minPrice) {
      query = query.gte('price', parseFloat(minPrice));
    }

    if (maxPrice) {
      query = query.lte('price', parseFloat(maxPrice));
    }

    if (location) {
      query = query.eq('location_type', location);
    }

    // Parse sorting options
    if (sort) {
      if (sort === 'price_asc') query = query.order('price', { ascending: true });
      else if (sort === 'price_desc') query = query.order('price', { ascending: false });
      else if (sort === 'newest') query = query.order('created_at', { ascending: false });
    } else {
      query = query.order('created_at', { ascending: false });
    }

    const { data: services, error } = await query;

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Client-side rating filter since it's nested
    let results = services || [];
    if (rating) {
      results = results.filter(s => s.provider && s.provider.rating_average >= parseFloat(rating));
    }

    res.status(200).json({ success: true, count: results.length, services: results });
  } catch (err) {
    next(err);
  }
};

const getServiceById = async (req, res, next) => {
  const { id } = req.params;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const service = mockServices.find(s => s.id === id);
      if (!service) {
        return res.status(404).json({ success: false, message: 'Service not found.' });
      }

      // Append mock location and reviews
      const serviceDetail = {
        ...service,
        service_locations: [{ building_name: 'Block C Hall', room_number: '205' }],
        reviews: [
          {
            id: 'r1',
            rating: 5,
            comment: 'Highly recommended! Deliverable was outstanding.',
            created_at: new Date().toISOString(),
            customer: { profiles: { full_name: 'Alice Cooper', avatar_url: '' } }
          }
        ]
      };
      return res.status(200).json({ success: true, service: serviceDetail });
    }

    const { data: service, error } = await supabase
      .from('services')
      .select(`
        *, 
        provider:providers(bio, rating_average, profiles(full_name, avatar_url, phone)), 
        category:categories(name, slug),
        service_locations(*),
        service_images(*)
      `)
      .eq('id', id)
      .single();

    if (error || !service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    // Fetch service reviews
    const { data: reviews } = await supabase
      .from('reviews')
      .select('*, customer:customers(profiles(full_name, avatar_url))')
      .eq('service_id', id);

    res.status(200).json({ success: true, service: { ...service, reviews: reviews || [] } });
  } catch (err) {
    next(err);
  }
};

const createService = async (req, res, next) => {
  const { category_id, title, description, price, duration_minutes, location_type, building_name, room_number } = req.body;
  const provider_id = req.user.id;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const mockId = require('crypto').randomUUID();
      const newMockService = {
        id: mockId,
        provider_id,
        category_id,
        title,
        description,
        price: parseFloat(price),
        duration_minutes: parseInt(duration_minutes),
        location_type,
        status: 'active',
        created_at: new Date().toISOString(),
        provider: { full_name: req.user.name, avatar_url: '', rating_average: 5.00 },
        category: { name: 'Custom Gigs', slug: 'custom-gigs' }
      };
      mockServices.push(newMockService);
      return res.status(201).json({ success: true, message: 'Service created successfully (Mock Mode)', service: newMockService });
    }

    // Check provider verification status
    const { data: provider, error: providerError } = await supabase
      .from('providers')
      .select('verification_status')
      .eq('id', provider_id)
      .single();

    if (providerError || !provider) {
      return res.status(400).json({ success: false, message: 'Provider profile not found.' });
    }

    if (provider.verification_status !== 'approved') {
      return res.status(403).json({ 
        success: false, 
        message: 'Your account must be approved by an administrator before you can list services.' 
      });
    }

    // Create service record
    const { data: service, error } = await supabase
      .from('services')
      .insert([{ provider_id, category_id, title, description, price, duration_minutes, location_type }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Add service location if campus
    if (location_type === 'campus' && building_name) {
      await supabase.from('service_locations').insert([{
        service_id: service.id,
        building_name,
        room_number
      }]);
    }

    res.status(201).json({ success: true, message: 'Service listed successfully.', service });
  } catch (err) {
    next(err);
  }
};

const updateService = async (req, res, next) => {
  const { id } = req.params;
  const { title, description, price, duration_minutes, location_type, status } = req.body;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const idx = mockServices.findIndex(s => s.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Service not found.' });

      mockServices[idx] = { ...mockServices[idx], title, description, price, duration_minutes, location_type, status };
      return res.status(200).json({ success: true, message: 'Service updated (Mock Mode)', service: mockServices[idx] });
    }

    const { data, error } = await supabase
      .from('services')
      .update({ title, description, price, duration_minutes, location_type, status, updated_at: new Date() })
      .eq('id', id)
      .eq('provider_id', req.user.id) // Ensure ownership
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: 'Service updated successfully.', service: data });
  } catch (err) {
    next(err);
  }
};

const deleteService = async (req, res, next) => {
  const { id } = req.params;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const idx = mockServices.findIndex(s => s.id === id);
      if (idx === -1) return res.status(404).json({ success: false, message: 'Service not found.' });
      mockServices.splice(idx, 1);
      return res.status(200).json({ success: true, message: 'Service deleted (Mock Mode)' });
    }

    const { error } = await supabase
      .from('services')
      .delete()
      .eq('id', id)
      .eq('provider_id', req.user.id);

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, message: 'Service deleted successfully.' });
  } catch (err) {
    next(err);
  }
};

const getCategories = async (req, res, next) => {
  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({ success: true, categories: mockCategories });
    }

    const { data, error } = await supabase.from('categories').select('*').order('name');
    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, categories: data });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAllServices,
  getServiceById,
  createService,
  updateService,
  deleteService,
  getCategories
};
