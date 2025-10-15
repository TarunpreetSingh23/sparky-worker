import { NextResponse } from "next/server";
// import connectDB from "@/lib/db";
import connectDB from "@/lib/mongodb";
import Task from "@/models/Task";

export async function PATCH(req) {
  await connectDB();
  const { taskId, workerId, action } = await req.json();

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 });
    }

console.log("Task fetched:", task);
console.log("Assigned workers:", task.assignedWorkers);
console.log("Type of assignedWorkers:", typeof task.assignedWorkers);
console.log("Is array?", Array.isArray(task.assignedWorkers));

   // Ensure assignedWorkers is always an array
// Find assigned worker using prefix match
const workerEntry = task.assignedWorkers.find((w) => {
  console.log("Worker in task:", w.workerId);
  return w.workerId.startsWith(workerId);
});

if (!workerEntry) {
  return NextResponse.json(
    { success: false, message: "Worker not assigned" },
    { status: 403 }
  );
}

// Update worker status
workerEntry.status = action === "accept" ? "Accepted" : "Rejected";

if (action === "accept") {
  task.status = "Accepted";
  task.is_approved = true;

  // Reject all other workers
  task.assignedWorkers.forEach(w => {
    if (w.workerId !== workerEntry.workerId) w.status = "Rejected";
  });
} else if (action === "reject") {
  // Mark worker rejected
  workerEntry.status = "Rejected";

  // If all rejected
  const allRejected = task.assignedWorkers.every(w => w.status === "Rejected");
  if (allRejected) {
    task.status = "Rejected";
    task.is_rejected = true;
  }
}

await task.save();
return NextResponse.json({ success: true, task });


  } catch (err) {
    console.error("Error updating task:", err);
    return NextResponse.json(
      { success: false, message: "Failed to update task" },
      { status: 500 }
    );
  }
}
