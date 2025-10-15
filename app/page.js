"use client";

import { motion } from "framer-motion";
import { Briefcase, TrendingUp, Clock, Bell, Phone, ListTodo, User, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function WorkerHome() {
  const { data: session, status } = useSession();
  const router = useRouter();

  // If not logged in → redirect to login
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/worker-login");
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center text-white bg-gray-900">
        <p className="animate-pulse">Checking session...</p>
      </div>
    );
  }

  if (!session) return null; // Prevent flicker while redirecting

  const stats = [
    { title: "Today’s Jobs", value: 5, icon: Briefcase },
    { title: "Earnings", value: "₹1,250", icon: TrendingUp },
    { title: "On-Time Rate", value: "98%", icon: Clock },
  ];

  const navLinks = [
    { title: "Tasks", icon: ListTodo, href: "/tasks" },
    { title: "Accepted Task", icon: Bell, href: "/" },
    { title: "Contact", icon: Phone, href: "/contact" },
    { title: "Profile", icon: User, href: "/profile" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-black flex flex-col justify-between">
      {/* Header with Logout */}
      <div className="flex justify-between items-center px-6 pt-6">
        <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
          Worker Dashboard
        </h1>
        <button
          onClick={() => signOut({ callbackUrl: "/worker-login" })}
          className="flex items-center gap-2 bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-xl shadow transition"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>

      {/* Stats Section */}
      <div className="px-6 pt-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((stat, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.2 }}
              className="relative bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl p-6 shadow-lg hover:shadow-blue-500/20 hover:scale-[1.02] transition"
            >
              <stat.icon className="w-8 h-8 text-blue-400 mb-3" />
              <p className="text-gray-300 text-sm">{stat.title}</p>
              <h2 className="text-2xl font-bold text-white">{stat.value}</h2>
              <div className="absolute inset-0 rounded-2xl border border-transparent hover:border-blue-400/40 transition" />
            </motion.div>
          ))}
        </div>
      </div>

      {/* Bottom Navigation */}
      <nav className="sticky bottom-0 w-full bg-white/10 backdrop-blur-lg border-t border-white/20 shadow-lg">
        <div className="grid grid-cols-4 text-center py-3">
          {navLinks.map((link, i) => (
            <Link
              key={i}
              href={link.href}
              className="flex flex-col items-center text-gray-300 hover:text-blue-400 transition"
            >
              <link.icon className="w-6 h-6 mb-1" />
              <span className="text-xs">{link.title}</span>
            </Link>
          ))}
        </div>
      </nav>
    </div>
  );
}
