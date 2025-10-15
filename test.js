import clientPromise from "@/lib/mongodb";
import bcrypt from "bcryptjs";

async function seedWorkers() {
  const client = await clientPromise;
  const db = client.db();

  // Example workers
  const workers = [
    {
      workerId: "MU001",
      name: "Manish (MU Worker)",
      password: "password123",
      role: "worker",
    },
    {
      workerId: "CL001",
      name: "Chandan (CL Worker)",
      password: "password123",
      role: "worker",
    },
    {
      workerId: "DC001",
      name: "Deepak (DC Worker)",
      password: "password123",
      role: "worker",
    },
  ];

  for (let worker of workers) {
    const passwordHash = await bcrypt.hash(worker.password, 10);

    await db.collection("workers").updateOne(
      { workerId: worker.workerId },
      {
        $set: {
          workerId: worker.workerId,
          name: worker.name,
          passwordHash,
          role: worker.role,
        },
      },
      { upsert: true } // create if not exists
    );
  }

  console.log("✅ Workers seeded successfully");
  process.exit();
}

seedWorkers().catch((err) => {
  console.error(err);
  process.exit(1);
});
