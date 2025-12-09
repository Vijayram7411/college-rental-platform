import { PrismaClient } from "../src/generated/prisma/index.js";

const prisma = new PrismaClient();

const engineeringColleges = [
  {
    name: "National Institute of Technology Karnataka (NITK)",
    domain: "nitk.ac.in",
    location: "Surathkal, Mangalore",
  },
  {
    name: "Mangalore Institute of Technology & Engineering (MITE)",
    domain: "mite.ac.in",
    location: "Moodbidri, Mangalore",
  },
  {
    name: "Sahyadri College of Engineering & Management (SCEM)",
    domain: "sahyadri.edu.in",
    location: "Adyar, Mangalore",
  },
  {
    name: "St Joseph Engineering College (SJEC)",
    domain: "sjec.ac.in",
    location: "Vamanjoor, Mangalore",
  },
  {
    name: "NMAM Institute of Technology (NMAMIT)",
    domain: "nitte.edu.in",
    location: "Nitte, Karkala (Near Mangalore)",
  },
  {
    name: "Canara Engineering College (CEC)",
    domain: "canara.ac.in",
    location: "Benjanapadavu, Mangalore",
  },
  {
    name: "Alva's Institute of Engineering & Technology (AIET)",
    domain: "alvasinstitute.org",
    location: "Moodbidri, Mangalore",
  },
  {
    name: "AJ Institute of Engineering & Technology (AJIET)",
    domain: "ajiet.edu.in",
    location: "Kottara Chowki, Mangalore",
  },
  {
    name: "Yenepoya Institute of Technology (YIT)",
    domain: "yenepoya.edu.in",
    location: "Moodbidri, Mangalore",
  },
  {
    name: "Srinivas Institute of Technology (SIT)",
    domain: "srinivas.edu.in",
    location: "Valachil, Mangalore",
  },
];

async function main() {
  console.log("🎓 Seeding Engineering Colleges...\n");

  for (const college of engineeringColleges) {
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

  console.log("\n✨ Engineering colleges seeding complete!");
  
  // Show total count
  const totalColleges = await prisma.college.count();
  console.log(`📊 Total colleges in database: ${totalColleges}`);
}

main()
  .catch((e) => {
    console.error("Error seeding engineering colleges:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
