import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import config from "../config";

const password = "Password@123";

const hashPassword = async () => bcrypt.hash(password, Number(config.bcrypt_salt_rounds || 12));

const slugify = (value: string) => value.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const categories = [
    ["Apartment", "Modern apartments for families and professionals"],
    ["House", "Independent houses with private facilities"],
    ["Studio", "Compact studios for singles and students"],
    ["Sublet", "Short-term and shared rental options"],
    ["Duplex", "Spacious duplex homes for larger families"],
] as const;

const landlords = [
    ["Ayesha Rahman", "landlord.ayesha@rentnest.com", "+8801711000001"],
    ["Tanvir Hasan", "landlord.tanvir@rentnest.com", "+8801711000002"],
    ["Nusrat Karim", "landlord.nusrat@rentnest.com", "+8801711000003"],
] as const;

const tenants = [
    ["Fahim Ahmed", "tenant.fahim@rentnest.com", "+8801722000001"],
    ["Maliha Islam", "tenant.maliha@rentnest.com", "+8801722000002"],
    ["Rafi Chowdhury", "tenant.rafi@rentnest.com", "+8801722000003"],
    ["Sadia Noor", "tenant.sadia@rentnest.com", "+8801722000004"],
] as const;

const propertySeeds = [
    {
        title: "Sunny Banani Apartment",
        description: "Three-bedroom apartment near Banani 11 with lift, parking, and bright balconies.",
        address: "House 22, Road 11, Banani",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        postalCode: "1213",
        price: 42000,
        amenities: "wifi, parking, lift, generator, security",
        images: [
            "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2",
            "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267",
        ],
        latitude: 23.793700,
        longitude: 90.404300,
        category: "Apartment",
        landlordEmail: "landlord.ayesha@rentnest.com",
    },
    {
        title: "Gulshan Lake View Flat",
        description: "Premium flat with lake view, large living area, and easy access to Gulshan Avenue.",
        address: "Road 45, Gulshan 2",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        postalCode: "1212",
        price: 75000,
        amenities: "wifi, parking, lake view, gym, security",
        images: [
            "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688",
            "https://images.unsplash.com/photo-1493809842364-78817add7ffb",
        ],
        latitude: 23.792500,
        longitude: 90.407800,
        category: "Apartment",
        landlordEmail: "landlord.ayesha@rentnest.com",
    },
    {
        title: "Uttara Family House",
        description: "Independent family house in a quiet residential area with rooftop access.",
        address: "Sector 7, Uttara",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        postalCode: "1230",
        price: 55000,
        amenities: "parking, rooftop, security, garden",
        images: [
            "https://images.unsplash.com/photo-1568605114967-8130f3a36994",
        ],
        latitude: 23.875900,
        longitude: 90.379500,
        category: "House",
        landlordEmail: "landlord.tanvir@rentnest.com",
    },
    {
        title: "Dhanmondi Student Studio",
        description: "Affordable studio apartment close to universities, cafes, and public transport.",
        address: "Road 8/A, Dhanmondi",
        city: "Dhaka",
        state: "Dhaka",
        country: "Bangladesh",
        postalCode: "1209",
        price: 18000,
        amenities: "wifi, furnished, security",
        images: [
            "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85",
        ],
        latitude: 23.746100,
        longitude: 90.374200,
        category: "Studio",
        landlordEmail: "landlord.tanvir@rentnest.com",
    },
    {
        title: "Chattogram Hill Duplex",
        description: "Spacious duplex with scenic hill views and modern fittings.",
        address: "Nasirabad Housing Society",
        city: "Chattogram",
        state: "Chattogram",
        country: "Bangladesh",
        postalCode: "4000",
        price: 68000,
        amenities: "parking, balcony, hill view, security",
        images: [
            "https://images.unsplash.com/photo-1570129477492-45c003edd2be",
        ],
        latitude: 22.366700,
        longitude: 91.821400,
        category: "Duplex",
        landlordEmail: "landlord.nusrat@rentnest.com",
    },
    {
        title: "Sylhet Short-Term Sublet",
        description: "Furnished sublet for short stays near Zindabazar.",
        address: "Zindabazar Main Road",
        city: "Sylhet",
        state: "Sylhet",
        country: "Bangladesh",
        postalCode: "3100",
        price: 22000,
        amenities: "furnished, wifi, generator",
        images: [
            "https://images.unsplash.com/photo-1484154218962-a197022b5858",
        ],
        latitude: 24.894900,
        longitude: 91.868700,
        category: "Sublet",
        landlordEmail: "landlord.nusrat@rentnest.com",
    },
] as const;

