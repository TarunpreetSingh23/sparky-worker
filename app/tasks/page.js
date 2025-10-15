"use client";

import { useSession } from "next-auth/react";
// ✅ NEW: Import usePathname to track the current page for the nav bar
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import Link from "next/link";
// ✅ NEW: More icons for a richer UI
import {
  Home,
  Bell,
  Phone,
  User,
  Check,
  ListChecks,
  MapPin,
  CalendarClock,
  UserCircle2,
  
  X,
  Upload,
  ClipboardList,
} from "lucide-react";

export default function TasksPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tasks, setTasks] = useState([]);
  const pathname = usePathname(); // Get current path for active nav link

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/worker-login");
    }
  }, [status, router]);

  useEffect(() => {
    if (session?.user?.workerId) {
      fetch(`/api/tasks?workerId=${session.user.workerId}`)
        .then((res) => res.json())
        .then((data) => {
          const sortedTasks = data.sort(
            (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
          );
          setTasks(sortedTasks);
        })
        .catch((err) => console.error("Error fetching tasks:", err));
    }
  }, [session]);

  const handleAction = async (taskId, action) => {
    try {
      const res = await fetch(`/api/tasks/respond`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          taskId,
          workerId: session.user.workerId,
          action,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setTasks((prev) =>
          prev.map((t) => (t._id === taskId ? updated.task : t))
        );
      } else {
        const error = await res.json();
        alert(error.message);
      }
    } catch (err) {
      console.error("Error updating task:", err);
    }
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <p className="animate-pulse text-lg font-medium text-slate-600">
          Loading your tasks...
        </p>
      </div>
    );
  }

  if (!session) return null;

  const navLinks = [
    { title: "Home", icon: Home, href: "/" },
    { title: "Accepted", icon: Check, href: "/about" },
    { title: "Contact", icon: Phone, href: "/contact" },
    { title: "Profile", icon: User, href: "/profile" },
  ];

  const getStatusBadge = (taskStatus) => {
    const baseClasses = "px-3 py-1 text-xs font-semibold rounded-full";
    switch (taskStatus) {
      case "Accepted":
        return `${baseClasses} bg-green-100 text-green-800`;
      case "Rejected":
        return `${baseClasses} bg-red-100 text-red-800`;
      case "Waiting for Approval":
        return `${baseClasses} bg-yellow-100 text-yellow-800`;
      default:
        return `${baseClasses} bg-slate-100 text-slate-800`;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
      {/* ✅ UI: Main content area with responsive padding */}
      <main className="flex-1 p-4 sm:p-6 pb-24">
        {/* ✅ UI: Modernized header */}
        <header className="mb-8">
          <p className="text-slate-500">Welcome back,</p>
          <h1 className="text-3xl font-bold text-slate-800">
            Your Assigned Tasks
          </h1>
        </header>

        {tasks.length === 0 ? (
          // ✅ UI: Enhanced empty state
          <div className="text-center mt-16 flex flex-col items-center gap-4">
            <ClipboardList className="w-16 h-16 text-slate-300" />
            <h2 className="text-xl font-semibold text-slate-700">No tasks yet</h2>
            <p className="text-slate-500 max-w-xs">
              New tasks assigned to you will appear here.
            </p>
          </div>
        ) : (
          <ul className="space-y-6">
            {tasks.map((task) => {
              const workerEntry = task.assignedWorkers.find(
                (w) => w.workerId === session.user.workerId
              );

              return (
                // ✅ UI: Redesigned Task Card
                <li
                  key={task._id}
                  className="bg-white rounded-2xl shadow-sm border border-slate-200/80 overflow-hidden transition-all duration-300 hover:shadow-lg"
                >
                  {/* Card Header */}
                  <div className="p-4 flex justify-between items-start border-b border-slate-200">
                    <div>
                      <h2 className="text-lg font-bold text-slate-800">
                        {task.order_id}
                      </h2>
                      <p className="text-xs text-slate-500 mt-1">
                        Received: {new Date(task.createdAt).toLocaleString()}
                      </p>
                    </div>
                    <span className={getStatusBadge(task.status)}>
                      {task.status}
                    </span>
                  </div>

                  {/* Card Body */}
                  <div className="p-4 space-y-4">
                    <div className="flex items-start gap-3">
                      <UserCircle2 className="w-5 h-5 mt-1 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-700">{task.customerName}</p>
                        <p className="text-sm text-slate-600">{task.phone}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="w-5 h-5 mt-1 text-slate-400" />
                      <div>
                        <p className="font-semibold text-slate-700">{task.address}</p>
                        <p className="text-sm text-slate-600">{task.pincode}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <CalendarClock className="w-5 h-5 mt-1 text-slate-400" />
                       <div>
                        <p className="font-semibold text-slate-700">{task.date}</p>
                        <p className="text-sm text-slate-600">{task.timeSlot}</p>
                      </div>
                    </div>
                    <div className="pt-2 border-t border-slate-200/80">
                      <p className="font-semibold text-slate-700 mb-2 flex items-center gap-2">
                         <ListChecks className="w-5 h-5 text-slate-400"/> Services
                      </p>
                      <ul className="space-y-1 pl-2">
                        {task.cart.map((item, idx) => (
                          <li key={idx} className="flex justify-between text-sm">
                            <span className="text-slate-600">{item.name} (×{item.quantity})</span>
                            <span className="font-medium text-slate-800">₹{item.price}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Card Footer / Actions */}
                  <div className="p-4 bg-slate-50/70 border-t border-slate-200">
                    {workerEntry && (() => {
                      const workerStatus = workerEntry.status.toLowerCase();
                      const taskStatus = task.status.toLowerCase();

                      if (workerStatus === "pending" && taskStatus === "waiting for approval") {
                        return (
                          // ✅ UI: Buttons with icons
                          <div className="flex gap-4">
                            <button
                              onClick={() => handleAction(task._id, "accept")}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Check size={18} /> Accept
                            </button>
                            <button
                              onClick={() => handleAction(task._id, "reject")}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <X size={18} /> Reject
                            </button>
                          </div>
                        );
                      } else if (workerStatus === "rejected") {
                        return (
                          <p className="text-center text-red-600 font-semibold">
                            You rejected this order
                          </p>
                        );
                      } else if (workerStatus === "accepted") {
                        return (
                          <div className="flex flex-col gap-2 items-center">
                            <p className="text-green-600 font-semibold">
                              You have accepted this order
                            </p>
                            <Link
                              href={`/proof/${task.order_id}`}
                              className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Upload size={18} /> Upload Proof
                            </Link>
                          </div>
                        );
                      }
                      return null;
                    })()}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </main>

      {/* ✅ UI: Bottom Navigation with Active State */}
      <nav className="fixed bottom-0 w-full bg-white/80 backdrop-blur-lg border-t border-slate-200 shadow-[0_-2px_10px_rgba(0,0,0,0.05)]">
        <div className="grid grid-cols-4">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={i}
                href={link.href}
                className={`flex flex-col items-center justify-center py-3 transition-colors duration-200 ${
                  isActive
                    ? 'text-blue-600'
                    : 'text-gray-500 hover:text-blue-600'
                }`}
              >
                <link.icon className="w-6 h-6 mb-1" />
                <span className={`text-xs ${isActive ? 'font-bold' : 'font-medium'}`}>{link.title}</span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}