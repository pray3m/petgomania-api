import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL;
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "ADMIN_EMAIL and ADMIN_PASSWORD must be set in the .env file"
    );
  }

  const existingAdmin = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash(adminPassword, 10);

    const admin = await prisma.user.create({
      data: {
        name: "Admin User",
        email: adminEmail,
        password: hashedPassword,
        role: "ADMIN",
        isVerified: true,
      },
    });

    console.log("Admin user created:", admin.email);
  } else {
    console.log("Admin user already exists. Skipping creation.");
  }

  // Sample Products
  const sampleProducts = [
    {
      name: "Organic Dog Food",
      description: "Nutritious and organic kibble for a healthy dog diet.",
      price: 39.99,
      category: "food",
      stock: 150,
      imageUrl: "https://via.placeholder.com/600/92c952",
    },
    {
      name: "Squeaky Chew Toy",
      description:
        "Durable squeaky toy to keep your dog entertained for hours.",
      price: 14.99,
      category: "toys",
      stock: 300,
      imageUrl: "https://via.placeholder.com/150/771796",
    },
    {
      name: "Leather Dog Leash",
      description: "Premium leather leash for comfortable and secure walks.",
      price: 24.99,
      category: "accessories",
      stock: 80,
      imageUrl: "https://via.placeholder.com/150/771796",
    },
    {
      name: "Flea & Tick Prevention",
      description:
        "Effective solution to protect your dog from fleas and ticks.",
      price: 19.99,
      category: "healthcare",
      stock: 120,
      imageUrl: "https://via.placeholder.com/600/f66b97",
    },
    {
      name: "Pet Grooming Kit",
      description: "Complete grooming kit for maintaining your pet's hygiene.",
      price: 29.99,
      category: "grooming",
      stock: 60,
      imageUrl: "https://via.placeholder.com/600/56a8c2",
    },
    {
      name: "Interactive Ball Launcher",
      description:
        "Automatic ball launcher to keep your dog active and engaged.",
      price: 59.99,
      category: "toys",
      stock: 40,
      imageUrl: "https://via.placeholder.com/600/54176f",
    },
    {
      name: "Dental Chews for Dogs",
      description:
        "Helps clean teeth and freshen breath while satisfying chewing instincts.",
      price: 12.99,
      category: "healthcare",
      stock: 250,
      imageUrl: "https://via.placeholder.com/600/372c93",
    },
    {
      name: "Adjustable Dog Harness",
      description: "Comfortable and adjustable harness for secure walks.",
      price: 34.99,
      category: "accessories",
      stock: 90,
      imageUrl: "https://via.placeholder.com/600/66b7d2",
    },
    {
      name: "Premium Cat Food",
      description: "High-quality cat food enriched with essential nutrients.",
      price: 44.99,
      category: "food",
      stock: 130,
      imageUrl: "https://via.placeholder.com/600/1fe46f",
    },
    {
      name: "Catnip Toys",
      description: "Fun and stimulating catnip-filled toys for playful cats.",
      price: 9.99,
      category: "toys",
      stock: 200,
      imageUrl: "https://via.placeholder.com/600/61a65",
    },
  ];

  for (const product of sampleProducts) {
    const existingProduct = await prisma.product.findFirst({
      where: { name: product.name },
    });

    if (!existingProduct) {
      await prisma.product.create({
        data: product,
      });
      console.log(`Product '${product.name}' created.`);
    } else {
      console.log(`Product '${product.name}' already exists. Skipping.`);
    }
  }
}

main()
  .catch((e) => {
    console.error("Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
