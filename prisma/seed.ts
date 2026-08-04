import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";

import { BookingStatus, PaymentStatus, Role } from "./generated/prisma/enums";
import prisma from "../src/lib/prisma";

async function main() {
  console.log("Cleaning up old data...");
  await prisma.review.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.service.deleteMany();
  await prisma.technicianProfile.deleteMany();
  await prisma.user.deleteMany();

  const password = await bcrypt.hash("123456", 10);

  const [Customer1, Customer2, Technician1, Technician2, Admin] = await Promise.all([
    prisma.user.create({
      data: {
        name: "Customer_1",
        email: "customer1@fix.com",
        password,
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Customer_2",
        email: "customer2@fix.com",
        password,
        role: Role.CUSTOMER,
      },
    }),
    prisma.user.create({
      data: {
        name: "Technician_1",
        email: "technician1@fix.com",
        password,
        role: Role.TECHNICIAN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Technician_2",
        email: "technician2@fix.com",
        password,
        role: Role.TECHNICIAN,
      },
    }),
    prisma.user.create({
      data: {
        name: "Admin",
        email: "admin@fix.com",
        password,
        role: Role.ADMIN,
      },
    }),
  ]);

  console.log("Created 5 users (including seeded Admin)");

  const [techProfile1, techProfile2] = await Promise.all([
    prisma.technicianProfile.create({
      data: {
        userId: Technician1.id,
        skills: "Plumbing, Pipe Fitting, Water Leak Repair",
        experience: 5,
        location: "Gulshan, Dhaka",
        availability: "Mon-Sat 9AM-6PM",
      },
    }),
    prisma.technicianProfile.create({
      data: {
        userId: Technician2.id,
        skills: "Electrical Wiring, AC Repair, Appliance Maintenance",
        experience: 7,
        location: "Banani, Dhaka",
        availability: "Mon-Sun 10AM-8PM",
      },
    }),
  ]);

  console.log("Created 2 technician profiles");

  const services = await Promise.all([
    prisma.service.create({
      data: {
        name: "Pipe Leakage Repair",
        category: "Plumbing",
        description: "Fix leaking pipes and joints efficiently.",
        price: 1500,
        technicianId: techProfile1.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "AC Servicing & Master Clean",
        category: "Electrical",
        description: "Deep clean indoor and outdoor split AC unit.",
        price: 2500,
        technicianId: techProfile2.id,
      },
    }),
    prisma.service.create({
      data: {
        name: "Full House Deep Cleaning",
        category: "Cleaning",
        description: "Complete apartment cleaning including kitchen & bathroom.",
        price: 5000,
        technicianId: techProfile1.id,
      },
    }),
  ]);

  console.log(`Created ${services.length} services`);

  const booking1 = await prisma.booking.create({
    data: {
      serviceId: services[0].id,
      customerId: Customer1.id,
      technicianId: techProfile1.id,
      scheduledDate: new Date("2026-08-10"),
      totalPrice: services[0].price,
      status: BookingStatus.COMPLETED,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking1.id,
      amount: services[0].price,
      status: PaymentStatus.COMPLETED,
      transactionId: randomUUID(),
    },
  });

  await prisma.review.create({
    data: {
      bookingId: booking1.id,
      customerId: Customer2.id,
      rating: 5,
      comment: "Excellent plumbing work! Very prompt and professional.",
    },
  });

  const booking2 = await prisma.booking.create({
    data: {
      serviceId: services[1].id,
      customerId: Customer2.id,
      technicianId: techProfile2.id,
      scheduledDate: new Date("2026-08-15"),
      totalPrice: services[1].price,
      status: BookingStatus.ACCEPTED,
    },
  });

  await prisma.payment.create({
    data: {
      bookingId: booking2.id,
      amount: services[1].price,
      status: PaymentStatus.PENDING,
      transactionId: randomUUID(),
    },
  });

  console.log("Created seed bookings, payments, and reviews");
  console.log("Seed finished!");
}

main().then(() => {
  process.exit(0);
});
