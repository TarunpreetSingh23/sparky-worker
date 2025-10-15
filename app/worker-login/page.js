import { useState, Suspense } from "react";

// --- MOCK IMPLEMENTATIONS FOR COMPILATION ---
// In a standalone environment, we must mock Next.js and NextAuth imports.

// Mock for useRouter
const useRouter = () => ({
  push: (url) => {
    console.log(`[MOCK] Navigating to: ${url}`);
  },
});

// Mock for useSearchParams
const useSearchParams = () => {
    // In this environment, we mock the function to safely retrieve parameters.
    const params = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : new URLSearchParams();
    return {
        get: (key) => {
            // Provide a default callbackUrl for demonstration
            if (key === 'callbackUrl') {
                return params.get(key) || '/dashboard';
            }
            return params.get(key);
        }
    };
};

// Mock for next-auth's signIn function
const mockSignIn = async (provider, credentials) => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000)); 
    
    // Simple mock logic: 'error' on failure, null on success
    if (credentials.workerId === "fail" || credentials.password === "fail") {
        return { error: "Invalid mock credentials. Try any other input." };
    }
    return { error: null };
};

// Mock Icons using inline SVG to replace lucide-react imports
const LogInIcon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
    <polyline points="10 17 15 12 10 7" />
    <line x1="15" x2="3" y1="12" y2="12" />
  </svg>
);

const Loader2Icon = (props) => (
  <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
    <path d="M21 12a9 9 0 1 1-6.219-8.56" />
  </svg>
);
// --- END MOCK IMPLEMENTATIONS ---


// 1. This is the Client Component that uses the hooks
const WorkerLoginContent = () => {
  const [workerId, setWorkerId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  
  // Using MOCK useRouter/useSearchParams
  const router = useRouter();
  const searchParams = useSearchParams(); 
  
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
        // Using MOCK signIn
        const res = await mockSignIn("credentials", {
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
    } catch (e) {
        setError("An unexpected error occurred during login.");
    } finally {
        setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 w-full max-w-sm border border-gray-100 dark:border-gray-700 transition-all duration-300"
      >
        <div className="flex justify-center mb-6 text-blue-600 dark:text-blue-400">
            <LogInIcon className="w-8 h-8" />
        </div>
        <h1 className="text-3xl font-extrabold mb-8 text-center text-gray-900 dark:text-white">
          Worker Login
        </h1>

        {error && (
          <div className="mb-4 p-3 bg-red-100 dark:bg-red-900/30 border border-red-300 dark:border-red-700 text-red-700 dark:text-red-300 rounded-lg text-sm transition-all duration-300">
            {error}
          </div>
        )}

        <input
          type="text"
          placeholder="Worker ID (use 'fail' to see error)"
          value={workerId}
          onChange={(e) => setWorkerId(e.target.value)}
          required
          className="w-full mb-4 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />

        <input
          type="password"
          placeholder="Password (use 'fail' to see error)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full mb-6 px-4 py-3 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-200"
        />

        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 flex items-center justify-center bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors duration-200 focus:outline-none focus:ring-4 focus:ring-blue-500/50"
        >
          {isLoading ? (
            <>
              <Loader2Icon className="w-5 h-5 mr-2 animate-spin" />
              Logging In...
            </>
          ) : (
            <>
              <LogInIcon className="w-5 h-5 mr-2" />
              Login
            </>
          )}
        </button>
      </form>
    </div>
  );
};

// 2. This is the main page component export (Server Component wrapper).
const WorkerLogin = () => {
    const LoadingFallback = (
        <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-900 p-4">
            <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-xl shadow-2xl">
                <Loader2Icon className="w-8 h-8 text-blue-500 animate-spin mx-auto mb-3" />
                <p className="text-gray-700 dark:text-gray-300 font-medium">Loading login form...</p>
            </div>
        </div>
    );

    return (
        // Suspense remains to respect the original Next.js fix pattern
        <Suspense fallback={LoadingFallback}>
            <WorkerLoginContent />
        </Suspense>
    );
};

export default WorkerLogin;
