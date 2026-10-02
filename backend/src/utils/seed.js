const bcrypt = require('bcryptjs');
const prisma = require('../config/db');

async function seedDatabase() {
  console.log('🌱 Starting SwiftShip Tracker database seeding...');

  try {
    // Clear existing tables in reverse dependency order
    await prisma.notification.deleteMany();
    await prisma.supportTicket.deleteMany();
    await prisma.trackingEvent.deleteMany();
    await prisma.parcel.deleteMany();
    await prisma.sender.deleteMany();
    await prisma.receiver.deleteMany();
    await prisma.user.deleteMany();

    console.log('🧹 Cleaned existing database records.');

    // Password hash for all demo accounts
    const defaultPassword = await bcrypt.hash('password123', 10);

    // 1. Create Admin
    const admin = await prisma.user.create({
      data: {
        name: 'SwiftShip Systems Admin',
        email: 'admin@swiftship.demo',
        password: defaultPassword,
        role: 'ADMIN',
        phone: '+91 98765 00001',
        city: 'Chennai',
        state: 'Tamil Nadu',
        address: 'SwiftShip HQ, OMR Tech Corridor',
        pincode: '600096',
      },
    });

    // 2. Create Support Staff
    const support = await prisma.user.create({
      data: {
        name: 'Anitha Support Specialist',
        email: 'support@swiftship.demo',
        password: defaultPassword,
        role: 'SUPPORT',
        phone: '+91 98765 00002',
        city: 'Chennai',
        state: 'Tamil Nadu',
        address: 'SwiftShip Support Hub, Mount Road',
        pincode: '600002',
      },
    });

    // 3. Create Delivery Agents
    const agent1 = await prisma.user.create({
      data: {
        name: 'Karthik Raja',
        email: 'agent1@swiftship.demo',
        password: defaultPassword,
        role: 'DELIVERY_AGENT',
        phone: '+91 98765 11111',
        city: 'Chennai',
        state: 'Tamil Nadu',
        address: 'Velachery Logistics Hub',
        pincode: '600042',
      },
    });

    const agent2 = await prisma.user.create({
      data: {
        name: 'Murugan S',
        email: 'agent2@swiftship.demo',
        password: defaultPassword,
        role: 'DELIVERY_AGENT',
        phone: '+91 98765 22222',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        address: 'RS Puram Logistics Yard',
        pincode: '641002',
      },
    });

    const agent3 = await prisma.user.create({
      data: {
        name: 'Priya V',
        email: 'agent3@swiftship.demo',
        password: defaultPassword,
        role: 'DELIVERY_AGENT',
        phone: '+91 98765 33333',
        city: 'Tirunelveli',
        state: 'Tamil Nadu',
        address: 'Palayamkottai Hub',
        pincode: '627002',
      },
    });

    // 4. Create Customers
    const customer1 = await prisma.user.create({
      data: {
        name: 'Arun Kumar',
        email: 'customer1@swiftship.demo',
        password: defaultPassword,
        role: 'CUSTOMER',
        phone: '+91 94433 10001',
        city: 'Tirunelveli',
        state: 'Tamil Nadu',
        address: '42 High Road, Palayamkottai',
        pincode: '627002',
      },
    });

    const customer2 = await prisma.user.create({
      data: {
        name: 'Deepa Ramesh',
        email: 'customer2@swiftship.demo',
        password: defaultPassword,
        role: 'CUSTOMER',
        phone: '+91 94433 20002',
        city: 'Coimbatore',
        state: 'Tamil Nadu',
        address: '15 Avinashi Road, Peelamedu',
        pincode: '641004',
      },
    });

    const customer3 = await prisma.user.create({
      data: {
        name: 'Suresh Chandran',
        email: 'customer3@swiftship.demo',
        password: defaultPassword,
        role: 'CUSTOMER',
        phone: '+91 94433 30003',
        city: 'Madurai',
        state: 'Tamil Nadu',
        address: '88 KK Nagar, Lake View',
        pincode: '625020',
      },
    });

    const customer4 = await prisma.user.create({
      data: {
        name: 'Meena Sundaram',
        email: 'customer4@swiftship.demo',
        password: defaultPassword,
        role: 'CUSTOMER',
        phone: '+91 94433 40004',
        city: 'Bengaluru',
        state: 'Karnataka',
        address: '102 Indiranagar 100ft Road',
        pincode: '560038',
      },
    });

    const customer5 = await prisma.user.create({
      data: {
        name: 'Venkatesh K',
        email: 'customer5@swiftship.demo',
        password: defaultPassword,
        role: 'CUSTOMER',
        phone: '+91 94433 50005',
        city: 'Hyderabad',
        state: 'Telangana',
        address: '77 HITECH City, Madhapur',
        pincode: '500081',
      },
    });

    console.log('👤 Created Demo Users: Admin, Support, 3 Agents, 5 Customers.');

    // 5. Seed Parcels & Tracking Histories
    const parcelDataList = [
      {
        trackingNumber: 'SST-20261002-10001',
        customer: customer1,
        agent: agent1,
        sender: { name: 'Arun Kumar', phone: '+91 94433 10001', email: 'customer1@swiftship.demo', address: '42 High Road', city: 'Tirunelveli', state: 'Tamil Nadu', pincode: '627002' },
        receiver: { name: 'Lakshmi Narayanan', phone: '+91 98940 99881', email: 'lakshmi@example.com', address: '12 T Nagar Main Road', city: 'Chennai', state: 'Tamil Nadu', pincode: '600017' },
        packageDescription: 'Dell XPS 15 Laptop & Accessories',
        weight: 3.5,
        length: 38,
        width: 26,
        height: 10,
        priority: 'EXPRESS',
        status: 'OUT_FOR_DELIVERY',
        currentLocation: 'Chennai Central Hub',
        shippingCost: 380,
        timeline: [
          { status: 'BOOKED', location: 'Tirunelveli', message: 'Parcel successfully booked by customer.', offsetMinutes: 48 * 60 },
          { status: 'PICKED_UP', location: 'Tirunelveli Hub', message: 'Picked up from sender location in Palayamkottai.', offsetMinutes: 42 * 60 },
          { status: 'IN_TRANSIT', location: 'Coimbatore Sorting Facility', message: 'Parcel scanned at regional sorting center.', offsetMinutes: 24 * 60 },
          { status: 'IN_TRANSIT', location: 'Chennai Central Hub', message: 'Arrived at destination hub for final delivery dispatch.', offsetMinutes: 6 * 60 },
          { status: 'OUT_FOR_DELIVERY', location: 'Chennai Central Hub', message: 'Parcel loaded into delivery vehicle with agent Karthik Raja.', offsetMinutes: 1 * 60 },
        ],
      },
      {
        trackingNumber: 'SST-20261002-10002',
        customer: customer2,
        agent: agent2,
        sender: { name: 'Deepa Ramesh', phone: '+91 94433 20002', email: 'customer2@swiftship.demo', address: '15 Avinashi Road', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641004' },
        receiver: { name: 'Kavitha S', phone: '+91 98421 77662', email: 'kavitha@example.com', address: '55 DB Road, RS Puram', city: 'Coimbatore', state: 'Tamil Nadu', pincode: '641002' },
        packageDescription: 'Organic Cotton Garments Sample Set',
        weight: 1.8,
        length: 25,
        width: 20,
        height: 8,
        priority: 'STANDARD',
        status: 'DELIVERED',
        currentLocation: 'Coimbatore RS Puram',
        shippingCost: 200,
        deliveredDaysAgo: 1,
        timeline: [
          { status: 'BOOKED', location: 'Coimbatore', message: 'Shipment registered online.', offsetMinutes: 72 * 60 },
          { status: 'PICKED_UP', location: 'Coimbatore Peelamedu', message: 'Picked up from sender.', offsetMinutes: 68 * 60 },
          { status: 'IN_TRANSIT', location: 'Coimbatore Main Yard', message: 'Sorting completed.', offsetMinutes: 48 * 60 },
          { status: 'OUT_FOR_DELIVERY', location: 'Coimbatore RS Puram', message: 'Dispatched for delivery with Agent Murugan S.', offsetMinutes: 28 * 60 },
          { status: 'DELIVERED', location: 'Coimbatore RS Puram', message: 'Delivered successfully to receiver Kavitha S.', offsetMinutes: 24 * 60 },
        ],
      },
      {
        trackingNumber: 'SST-20261002-10003',
        customer: customer3,
        agent: agent3,
        sender: { name: 'Suresh Chandran', phone: '+91 94433 30003', email: 'customer3@swiftship.demo', address: '88 KK Nagar', city: 'Madurai', state: 'Tamil Nadu', pincode: '625020' },
        receiver: { name: 'Ganesh Ram', phone: '+91 97890 55443', email: 'ganesh@example.com', address: '22 South Bypass', city: 'Tirunelveli', state: 'Tamil Nadu', pincode: '627005' },
        packageDescription: 'Handicraft Brass Temple Idol',
        weight: 4.2,
        length: 30,
        width: 30,
        height: 40,
        priority: 'PRIORITY',
        status: 'IN_TRANSIT',
        currentLocation: 'Madurai Express Hub',
        shippingCost: 450,
        timeline: [
          { status: 'BOOKED', location: 'Madurai', message: 'Shipment created and paid.', offsetMinutes: 12 * 60 },
          { status: 'PICKED_UP', location: 'Madurai KK Nagar', message: 'Agent picked up parcel from customer home.', offsetMinutes: 8 * 60 },
          { status: 'IN_TRANSIT', location: 'Madurai Express Hub', message: 'Loaded onto interstate transit transport to Tirunelveli.', offsetMinutes: 2 * 60 },
        ],
      },
      {
        trackingNumber: 'SST-20261002-10004',
        customer: customer4,
        agent: agent1,
        sender: { name: 'Meena Sundaram', phone: '+91 94433 40004', email: 'customer4@swiftship.demo', address: '102 Indiranagar', city: 'Bengaluru', state: 'Karnataka', pincode: '560038' },
        receiver: { name: 'Rajesh Sharma', phone: '+91 99000 11223', email: 'rajesh@example.com', address: '99 Anna Salai', city: 'Chennai', state: 'Tamil Nadu', pincode: '600002' },
        packageDescription: 'Engineering Architectural Blueprints',
        weight: 0.9,
        length: 45,
        width: 10,
        height: 10,
        priority: 'EXPRESS',
        status: 'PICKED_UP',
        currentLocation: 'Bengaluru Indiranagar Center',
        shippingCost: 240,
        timeline: [
          { status: 'BOOKED', location: 'Bengaluru', message: 'Order booked.', offsetMinutes: 5 * 60 },
          { status: 'PICKED_UP', location: 'Bengaluru Indiranagar Center', message: 'Courier pickup verified.', offsetMinutes: 1 * 60 },
        ],
      },
      {
        trackingNumber: 'SST-20261002-10005',
        customer: customer5,
        agent: null,
        sender: { name: 'Venkatesh K', phone: '+91 94433 50005', email: 'customer5@swiftship.demo', address: '77 HITECH City', city: 'Hyderabad', state: 'Telangana', pincode: '500081' },
        receiver: { name: 'Pooja Reddy', phone: '+91 98490 33445', email: 'pooja@example.com', address: '14 Jubilee Hills Road 36', city: 'Hyderabad', state: 'Telangana', pincode: '500033' },
        packageDescription: 'High Precision Medical Monitor',
        weight: 6.5,
        length: 50,
        width: 40,
        height: 30,
        priority: 'PRIORITY',
        status: 'BOOKED',
        currentLocation: 'Hyderabad HITECH City',
        shippingCost: 620,
        timeline: [
          { status: 'BOOKED', location: 'Hyderabad HITECH City', message: 'Parcel successfully booked. Awaiting pickup assignment.', offsetMinutes: 30 },
        ],
      },
      {
        trackingNumber: 'SST-20261002-10006',
        customer: customer1,
        agent: agent2,
        sender: { name: 'Arun Kumar', phone: '+91 94433 10001', email: 'customer1@swiftship.demo', address: '42 High Road', city: 'Tirunelveli', state: 'Tamil Nadu', pincode: '627002' },
        receiver: { name: 'Srinivasan K', phone: '+91 94422 88776', email: 'srini@example.com', address: '30 Gandhi Road', city: 'Salem', state: 'Tamil Nadu', pincode: '636007' },
        packageDescription: 'Traditional Silk Sarees Box',
        weight: 2.2,
        length: 30,
        width: 25,
        height: 12,
        priority: 'STANDARD',
        status: 'DELIVERY_FAILED',
        currentLocation: 'Salem Main Exchange',
        shippingCost: 220,
        timeline: [
          { status: 'BOOKED', location: 'Tirunelveli', message: 'Booked by sender.', offsetMinutes: 40 * 60 },
          { status: 'PICKED_UP', location: 'Tirunelveli Hub', message: 'Picked up.', offsetMinutes: 36 * 60 },
          { status: 'IN_TRANSIT', location: 'Salem Main Exchange', message: 'Arrived at Salem hub.', offsetMinutes: 18 * 60 },
          { status: 'OUT_FOR_DELIVERY', location: 'Salem Main Exchange', message: 'Out for delivery.', offsetMinutes: 6 * 60 },
          { status: 'DELIVERY_FAILED', location: 'Salem Main Exchange', message: 'Delivery attempted. Receiver address locked / customer unavailable.', offsetMinutes: 2 * 60 },
        ],
      },
    ];

    for (const item of parcelDataList) {
      const createdSender = await prisma.sender.create({ data: item.sender });
      const createdReceiver = await prisma.receiver.create({ data: item.receiver });

      const now = new Date();
      const estDays = item.priority === 'EXPRESS' ? 1 : 3;
      const estimatedDeliveryDate = new Date(now.getTime() + estDays * 24 * 60 * 60 * 1000);

      const parcel = await prisma.parcel.create({
        data: {
          trackingNumber: item.trackingNumber,
          senderId: createdSender.id,
          receiverId: createdReceiver.id,
          createdById: item.customer.id,
          assignedAgentId: item.agent ? item.agent.id : null,
          packageDescription: item.packageDescription,
          weight: item.weight,
          length: item.length,
          width: item.width,
          height: item.height,
          priority: item.priority,
          status: item.status,
          currentLocation: item.currentLocation,
          estimatedDeliveryDate,
          shippingCost: item.shippingCost,
          paymentStatus: 'PAID',
          pickedUpAt: item.status !== 'BOOKED' ? new Date(now.getTime() - 24 * 60 * 60 * 1000) : null,
          deliveredAt: item.status === 'DELIVERED' ? new Date(now.getTime() - 12 * 60 * 60 * 1000) : null,
        },
      });

      // Insert Timeline Events
      for (const evt of item.timeline) {
        const evtTime = new Date(now.getTime() - evt.offsetMinutes * 60 * 1000);
        await prisma.trackingEvent.create({
          data: {
            parcelId: parcel.id,
            status: evt.status,
            location: evt.location,
            message: evt.message,
            timestamp: evtTime,
          },
        });
      }

      // Insert Notifications for customer
      await prisma.notification.create({
        data: {
          userId: item.customer.id,
          parcelId: parcel.id,
          title: `Shipment Update: ${item.trackingNumber}`,
          message: `Your shipment is currently ${item.status.replace(/_/g, ' ')} at ${item.currentLocation}.`,
          type: 'STATUS_UPDATE',
          isRead: item.status === 'DELIVERED',
        },
      });
    }

    console.log(`📦 Seeded ${parcelDataList.length} Parcels with complete tracking timelines.`);

    // 6. Create Support Tickets
    const parcel1 = await prisma.parcel.findUnique({ where: { trackingNumber: 'SST-20261002-10006' } });
    const parcel2 = await prisma.parcel.findUnique({ where: { trackingNumber: 'SST-20261002-10001' } });

    await prisma.supportTicket.create({
      data: {
        userId: customer1.id,
        parcelId: parcel1 ? parcel1.id : null,
        subject: 'Delivery Re-attempt Request for SST-20261002-10006',
        description: 'First delivery attempt failed because receiver was out of town. Please reschedule delivery for tomorrow morning.',
        priority: 'HIGH',
        status: 'IN_PROGRESS',
        assignedToId: support.id,
        resolution: 'Agent notified to re-attempt delivery on next business morning slot.',
      },
    });

    await prisma.supportTicket.create({
      data: {
        userId: customer1.id,
        parcelId: parcel2 ? parcel2.id : null,
        subject: 'Address Change Confirmation for SST-20261002-10001',
        description: 'Confirmed recipient phone number update for live tracking SMS alerts.',
        priority: 'MEDIUM',
        status: 'OPEN',
      },
    });

    console.log('🎫 Seeded Support Tickets.');

    console.log('============================================================');
    console.log('🎉 SEEDING COMPLETED SUCCESSFULLY!');
    console.log('============================================================');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

seedDatabase();
