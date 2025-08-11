import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("Creating sample data...");

  // Create owner users
  const owner1 = await prisma.user.upsert({
    where: { email: "rajesh@sbrbadminton.com" },
    update: {},
    create: {
      name: "Rajesh Patel",
      email: "rajesh@sbrbadminton.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const owner2 = await prisma.user.upsert({
    where: { email: "priya@elitesports.com" },
    update: {},
    create: {
      name: "Priya Shah",
      email: "priya@elitesports.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create player profiles for owners
  const ownerProfile1 = await prisma.playerProfile.upsert({
    where: { userId: owner1.id },
    update: {},
    create: {
      userId: owner1.id,
      role: "FACILITY_OWNER",
      phoneNumber: "+919876543210",
      isActive: true,
    },
  });

  const ownerProfile2 = await prisma.playerProfile.upsert({
    where: { userId: owner2.id },
    update: {},
    create: {
      userId: owner2.id,
      role: "FACILITY_OWNER",
      phoneNumber: "+919876543211",
      isActive: true,
    },
  });

  // Create facilities
  await prisma.facility.createMany({
    data: [
      {
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
      {
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
      {
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
    ],
    skipDuplicates: true,
  });

  // Get the created facilities to use their IDs for courts
  const facilities = await prisma.facility.findMany({
    where: {
      name: {
        in: ["SBR Badminton", "Elite Sports Arena", "Champions Ground"],
      },
    },
  });

  const sbrBadminton = facilities.find((f) => f.name === "SBR Badminton");
  const eliteSports = facilities.find((f) => f.name === "Elite Sports Arena");
  const championsGround = facilities.find((f) => f.name === "Champions Ground");

  // Create courts
  await prisma.court.createMany({
    data: [
      {
        name: "Court A",
        facilityId: sbrBadminton!.id,
        sportType: "BADMINTON",
        pricePerHour: 450,
        operatingStartHour: 6,
        operatingEndHour: 23,
        isActive: true,
      },
      {
        name: "Court B",
        facilityId: sbrBadminton!.id,
        sportType: "BADMINTON",
        pricePerHour: 450,
        operatingStartHour: 6,
        operatingEndHour: 23,
        isActive: true,
      },
      {
        name: "Tennis Court 1",
        facilityId: eliteSports!.id,
        sportType: "TENNIS",
        pricePerHour: 600,
        operatingStartHour: 6,
        operatingEndHour: 22,
        isActive: true,
      },
      {
        name: "Badminton Court 1",
        facilityId: eliteSports!.id,
        sportType: "BADMINTON",
        pricePerHour: 500,
        operatingStartHour: 6,
        operatingEndHour: 22,
        isActive: true,
      },
      {
        name: "Football Field",
        facilityId: championsGround!.id,
        sportType: "FOOTBALL",
        pricePerHour: 800,
        operatingStartHour: 6,
        operatingEndHour: 21,
        isActive: true,
      },
    ],
    skipDuplicates: true,
  });

  // Create sample regular users
  const user1 = await prisma.user.upsert({
    where: { email: "john@example.com" },
    update: {},
    create: {
      name: "John Doe",
      email: "john@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: "jane@example.com" },
    update: {},
    create: {
      name: "Jane Smith",
      email: "jane@example.com",
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  // Create player profiles for regular users
  await prisma.playerProfile.upsert({
    where: { userId: user1.id },
    update: {},
    create: {
      userId: user1.id,
      role: "USER",
      phoneNumber: "+919876543213",
      isActive: true,
    },
  });

  await prisma.playerProfile.upsert({
    where: { userId: user2.id },
    update: {},
    create: {
      userId: user2.id,
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
