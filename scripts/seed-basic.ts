import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Creating sample data...");

  // Create owner users
  await prisma.user.upsert({
    where: { email: "rajesh@sbrbadminton.com" },
    update: {},
    create: {
      id: "owner1",
      name: "Rajesh Patel",
      email: "rajesh@sbrbadminton.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: "priya@elitesports.com" },
    update: {},
    create: {
      id: "owner2",
      name: "Priya Shah",
      email: "priya@elitesports.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create player profiles for owners
  const ownerProfile1 = await prisma.playerProfile.upsert({
    where: { userId: "owner1" },
    update: {},
    create: {
      userId: "owner1",
      role: "FACILITY_OWNER",
      phoneNumber: "+919876543210",
      isActive: true,
    },
  });

  const ownerProfile2 = await prisma.playerProfile.upsert({
    where: { userId: "owner2" },
    update: {},
    create: {
      userId: "owner2",
      role: "FACILITY_OWNER",
      phoneNumber: "+919876543211",
      isActive: true,
    },
  });

  // Create facilities
  await prisma.facility.upsert({
    where: { id: "facility1" },
    update: {},
    create: {
      id: "facility1",
      name: "SBR Badminton",
      description: "Premium badminton facility with state-of-the-art courts",
      address: "Vastrapur, Ahmedabad, Gujarat 380015",
      latitude: 23.0395677,
      longitude: 72.5297227,
      amenities: ["AC", "Parking", "Changing Room"],
      photos: ["/assets/modern-badminton-court.png"],
      phone: "+917265432101",
      email: "info@sbrbadminton.com",
      policies: ["No smoking", "Sports shoes mandatory"],
      venueType: "INDOOR",
      rating: 4.5,
      reviewCount: 124,
      ownerId: ownerProfile1.id,
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  await prisma.facility.upsert({
    where: { id: "facility2" },
    update: {},
    create: {
      id: "facility2",
      name: "Elite Sports Arena",
      description: "Multi-sport facility with tennis and badminton courts",
      address: "Satellite, Ahmedabad, Gujarat 380015",
      latitude: 23.0225,
      longitude: 72.5714,
      amenities: ["AC", "Parking", "Pro Shop"],
      photos: ["/assets/professional-badminton-court.png"],
      phone: "+917265432102",
      email: "info@elitesports.com",
      policies: ["Professional coaching available"],
      venueType: "INDOOR",
      rating: 4.8,
      reviewCount: 89,
      ownerId: ownerProfile2.id,
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  await prisma.facility.upsert({
    where: { id: "facility3" },
    update: {},
    create: {
      id: "facility3",
      name: "Champions Ground",
      description: "Outdoor sports complex for football and cricket",
      address: "Bodakdev, Ahmedabad, Gujarat 380054",
      latitude: 23.0593,
      longitude: 72.5194,
      amenities: ["Floodlights", "Parking", "Cafeteria"],
      photos: ["/assets/football-turf-ground.png"],
      phone: "+917265432103",
      email: "info@champions.com",
      policies: ["Team bookings available"],
      venueType: "OUTDOOR",
      rating: 4.6,
      reviewCount: 156,
      ownerId: ownerProfile1.id,
      status: "APPROVED",
      approvedAt: new Date(),
    },
  });

  // Create courts
  await prisma.court.upsert({
    where: { id: "court1" },
    update: {},
    create: {
      id: "court1",
      name: "Court A",
      facilityId: "facility1",
      sportType: "BADMINTON",
      pricePerHour: 450,
      operatingStartHour: 6,
      operatingEndHour: 23,
      isActive: true,
    },
  });

  await prisma.court.upsert({
    where: { id: "court2" },
    update: {},
    create: {
      id: "court2",
      name: "Court B",
      facilityId: "facility1",
      sportType: "BADMINTON",
      pricePerHour: 450,
      operatingStartHour: 6,
      operatingEndHour: 23,
      isActive: true,
    },
  });

  await prisma.court.upsert({
    where: { id: "court3" },
    update: {},
    create: {
      id: "court3",
      name: "Tennis Court 1",
      facilityId: "facility2",
      sportType: "TENNIS",
      pricePerHour: 600,
      operatingStartHour: 6,
      operatingEndHour: 22,
      isActive: true,
    },
  });

  await prisma.court.upsert({
    where: { id: "court4" },
    update: {},
    create: {
      id: "court4",
      name: "Badminton Court 1",
      facilityId: "facility2",
      sportType: "BADMINTON",
      pricePerHour: 500,
      operatingStartHour: 6,
      operatingEndHour: 22,
      isActive: true,
    },
  });

  await prisma.court.upsert({
    where: { id: "court5" },
    update: {},
    create: {
      id: "court5",
      name: "Football Field",
      facilityId: "facility3",
      sportType: "FOOTBALL",
      pricePerHour: 800,
      operatingStartHour: 6,
      operatingEndHour: 21,
      isActive: true,
    },
  });

  // Create sample regular users
  await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      id: "user1",
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      id: "user2",
      name: "Jane Smith",
      email: "jane@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create player profiles for regular users
  await prisma.playerProfile.upsert({
    where: { userId: "user1" },
    update: {},
    create: {
      id: "player1",
      userId: "user1",
      role: "USER",
      phoneNumber: "+919876543213",
      isActive: true,
    },
  });

  await prisma.playerProfile.upsert({
    where: { userId: "user2" },
    update: {},
    create: {
      id: "player2",
      userId: "user2",
      role: "USER",
      phoneNumber: "+919876543214",
      isActive: true,
    },
  });

  console.log("Sample data created successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
