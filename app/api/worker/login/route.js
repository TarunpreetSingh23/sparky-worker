import { dbConnect } from "@/lib/mongodb";
// import Worker from "@/models/Worker";
import Worker from "@/models/Worker";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";

export async function POST(req) {
  try {
    await dbConnect();
    const { workerId, password } = await req.json();

    const worker = await Worker.findOne({ workerId });
    if (!worker) {
      return NextResponse.json({ error: "Worker not found" }, { status: 404 });
    }

    const isValid = await bcrypt.compare(password, worker.passwordHash);
    if (!isValid) {
      return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
    }

    // ⚡️ Here you can return worker info or integrate with NextAuth
    return NextResponse.json({ workerId: worker.workerId, name: worker.name });
  } catch (err) {
    console.error("Login error:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
