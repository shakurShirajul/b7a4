import bcrypt from "bcryptjs";
import { prisma } from "../lib/prisma";
import config from "../config";

const adminEmail = process.env.ADMIN_EMAIL || "admin@rentnest.com";
const adminPassword = process.env.ADMIN_PASSWORD || "Admin@123456";

const main = async () => {
    const hashedPassword = await bcrypt.hash(
        adminPassword,
        Number(config.bcrypt_salt_rounds || 12)
    );

    const admin = await prisma.user.upsert({
        where: {
            email: adminEmail,
        },
        update: {
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
        create: {
            name: "RentNest Admin",
            email: adminEmail,
            password: hashedPassword,
            role: "ADMIN",
            status: "ACTIVE",
        },
        omit: {
            password: true,
            refreshTokenHash: true,
        },
    });

    console.log(`Admin user ready: ${admin.email}`);
};

main()
    .catch((error) => {
        console.error(error);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
