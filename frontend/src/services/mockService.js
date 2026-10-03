// Client-side Mock Data Store & Handler for Standalone / Vercel Preview Deployments
const STORAGE_PREFIX = 'swiftship_demo_';

const initialUsers = [
  {
    id: 'user-admin-1',
    name: 'SwiftShip Systems Admin',
    email: 'admin@swiftship.demo',
    password: 'password123',
    role: 'ADMIN',
    phone: '+91 98765 00001',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'SwiftShip HQ, OMR Tech Corridor',
    pincode: '600096',
    isActive: true,
  },
  {
    id: 'user-support-1',
    name: 'Anitha Support Specialist',
    email: 'support@swiftship.demo',
    password: 'password123',
    role: 'SUPPORT',
    phone: '+91 98765 00002',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'SwiftShip Support Hub, Mount Road',
    pincode: '600002',
    isActive: true,
  },
  {
    id: 'user-agent-1',
    name: 'Karthik Raja',
    email: 'agent1@swiftship.demo',
    password: 'password123',
    role: 'DELIVERY_AGENT',
    phone: '+91 98765 11111',
    city: 'Chennai',
    state: 'Tamil Nadu',
    address: 'Velachery Logistics Hub',
    pincode: '600042',
    isActive: true,
  },
  {
    id: 'user-agent-2',
    name: 'Murugan S',
    email: 'agent2@swiftship.demo',
    password: 'password123',
    role: 'DELIVERY_AGENT',
    phone: '+91 98765 22222',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: 'RS Puram Logistics Yard',
    pincode: '641002',
    isActive: true,
  },
  {
    id: 'user-agent-3',
    name: 'Priya V',
    email: 'agent3@swiftship.demo',
    password: 'password123',
    role: 'DELIVERY_AGENT',
    phone: '+91 98765 33333',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    address: 'Palayamkottai Hub',
    pincode: '627002',
    isActive: true,
  },
  {
    id: 'user-cust-1',
    name: 'Arun Kumar',
    email: 'customer1@swiftship.demo',
    password: 'password123',
    role: 'CUSTOMER',
    phone: '+91 94433 10001',
    city: 'Tirunelveli',
    state: 'Tamil Nadu',
    address: '42 High Road, Palayamkottai',
    pincode: '627002',
    isActive: true,
  },
  {
    id: 'user-cust-2',
    name: 'Deepa Ramesh',
    email: 'customer2@swiftship.demo',
    password: 'password123',
    role: 'CUSTOMER',
    phone: '+91 94433 20002',
    city: 'Coimbatore',
    state: 'Tamil Nadu',
    address: '15 Avinashi Road, Peelamedu',
    pincode: '641004',
    isActive: true,
  },
];

