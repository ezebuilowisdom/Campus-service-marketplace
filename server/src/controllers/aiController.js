const { supabase } = require('../config/supabase');

// Mock services lists matching seed.sql for offline fallback
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
    provider: { full_name: 'David Adebayo', avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6', rating_average: 4.85 },
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
    provider: { full_name: 'David Adebayo', avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6', rating_average: 4.85 },
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
    provider: { full_name: 'Sarah Jenkins', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', rating_average: 5.00 },
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
    provider: { full_name: 'Sarah Jenkins', avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330', rating_average: 5.00 },
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
    provider: { full_name: 'Professor Tutoring', avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e', rating_average: 0.00 },
    category: { name: 'Tutoring', slug: 'tutoring' }
  }
];

const queryAssistant = async (req, res, next) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query parameter is required.' });
  }

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    
    // 1. Parse natural language keywords
    const lowerQuery = query.toLowerCase();
    
    // Category detection mapping
    let matchedCategoryId = null;
    let categoryName = "";
    
    if (lowerQuery.includes('web') || lowerQuery.includes('site') || lowerQuery.includes('code') || lowerQuery.includes('developer') || lowerQuery.includes('react')) {
      matchedCategoryId = 2;
      categoryName = "Web Development";
    } else if (lowerQuery.includes('graphic') || lowerQuery.includes('flyer') || lowerQuery.includes('logo') || lowerQuery.includes('design') || lowerQuery.includes('poster')) {
      matchedCategoryId = 1;
      categoryName = "Graphic Design";
    } else if (lowerQuery.includes('hair') || lowerQuery.includes('braid') || lowerQuery.includes('wig') || lowerQuery.includes('dress')) {
      matchedCategoryId = 6;
      categoryName = "Hair Dressing";
    } else if (lowerQuery.includes('barber') || lowerQuery.includes('cut') || lowerQuery.includes('shave')) {
      matchedCategoryId = 7;
      categoryName = "Barbering";
    } else if (lowerQuery.includes('repair') || lowerQuery.includes('fix') || lowerQuery.includes('laptop') || lowerQuery.includes('computer')) {
      matchedCategoryId = 10;
      categoryName = "Laptop Repair";
    } else if (lowerQuery.includes('phone') || lowerQuery.includes('screen')) {
      matchedCategoryId = 11;
      categoryName = "Phone Repair";
    } else if (lowerQuery.includes('tutor') || lowerQuery.includes('math') || lowerQuery.includes('python') || lowerQuery.includes('calculus') || lowerQuery.includes('class')) {
      matchedCategoryId = 12;
      categoryName = "Tutoring";
    } else if (lowerQuery.includes('delivery') || lowerQuery.includes('errand')) {
      matchedCategoryId = 19;
      categoryName = "Delivery Services";
    }

    // Budget price parsing (e.g. "under 100", "under GH₵50", "less than $40")
    let priceLimit = null;
    const priceRegex = /(?:under|less than|below|budget of|gh₵|\$)\s*(\d+)/i;
    const match = lowerQuery.match(priceRegex);
    if (match && match[1]) {
      priceLimit = parseFloat(match[1]);
    }

    // Best/Rating detection
    const isQualityPreferred = lowerQuery.includes('best') || lowerQuery.includes('top') || lowerQuery.includes('highest') || lowerQuery.includes('rated');

    let services = [];

    // 2. Fetch services based on parsed tags
    if (isMock) {
      services = [...mockServices];
    } else {
      // Query database
      const { data, error } = await supabase
        .from('services')
        .select('*, provider:providers(rating_average, profiles(full_name, avatar_url)), category:categories(name, slug)')
        .eq('status', 'active');
      
      if (!error && data) {
        // Normalize fields for easy sorting
        services = data.map(s => ({
          ...s,
          provider: {
            full_name: s.provider?.profiles?.full_name,
            avatar_url: s.provider?.profiles?.avatar_url,
            rating_average: parseFloat(s.provider?.rating_average || 0.00)
          },
          category: {
            name: s.category?.name,
            slug: s.category?.slug
          }
        }));
      }
    }

    // 3. Filter services list
    let filtered = [...services];
    
    if (matchedCategoryId) {
      filtered = filtered.filter(s => s.category_id === matchedCategoryId);
    }
    
    if (priceLimit) {
      filtered = filtered.filter(s => s.price <= priceLimit);
    }

    // 4. Sort based on queries (best = ratings desc, cheapest = price asc)
    if (isQualityPreferred) {
      filtered.sort((a, b) => b.provider.rating_average - a.provider.rating_average);
    } else {
      // default: sort by cheapest
      filtered.sort((a, b) => a.price - b.price);
    }

    // 5. Build assistant conversational response
    let answer = "";
    if (filtered.length === 0) {
      answer = `I scanned the campus registry but couldn't find any active services matching your query. `;
      if (priceLimit) {
        answer += `Try raising your budget from $${priceLimit} or checking another category.`;
      } else {
        answer += `Try searching for standard keywords like "Web Development", "Hair Dressing", or "Calculus Tutoring".`;
      }
    } else {
      const topMatch = filtered[0];
      const providerName = topMatch.provider?.full_name || 'Vetted Provider';
      const priceVal = parseFloat(topMatch.price).toFixed(2);
      const ratingVal = topMatch.provider?.rating_average || 'no ratings yet';

      if (isQualityPreferred) {
        answer = `According to reviews, the highest rated service matching your query is **"${topMatch.title}"** by **${providerName}**. They have a rating of **${ratingVal}★** and charge **$${priceVal}**.`;
      } else if (priceLimit) {
        answer = `I found a great budget option under $${priceLimit}! I recommend **"${topMatch.title}"** by **${providerName}** for **$${priceVal}** (Rating: **${ratingVal}★**).`;
      } else {
        answer = `Here is the best recommendation matching your request: **"${topMatch.title}"** by **${providerName}** starting at **$${priceVal}** (Rating: **${ratingVal}★**).`;
      }

      if (filtered.length > 1) {
        answer += ` I also found ${filtered.length - 1} other alternative match(es) for you to check out below.`;
      }
    }

    res.status(200).json({
      success: true,
      answer,
      recommendations: filtered
    });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  queryAssistant
};