const main = async () => {
    const hashedPassword = await hashPassword();

    const admin = await prisma.user.upsert({
        where: { email: process.env.ADMIN_EMAIL || "admin@rentnest.com" },
        update: {
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
        create: {
            name: "RentNest Admin",
            email: process.env.ADMIN_EMAIL || "admin@rentnest.com",
            password: hashedPassword,
            phone: "+8801700000000",
            role: "ADMIN",
            status: "ACTIVE",
        },
    });

    const landlordRecords = await Promise.all(
        landlords.map(([name, email, phone]) =>
            prisma.user.upsert({
                where: { email },
                update: { name, phone, role: "LANDLORD", status: "ACTIVE" },
                create: { name, email, phone, password: hashedPassword, role: "LANDLORD", status: "ACTIVE" },
            })
        )
    );

    const tenantRecords = await Promise.all(
        tenants.map(([name, email, phone]) =>
            prisma.user.upsert({
                where: { email },
                update: { name, phone, role: "TENANT", status: "ACTIVE" },
                create: { name, email, phone, password: hashedPassword, role: "TENANT", status: "ACTIVE" },
            })
        )
    );

    const categoryRecords = await Promise.all(
        categories.map(([name, description]) =>
            prisma.category.upsert({
                where: { slug: slugify(name) },
                update: { name, description, isActive: true },
                create: { name, slug: slugify(name), description, isActive: true },
            })
        )
    );

    const landlordsByEmail = new Map(landlordRecords.map((landlord) => [landlord.email, landlord]));
    const categoriesByName = new Map(categoryRecords.map((category) => [category.name, category]));

    const propertyRecords = [];

    for (const seed of propertySeeds) {
        const landlord = landlordsByEmail.get(seed.landlordEmail);
        const category = categoriesByName.get(seed.category);

        if (!landlord || !category) {
            throw new Error(`Missing landlord or category for ${seed.title}`);
        }

        const existingProperty = await prisma.property.findFirst({
            where: {
                title: seed.title,
                landlordId: landlord.id,
            },
        });

        const propertyData = {
            landlordId: landlord.id,
            categoryId: category.id,
            title: seed.title,
            description: seed.description,
            address: seed.address,
            city: seed.city,
            state: seed.state,
            country: seed.country,
            postalCode: seed.postalCode,
            price: seed.price,
            amenities: seed.amenities,
            images: [...seed.images],
            latitude: seed.latitude,
            longitude: seed.longitude,
            isAvailable: true,
            status: "ACTIVE" as const,
        };

        const property = existingProperty
            ? await prisma.property.update({
                where: { id: existingProperty.id },
                data: propertyData,
            })
            : await prisma.property.create({
                data: propertyData,
            });

        propertyRecords.push(property);
    }

    const rentalPlans = [
        { propertyIndex: 0, tenantIndex: 0, status: "ACTIVE" as const, message: "I would like to move in next month.", paid: true, rating: 5 },
        { propertyIndex: 1, tenantIndex: 1, status: "APPROVED" as const, message: "Please approve my rental request.", paid: false },
        { propertyIndex: 2, tenantIndex: 2, status: "PENDING" as const, message: "Is this house available from the 15th?", paid: false },
        { propertyIndex: 3, tenantIndex: 3, status: "REJECTED" as const, message: "I need a short-term rental.", paid: false },
        { propertyIndex: 4, tenantIndex: 0, status: "COMPLETED" as const, message: "Looking for a family rental.", paid: true, rating: 4 },
    ];

    for (const [index, plan] of rentalPlans.entries()) {
        const property = propertyRecords[plan.propertyIndex];
        const tenant = tenantRecords[plan.tenantIndex];

        const existingRental = await prisma.rental.findFirst({
            where: {
                propertyId: property.id,
                tenantId: tenant.id,
            },
        });

        const rentalData = {
            propertyId: property.id,
            tenantId: tenant.id,
            landlordId: property.landlordId,
            message: plan.message,
            status: plan.status,
            moveInDate: new Date(`2026-0${index + 2}-01T00:00:00.000Z`),
            startDate: new Date(`2026-0${index + 2}-05T00:00:00.000Z`),
            endDate: new Date(`2026-0${index + 3}-05T00:00:00.000Z`),
            approvedAt: ["APPROVED", "ACTIVE", "COMPLETED"].includes(plan.status) ? new Date() : null,
            rejectedAt: plan.status === "REJECTED" ? new Date() : null,
            rejectionReason: plan.status === "REJECTED" ? "Property is no longer available for the requested period." : null,
        };

        const rental = existingRental
            ? await prisma.rental.update({
                where: { id: existingRental.id },
                data: rentalData,
            })
            : await prisma.rental.create({
                data: rentalData,
            });

        if (plan.paid) {
            const payment = await prisma.payment.upsert({
                where: {
                    transactionId: `seed_payment_${rental.id}`,
                },
                update: {
                    amount: property.price,
                    status: "COMPLETED",
                    paidAt: new Date(),
                    payerId: tenant.id,
                    rentalId: rental.id,
                },
                create: {
                    payerId: tenant.id,
                    rentalId: rental.id,
                    transactionId: `seed_payment_${rental.id}`,
                    provider: "STRIPE",
                    amount: property.price,
                    currency: "bdt",
                    status: "COMPLETED",
                    stripeCheckoutSessionId: `cs_seed_${rental.id}`,
                    stripePaymentIntentId: `pi_seed_${rental.id}`,
                    paidAt: new Date(),
                },
            });

            await prisma.review.upsert({
                where: {
                    rentalId: rental.id,
                },
                update: {
                    propertyId: property.id,
                    tenantId: tenant.id,
                    rating: plan.rating || 5,
                    comment: `Seed review for ${property.title}. Payment ${payment.transactionId} completed successfully.`,
                },
                create: {
                    propertyId: property.id,
                    tenantId: tenant.id,
                    rentalId: rental.id,
                    rating: plan.rating || 5,
                    comment: `Seed review for ${property.title}. Payment ${payment.transactionId} completed successfully.`,
                },
            });
        }
    }

    console.log("Database seeded successfully");
    console.table({
        admin: admin.email,
        landlords: landlordRecords.length,
        tenants: tenantRecords.length,
        categories: categoryRecords.length,
        properties: propertyRecords.length,
        rentals: rentalPlans.length,
    });
};

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
