import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const colleges = [
  {
    name: "National Institute of Technology Karnataka (NITK)",
    domain: "nitk.ac.in",
    location: "Surathkal",
  },
  {
    name: "St. Aloysius College",
    domain: "staloysius.ac.in",
    location: "Mangalore (Light House Hill Road)",
  },
  {
    name: "NITTE University",
    domain: "nitte.edu.in",
    location: "Deralakatte, Mangalore",
  },
  {
    name: "Manipal College of Dental Sciences (MCODS)",
    domain: "manipal.edu",
    location: "Mangalore (Light House Hill Road & Attavar)",
  },
  {
    name: "Kasturba Medical College (KMC), Mangalore",
    domain: "kmc-mangalore.edu",
    location: "Light House Hill Road, Mangalore",
  },
  {
    name: "A. B. Shetty Memorial Institute of Dental Sciences",
    domain: "absheralaya.org",
    location: "Deralakatte, Mangalore",
  },
  {
    name: "Yenepoya University",
    domain: "yenepoya.edu.in",
    location: "Deralakatte, Mangalore",
  },
  {
    name: "St Joseph Engineering College (SJEC)",
    domain: "sjec.ac.in",
    location: "Vamanjoor, Mangalore",
  },
  {
    name: "AJ Institute of Dental Sciences",
    domain: "ajidentalcollege.com",
    location: "Kuntikana, Mangalore",
  },
  {
    name: "Srinivas Institute of Dental Sciences",
    domain: "srinivascollege.ac.in",
    location: "Mukka, Surathkal",
  },
  {
    name: "Sahyadri College of Engineering & Management",
    domain: "sahyadri.edu.in",
    location: "Adyar, Mangalore",
  },
];

async function main() {
  console.log("🎓 Seeding Mangalore colleges...\n");

  for (const college of colleges) {
    try {
      const existing = await prisma.college.findUnique({
        where: { domain: college.domain },
      });

      if (existing) {
        console.log(`⏭️  Skipping ${college.name} (already exists)`);
        continue;
      }

      const created = await prisma.college.create({
        data: {
          name: college.name,
          domain: college.domain,
          isActive: true,
        },
      });

      console.log(`✅ Added: ${created.name}`);
      console.log(`   📍 Location: ${college.location}`);
      console.log(`   🌐 Domain: ${created.domain}\n`);
    } catch (error) {
      console.error(`❌ Error adding ${college.name}:`, error.message);
    }
  }

  console.log("\n✨ College seeding complete!");
  
  // Show total count
  const totalColleges = await prisma.college.count();
  console.log(`📊 Total colleges in database: ${totalColleges}`);
}

main()
  .catch((e) => {
    console.error("Error seeding colleges:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
