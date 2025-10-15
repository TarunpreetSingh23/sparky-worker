"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

export default function WorkerLogin() {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const res = await signIn("credentials", {
      redirect: false,
      workerId,
      password,
      callbackUrl,
    });

    if (res?.error) {
      setError(res.error);
    } else {
      router.push(callbackUrl);
    }
  };

  return (
     <Suspense fallback={<p className="text-center py-10">Loading...</p>}>
    <div className="flex min-h-screen items-center justify-center bg-gray-900">
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-xl p-8 w-full max-w-sm"
      >
        <h1 className="text-2xl font-bold mb-6 text-center">
          Worker Login
        </h1>

        {error && (
          <p className="mb-4 text-red-500 text-center">{error}</p>
        )}

        <input
          type="text"
          placeholder="Worker ID"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

       

        <button
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
        >
          Login
        </button>
      </form>
    </div>
  </Suspense>
  );
}