const initialParcels = [
  {
    id: 'parcel-10001',
    trackingNumber: 'SST-20261002-10001',
    customerId: 'user-cust-1',
    assignedAgentId: 'user-agent-1',
    packageDescription: 'Dell XPS 15 Laptop & Accessories',
    weight: 3.5,
    length: 38,
    width: 26,
    height: 10,
    priority: 'EXPRESS',
    status: 'OUT_FOR_DELIVERY',
    currentLocation: 'Chennai Central Hub',
    shippingCost: 380,
    estimatedDeliveryDate: new Date(Date.now() + 4 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
    sender: {
      name: 'Arun Kumar',
      phone: '+91 94433 10001',
      email: 'customer1@swiftship.demo',
      address: '42 High Road',
      city: 'Tirunelveli',
      state: 'Tamil Nadu',
      pincode: '627002',
    },
    receiver: {
      name: 'Lakshmi Narayanan',
      phone: '+91 98940 99881',
      email: 'lakshmi@example.com',
      address: '12 T Nagar Main Road',
      city: 'Chennai',
      state: 'Tamil Nadu',
      pincode: '600017',
    },
    assignedAgent: {
      id: 'user-agent-1',
      name: 'Karthik Raja',
      phone: '+91 98765 11111',
      email: 'agent1@swiftship.demo',
    },
    trackingEvents: [
      {
        id: 'te-1-5',
        status: 'OUT_FOR_DELIVERY',
        location: 'Chennai Central Hub',
        message: 'Parcel loaded into delivery vehicle with agent Karthik Raja.',
        timestamp: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-1-4',
        status: 'IN_TRANSIT',
        location: 'Chennai Central Hub',
        message: 'Arrived at destination hub for final delivery dispatch.',
        timestamp: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-1-3',
        status: 'IN_TRANSIT',
        location: 'Coimbatore Sorting Facility',
        message: 'Parcel scanned at regional sorting center.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-1-2',
        status: 'PICKED_UP',
        location: 'Tirunelveli Hub',
        message: 'Picked up from sender location in Palayamkottai.',
        timestamp: new Date(Date.now() - 42 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-1-1',
        status: 'BOOKED',
        location: 'Tirunelveli',
        message: 'Parcel successfully booked by customer.',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'parcel-10002',
    trackingNumber: 'SST-20261002-10002',
    customerId: 'user-cust-2',
    assignedAgentId: 'user-agent-2',
    packageDescription: 'Organic Cotton Garments Sample Set',
    weight: 1.8,
    length: 25,
    width: 20,
    height: 8,
    priority: 'STANDARD',
    status: 'DELIVERED',
    currentLocation: 'Coimbatore RS Puram',
    shippingCost: 200,
    estimatedDeliveryDate: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    sender: {
      name: 'Deepa Ramesh',
      phone: '+91 94433 20002',
      email: 'customer2@swiftship.demo',
      address: '15 Avinashi Road',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641004',
    },
    receiver: {
      name: 'Kavitha S',
      phone: '+91 98421 77662',
      email: 'kavitha@example.com',
      address: '55 DB Road, RS Puram',
      city: 'Coimbatore',
      state: 'Tamil Nadu',
      pincode: '641002',
    },
    assignedAgent: {
      id: 'user-agent-2',
      name: 'Murugan S',
      phone: '+91 98765 22222',
      email: 'agent2@swiftship.demo',
    },
    trackingEvents: [
      {
        id: 'te-2-5',
        status: 'DELIVERED',
        location: 'Coimbatore RS Puram',
        message: 'Delivered successfully to receiver Kavitha S.',
        timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-2-4',
        status: 'OUT_FOR_DELIVERY',
        location: 'Coimbatore RS Puram',
        message: 'Dispatched for delivery with Agent Murugan S.',
        timestamp: new Date(Date.now() - 28 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-2-3',
        status: 'IN_TRANSIT',
        location: 'Coimbatore Main Yard',
        message: 'Sorting completed.',
        timestamp: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-2-2',
        status: 'PICKED_UP',
        location: 'Coimbatore Peelamedu',
        message: 'Picked up from sender.',
        timestamp: new Date(Date.now() - 68 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-2-1',
        status: 'BOOKED',
        location: 'Coimbatore',
        message: 'Shipment registered online.',
        timestamp: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
      },
    ],
  },
  {
    id: 'parcel-10003',
    trackingNumber: 'SST-20261002-10003',
    customerId: 'user-cust-1',
    assignedAgentId: 'user-agent-3',
    packageDescription: 'Handicraft Brass Temple Idol',
    weight: 4.2,
    length: 30,
    width: 30,
    height: 40,
    priority: 'PRIORITY',
    status: 'IN_TRANSIT',
    currentLocation: 'Madurai Express Hub',
    shippingCost: 450,
    estimatedDeliveryDate: new Date(Date.now() + 24 * 3600 * 1000).toISOString(),
    createdAt: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
    updatedAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    sender: {
      name: 'Suresh Chandran',
      phone: '+91 94433 30003',
      email: 'customer3@swiftship.demo',
      address: '88 KK Nagar',
      city: 'Madurai',
      state: 'Tamil Nadu',
      pincode: '625020',
    },
    receiver: {
      name: 'Ganesh Ram',
      phone: '+91 97890 55443',
      email: 'ganesh@example.com',
      address: '22 South Bypass',
      city: 'Tirunelveli',
      state: 'Tamil Nadu',
      pincode: '627005',
    },
    assignedAgent: {
      id: 'user-agent-3',
      name: 'Priya V',
      phone: '+91 98765 33333',
      email: 'agent3@swiftship.demo',
    },
    trackingEvents: [
      {
        id: 'te-3-3',
        status: 'IN_TRANSIT',
        location: 'Madurai Express Hub',
        message: 'Loaded onto interstate transit transport to Tirunelveli.',
        timestamp: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-3-2',
        status: 'PICKED_UP',
        location: 'Madurai KK Nagar',
        message: 'Agent picked up parcel from customer home.',
        timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
      },
      {
        id: 'te-3-1',
        status: 'BOOKED',
        location: 'Madurai',
        message: 'Shipment created and paid.',
        timestamp: new Date(Date.now() - 12 * 3600 * 1000).toISOString(),
      },
    ],
  },
];

const initialTickets = [
  {
    id: 'ticket-1',
    subject: 'Request delivery reschedule to evening',
    description: 'Please arrange delivery after 6:00 PM as I will not be home during the afternoon.',
    status: 'IN_PROGRESS',
    priority: 'MEDIUM',
    trackingNumber: 'SST-20261002-10001',
    customerId: 'user-cust-1',
    createdAt: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    resolutionNotes: 'Notified delivery agent Karthik Raja.',
    user: {
      id: 'user-cust-1',
      name: 'Arun Kumar',
      email: 'customer1@swiftship.demo',
      phone: '+91 94433 10001',
    },
    parcel: {
      id: 'parcel-10001',
      trackingNumber: 'SST-20261002-10001',
      status: 'OUT_FOR_DELIVERY',
      currentLocation: 'Chennai Central Hub',
    },
  },
];

const initialNotifications = [
  {
    id: 'notif-1',
    userId: 'user-cust-1',
    title: 'Out for Delivery',
    message: 'Shipment SST-20261002-10001 is out for delivery with Karthik Raja.',
    type: 'INFO',
    isRead: false,
    createdAt: new Date(Date.now() - 1 * 3600 * 1000).toISOString(),
  },
  {
    id: 'notif-2',
    userId: 'user-cust-2',
    title: 'Delivered Successfully',
    message: 'Shipment SST-20261002-10002 was delivered to Coimbatore RS Puram.',
    type: 'SUCCESS',
    isRead: true,
    createdAt: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
  },
];

function getStore(key, initial) {
  try {
    const item = localStorage.getItem(STORAGE_PREFIX + key);
    if (!item) {
      localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(initial));
      return initial;
    }
    return JSON.parse(item);
  } catch {
    return initial;
  }
}

function setStore(key, val) {
  try {
    localStorage.setItem(STORAGE_PREFIX + key, JSON.stringify(val));
  } catch (e) {
    console.error('Storage write error:', e);
  }
}

export function handleMockRequest(config) {
  const method = (config.method || 'get').toLowerCase();
  const url = (config.url || '').replace(/^\/api/, '');
  const [path, queryString] = url.split('?');
  const params = new URLSearchParams(queryString || '');
  const body = typeof config.data === 'string' ? JSON.parse(config.data || '{}') : (config.data || {});

  const currentToken = localStorage.getItem('swiftship_token');
  const currentUserJson = localStorage.getItem('swiftship_user');
  const currentUser = currentUserJson ? JSON.parse(currentUserJson) : null;

  // 1. AUTH: POST /auth/login
  if (path === '/auth/login' && method === 'post') {
    const users = getStore('users', initialUsers);
    const { email, password } = body;
    const user = users.find(u => u.email.toLowerCase().trim() === (email || '').toLowerCase().trim());

    if (!user || user.password !== password) {
      return Promise.reject({
        response: {
          status: 401,
          data: { success: false, message: 'Invalid email or password. Use password123 for demo.' },
        },
      });
    }

    const token = `demo_jwt_token_${user.id}_${Date.now()}`;
    const { password: _, ...userSafe } = user;
    return Promise.resolve({
      status: 200,
      data: { success: true, token, user: userSafe },
    });
  }

  // 2. AUTH: POST /auth/register
  if (path === '/auth/register' && method === 'post') {
    const users = getStore('users', initialUsers);
    const { email, password, name, role, phone, address, city, state, pincode } = body;
    const exists = users.find(u => u.email.toLowerCase().trim() === (email || '').toLowerCase().trim());
    if (exists) {
      return Promise.reject({
        response: { status: 400, data: { success: false, message: 'Email already registered.' } },
      });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      name,
      email: email.toLowerCase().trim(),
      password: password || 'password123',
      role: role || 'CUSTOMER',
      phone: phone || '',
      address: address || '',
      city: city || '',
      state: state || '',
      pincode: pincode || '',
      isActive: true,
    };
    users.push(newUser);
    setStore('users', users);

    const token = `demo_jwt_token_${newUser.id}_${Date.now()}`;
    const { password: _, ...userSafe } = newUser;
    return Promise.resolve({
      status: 200,
      data: { success: true, token, user: userSafe },
    });
  }

  // 3. AUTH: GET /auth/me
  if (path === '/auth/me' && method === 'get') {
    if (!currentUser) {
      return Promise.reject({ response: { status: 401, data: { success: false, message: 'Unauthenticated' } } });
    }
    return Promise.resolve({
      status: 200,
      data: { success: true, user: currentUser },
    });
  }

  // 4. AUTH: PUT /auth/profile
  if (path === '/auth/profile' && method === 'put') {
    const users = getStore('users', initialUsers);
    const idx = users.findIndex(u => u.id === currentUser?.id);
    if (idx !== -1) {
      users[idx] = { ...users[idx], ...body };
      setStore('users', users);
      const { password: _, ...userSafe } = users[idx];
      return Promise.resolve({
        status: 200,
        data: { success: true, user: userSafe },
      });
    }
    return Promise.resolve({ status: 200, data: { success: true, user: { ...currentUser, ...body } } });
  }

  // 5. PARCELS: GET /parcels/track/:trackingNumber
  if (path.startsWith('/parcels/track/') && method === 'get') {
    const trackingNo = decodeURIComponent(path.replace('/parcels/track/', '')).trim();
    const parcels = getStore('parcels', initialParcels);
    const found = parcels.find(p => p.trackingNumber.toUpperCase() === trackingNo.toUpperCase());

    if (!found) {
      return Promise.reject({
        response: { status: 404, data: { success: false, message: `No parcel found with ID ${trackingNo}` } },
      });
    }
    return Promise.resolve({
      status: 200,
      data: { success: true, parcel: found },
    });
  }

  // 6. PARCELS: GET /parcels
  if (path === '/parcels' && method === 'get') {
    let parcels = getStore('parcels', initialParcels);
    const statusFilter = params.get('status');
    const searchFilter = params.get('search');

    if (currentUser?.role === 'CUSTOMER') {
      parcels = parcels.filter(p => p.customerId === currentUser.id || p.sender?.email === currentUser.email);
    } else if (currentUser?.role === 'DELIVERY_AGENT') {
      parcels = parcels.filter(p => p.assignedAgentId === currentUser.id || p.assignedAgent?.email === currentUser.email);
    }

    if (statusFilter) {
      parcels = parcels.filter(p => p.status === statusFilter);
    }
    if (searchFilter) {
      const q = searchFilter.toLowerCase();
      parcels = parcels.filter(p =>
        p.trackingNumber.toLowerCase().includes(q) ||
        p.sender?.name?.toLowerCase().includes(q) ||
        p.receiver?.name?.toLowerCase().includes(q) ||
        p.currentLocation?.toLowerCase().includes(q)
      );
    }

    return Promise.resolve({
      status: 200,
      data: { success: true, count: parcels.length, parcels },
    });
  }

  // 7. PARCELS: POST /parcels
  if (path === '/parcels' && method === 'post') {
    const parcels = getStore('parcels', initialParcels);
    const newTracking = `SST-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(10000 + Math.random() * 90000)}`;

    const newParcel = {
      id: `parcel-${Date.now()}`,
      trackingNumber: newTracking,
      customerId: currentUser?.id || 'guest',
      assignedAgentId: null,
      packageDescription: body.packageDescription || 'General Goods',
      weight: parseFloat(body.weight) || 1.0,
      length: parseFloat(body.length) || 10,
      width: parseFloat(body.width) || 10,
      height: parseFloat(body.height) || 10,
      priority: body.priority || 'STANDARD',
      status: 'BOOKED',
      currentLocation: body.senderCity || 'Origin Sorting Hub',
      shippingCost: body.shippingCost || (body.priority === 'EXPRESS' ? 350 : 180),
      estimatedDeliveryDate: new Date(Date.now() + 3 * 24 * 3600 * 1000).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      sender: {
        name: body.senderName,
        phone: body.senderPhone,
        email: body.senderEmail,
        address: body.senderAddress,
        city: body.senderCity,
        state: body.senderState,
        pincode: body.senderPincode,
      },
      receiver: {
        name: body.receiverName,
        phone: body.receiverPhone,
        email: body.receiverEmail,
        address: body.receiverAddress,
        city: body.receiverCity,
        state: body.receiverState,
        pincode: body.receiverPincode,
      },
      assignedAgent: null,
      trackingEvents: [
        {
          id: `te-${Date.now()}`,
          status: 'BOOKED',
          location: body.senderCity || 'Origin Depot',
          message: 'Parcel booked online by sender.',
          timestamp: new Date().toISOString(),
        },
      ],
    };

    parcels.unshift(newParcel);
    setStore('parcels', parcels);

    return Promise.resolve({
      status: 201,
      data: { success: true, message: 'Parcel booked successfully.', parcel: newParcel },
    });
  }

  // 8. PARCELS: PUT /parcels/:id/status
  if (path.startsWith('/parcels/') && path.endsWith('/status') && method === 'put') {
    const id = path.split('/')[2];
    const parcels = getStore('parcels', initialParcels);
    const p = parcels.find(item => item.id === id || item.trackingNumber === id);
    if (!p) {
      return Promise.reject({ response: { status: 404, data: { success: false, message: 'Parcel not found.' } } });
    }

    p.status = body.status;
    if (body.location) p.currentLocation = body.location;
    p.updatedAt = new Date().toISOString();

    const newEvent = {
      id: `te-${Date.now()}`,
      status: body.status,
      location: body.location || p.currentLocation,
      message: body.message || `Status updated to ${body.status.replace(/_/g, ' ')}`,
      timestamp: new Date().toISOString(),
    };
    p.trackingEvents.unshift(newEvent);
    setStore('parcels', parcels);

    return Promise.resolve({
      status: 200,
      data: { success: true, parcel: p },
    });
  }

  // 9. PARCELS: PUT /parcels/:id/assign
  if (path.startsWith('/parcels/') && path.endsWith('/assign') && method === 'put') {
    const id = path.split('/')[2];
    const parcels = getStore('parcels', initialParcels);
    const users = getStore('users', initialUsers);
    const p = parcels.find(item => item.id === id || item.trackingNumber === id);
    const agent = users.find(u => u.id === body.agentId);

    if (p && agent) {
      p.assignedAgentId = agent.id;
      p.assignedAgent = { id: agent.id, name: agent.name, phone: agent.phone, email: agent.email };
      setStore('parcels', parcels);
    }

    return Promise.resolve({
      status: 200,
      data: { success: true, parcel: p },
    });
  }

  // 10. USERS: GET /users/agents
  if (path === '/users/agents' && method === 'get') {
    const users = getStore('users', initialUsers);
    const agents = users.filter(u => u.role === 'DELIVERY_AGENT');
    return Promise.resolve({
      status: 200,
      data: { success: true, agents },
    });
  }

  // 11. USERS: GET /users
  if (path === '/users' && method === 'get') {
    const users = getStore('users', initialUsers);
    const safe = users.map(({ password: _, ...rest }) => rest);
    return Promise.resolve({
      status: 200,
      data: { success: true, users: safe },
    });
  }

  // 12. USERS: POST /users
  if (path === '/users' && method === 'post') {
    const users = getStore('users', initialUsers);
    const newUser = {
      id: `user-${Date.now()}`,
      ...body,
      password: body.password || 'password123',
      isActive: true,
    };
    users.push(newUser);
    setStore('users', users);
    const { password: _, ...safe } = newUser;
    return Promise.resolve({
      status: 201,
      data: { success: true, user: safe },
    });
  }

  // 13. USERS: PUT /users/:id
  if (path.startsWith('/users/') && method === 'put') {
    const id = path.split('/')[2];
    const users = getStore('users', initialUsers);
    const user = users.find(u => u.id === id);
    if (user) {
      Object.assign(user, body);
      setStore('users', users);
    }
    return Promise.resolve({ status: 200, data: { success: true, user } });
  }

  // 14. NOTIFICATIONS: GET /notifications
  if (path === '/notifications' && method === 'get') {
    const notifications = getStore('notifications', initialNotifications);
    return Promise.resolve({
      status: 200,
      data: { success: true, notifications },
    });
  }

  // 15. NOTIFICATIONS: PUT /notifications/read-all
  if (path === '/notifications/read-all' && method === 'put') {
    const notifications = getStore('notifications', initialNotifications);
    notifications.forEach(n => n.isRead = true);
    setStore('notifications', notifications);
    return Promise.resolve({ status: 200, data: { success: true } });
  }

  // 16. SUPPORT: GET /support
  if (path === '/support' && method === 'get') {
    const tickets = getStore('tickets', initialTickets);
    const users = getStore('users', initialUsers);
    const parcels = getStore('parcels', initialParcels);

    const enriched = tickets.map((t) => {
      const u = t.user || users.find((usr) => usr.id === t.customerId) || {
        name: 'Arun Kumar',
        email: 'customer1@swiftship.demo',
        phone: '+91 94433 10001',
      };
      const p = t.parcel || parcels.find((prc) => prc.trackingNumber === t.trackingNumber) || null;
      return { ...t, user: u, parcel: p };
    });
    return Promise.resolve({ status: 200, data: { success: true, tickets: enriched } });
  }

  // 17. SUPPORT: POST /support
  if (path === '/support' && method === 'post') {
    const tickets = getStore('tickets', initialTickets);
    const users = getStore('users', initialUsers);
    const userSafe = currentUser ? { id: currentUser.id, name: currentUser.name, email: currentUser.email, phone: currentUser.phone } : { name: 'Customer', email: 'user@example.com' };
    const newTicket = {
      id: `ticket-${Date.now()}`,
      ...body,
      status: 'OPEN',
      customerId: currentUser?.id || 'demo-cust',
      createdAt: new Date().toISOString(),
      user: userSafe,
    };
    tickets.unshift(newTicket);
    setStore('tickets', tickets);
    return Promise.resolve({ status: 201, data: { success: true, ticket: newTicket } });
  }

  // 18. SUPPORT: PUT /support/:id
  if (path.startsWith('/support/') && method === 'put') {
    const id = path.split('/')[2];
    const tickets = getStore('tickets', initialTickets);
    const ticket = tickets.find(t => t.id === id);
    if (ticket) {
      Object.assign(ticket, body);
      setStore('tickets', tickets);
    }
    return Promise.resolve({ status: 200, data: { success: true, ticket } });
  }

  // 19. REPORTS: GET /reports/dashboard-stats
  if (path === '/reports/dashboard-stats' && method === 'get') {
    const parcels = getStore('parcels', initialParcels);
    const users = getStore('users', initialUsers);

    const totalParcels = parcels.length;
    const deliveredCount = parcels.filter(p => p.status === 'DELIVERED').length;
    const bookedCount = parcels.filter(p => p.status === 'BOOKED').length;
    const pickedUpCount = parcels.filter(p => p.status === 'PICKED_UP').length;
    const inTransitCount = parcels.filter(p => p.status === 'IN_TRANSIT').length;
    const outForDeliveryCount = parcels.filter(p => p.status === 'OUT_FOR_DELIVERY').length;
    const failedCount = parcels.filter(p => p.status === 'DELIVERY_FAILED').length;
    const returnedCount = parcels.filter(p => p.status === 'RETURNED').length;

    const activeParcels = bookedCount + pickedUpCount + inTransitCount + outForDeliveryCount;
    const successRate = totalParcels > 0 ? ((deliveredCount / totalParcels) * 100).toFixed(1) : '100';
    const activeAgents = users.filter(u => u.role === 'DELIVERY_AGENT').length;
    const totalCustomers = users.filter(u => u.role === 'CUSTOMER').length;

    const statusDistribution = [
      { name: 'Booked', value: bookedCount },
      { name: 'Picked Up', value: pickedUpCount },
      { name: 'In Transit', value: inTransitCount },
      { name: 'Out for Delivery', value: outForDeliveryCount },
      { name: 'Delivered', value: deliveredCount },
      { name: 'Failed', value: failedCount },
      { name: 'Returned', value: returnedCount },
    ];

    const cityStats = [
      { city: 'Chennai', count: 8 },
      { city: 'Coimbatore', count: 5 },
      { city: 'Madurai', count: 4 },
      { city: 'Tirunelveli', count: 3 },
      { city: 'Bengaluru', count: 2 },
    ];

    const agents = users.filter(u => u.role === 'DELIVERY_AGENT');
    const agentPerformance = agents.map(agent => {
      const assigned = parcels.filter(p => p.assignedAgentId === agent.id);
      const del = assigned.filter(p => p.status === 'DELIVERED').length;
      const inProg = assigned.filter(p => ['IN_TRANSIT', 'OUT_FOR_DELIVERY', 'PICKED_UP'].includes(p.status)).length;
      return {
        id: agent.id,
        name: agent.name,
        city: agent.city || 'Hub Depot',
        totalAssigned: assigned.length || 2,
        delivered: del || 1,
        inProgress: inProg || 1,
        completionRate: `${assigned.length > 0 ? Math.round((del / assigned.length) * 100) : 85}%`,
      };
    });

    return Promise.resolve({
      status: 200,
      data: {
        success: true,
        stats: {
          totalParcels,
          activeParcels,
          deliveredParcels: deliveredCount,
          failedDeliveries: failedCount,
          totalUsers: users.length,
          activeAgents,
          totalCustomers,
          successRate: `${successRate}%`,
        },
        statusDistribution,
        cityStats,
        agentPerformance,
        recentParcels: parcels.slice(0, 6),
      },
    });
  }

  // 20. AI CHAT: POST /ai/chat
  if (path === '/ai/chat' && method === 'post') {
    const query = (body.message || '').trim();
    const queryUpper = query.toUpperCase();
    const trackingRegex = /SST-?\d{8}-?\d{5}|SST-[A-Z0-9-]+/i;
    const matched = query.match(trackingRegex);
    const targetTracking = body.trackingNumber || (matched ? matched[0].toUpperCase() : null);

    const parcels = getStore('parcels', initialParcels);
    const parcel = targetTracking
      ? parcels.find(p => p.trackingNumber.toUpperCase().includes(targetTracking.replace(/-/g, '')) || p.trackingNumber.toUpperCase() === targetTracking)
      : null;

    let aiResponse = '';
    if (parcel) {
      const statusFormatted = parcel.status.replace(/_/g, ' ');
      const eta = new Date(parcel.estimatedDeliveryDate).toLocaleDateString('en-US', {
        weekday: 'short', month: 'short', day: 'numeric',
      });
      const agentInfo = parcel.assignedAgent
        ? `${parcel.assignedAgent.name} (Contact: ${parcel.assignedAgent.phone || 'N/A'})`
        : 'Agent pending assignment';

      if (queryUpper.includes('WHERE') || queryUpper.includes('LOCATION') || queryUpper.includes('STATUS')) {
        aiResponse = `📦 **Shipment Status for ${parcel.trackingNumber}**:\n` +
          `• **Current Status**: ${statusFormatted}\n` +
          `• **Current Location**: ${parcel.currentLocation}\n` +
          `• **Route**: ${parcel.sender.city} → ${parcel.receiver.city}\n` +
          `• **Estimated Delivery**: ${eta}\n` +
          `• **Assigned Agent**: ${agentInfo}`;
      } else if (queryUpper.includes('WHEN') || queryUpper.includes('ETA') || queryUpper.includes('ARRIVE')) {
        aiResponse = `⏰ **Estimated Delivery for ${parcel.trackingNumber}**:\n` +
          `• **Expected Arrival**: ${eta}\n` +
          `• **Current Status**: ${statusFormatted}\n` +
          `• **Current Hub**: ${parcel.currentLocation}`;
      } else {
        aiResponse = `Here is the verified status for **${parcel.trackingNumber}**:\n\n` +
          `• **Status**: ${statusFormatted}\n` +
          `• **Current Location**: ${parcel.currentLocation}\n` +
          `• **Weight**: ${parcel.weight} kg (${parcel.priority} Shipping)\n` +
          `• **Estimated Delivery**: ${eta}\n` +
          `• **Agent**: ${agentInfo}`;
      }
    } else if (targetTracking) {
      aiResponse = `❌ I could not find an active parcel for tracking number **${targetTracking}**. Please verify the tracking number (e.g. \`SST-20261002-10001\`).`;
    } else {
      aiResponse = `👋 Hello! I am the **SwiftShip AI Parcel Assistant**.\n\n` +
        `Mention your tracking number (e.g. \`SST-20261002-10001\`) to check status, ETA, delivery agent details, or parcel weight!`;
    }

    return Promise.resolve({
      status: 200,
      data: { success: true, message: aiResponse, parcel },
    });
  }

  // Health check
  if (path === '/health') {
    return Promise.resolve({
      status: 200,
      data: { status: 'ONLINE', mode: 'STANDALONE_DEMO' },
    });
  }

  return Promise.reject({
    response: { status: 404, data: { success: false, message: `Endpoint ${method.toUpperCase()} ${path} not found` } },
  });
}
