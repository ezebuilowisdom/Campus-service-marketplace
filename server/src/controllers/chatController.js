const { supabase } = require('../config/supabase');

const mockRooms = [
  {
    id: 'room1',
    customer_id: 'c2222222-2222-2222-2222-222222222222',
    provider_id: 'b1111111-1111-1111-1111-111111111111',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    customer: { profiles: { full_name: 'Bob Sterling', avatar_url: '' } },
    provider: { profiles: { full_name: 'David Adebayo', avatar_url: '' } },
    messages: [
      { id: 'm1', sender_id: 'c2222222-2222-2222-2222-222222222222', message_text: 'Hi David, I just paid for the portfolio website booking.', created_at: new Date().toISOString() },
      { id: 'm2', sender_id: 'b1111111-1111-1111-1111-111111111111', message_text: 'Hi Bob, yes! I see the escrow hold. I will start working on it tonight. Thanks!', created_at: new Date().toISOString() }
    ]
  }
];

const getRooms = async (req, res, next) => {
  const { role, id } = req.user;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      return res.status(200).json({ success: true, rooms: mockRooms });
    }

    let query = supabase
      .from('chat_rooms')
      .select(`
        *,
        customer:customers(profiles(full_name, avatar_url)),
        provider:providers(profiles(full_name, avatar_url))
      `);

    if (role === 'customer') {
      query = query.eq('customer_id', id);
    } else if (role === 'provider') {
      query = query.eq('provider_id', id);
    }

    const { data: rooms, error } = await query.order('updated_at', { ascending: false });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, rooms });
  } catch (err) {
    next(err);
  }
};

const getMessages = async (req, res, next) => {
  const { roomId } = req.params;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const room = mockRooms.find(r => r.id === roomId);
      return res.status(200).json({ success: true, messages: room ? room.messages : [] });
    }

    const { data: messages, error } = await supabase
      .from('messages')
      .select('*')
      .eq('chat_room_id', roomId)
      .order('created_at', { ascending: true });

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    res.status(200).json({ success: true, messages });
  } catch (err) {
    next(err);
  }
};

const sendMessage = async (req, res, next) => {
  const { chat_room_id, message_text, media_url } = req.body;
  const sender_id = req.user.id;

  try {
    const isMock = !process.env.SUPABASE_URL || process.env.SUPABASE_URL.includes('placeholder');
    if (isMock) {
      const room = mockRooms.find(r => r.id === chat_room_id);
      const newMessage = {
        id: require('crypto').randomUUID(),
        chat_room_id,
        sender_id,
        message_text,
        media_url,
        is_read: false,
        created_at: new Date().toISOString()
      };
      if (room) {
        room.messages.push(newMessage);
        room.updated_at = new Date().toISOString();
      }
      return res.status(201).json({ success: true, message: newMessage });
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert([{ chat_room_id, sender_id, message_text, media_url }])
      .select()
      .single();

    if (error) {
      return res.status(400).json({ success: false, message: error.message });
    }

    // Update room update timestamp
    await supabase.from('chat_rooms').update({ updated_at: new Date() }).eq('id', chat_room_id);

    res.status(201).json({ success: true, message });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getRooms,
  getMessages,
  sendMessage
};
