'use client';
import { useState } from 'react';
import { auth, googleProvider } from '../../firebase/firebase';
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff } from 'lucide-react'; // Optional: install lucide-react or use heroicons

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push('/');
      }
    });
    return () => unsubscribe(); // cleanup
  }, [router]);
  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/');
    } catch (error) {
      setErrorMsg('❌ Invalid email or password. Please try again.');
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      router.push('/');
    } catch (error) {
      setErrorMsg('❌ Google login failed. Please try again.');
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 px-4 py-10">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden min-h-[70vh]">

        {/* Left Login Form */}
        <div className="w-full md:w-1/2 p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-2">Welcome Back 👋</h1>
          <p className="text-center text-gray-500 mb-6">Please login to your account</p>

          {errorMsg && (
            <p className="text-red-600 text-sm text-center mb-4">{errorMsg}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(prev => !prev)}
                className="absolute right-3 top-3 text-gray-600"
                aria-label="Toggle password visibility"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <div className="text-right">
              <button
                type="button"
                onClick={() => router.push('/reset-password')}
                className="text-sm text-blue-600 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Login
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Or continue with</p>
            <button
              onClick={handleGoogleLogin}
              className="mt-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Login with Google
            </button>

            {/* Sign up link */}
            <p className="mt-6 text-sm text-gray-600">
              Don’t have an account?{' '}
              <button
                onClick={() => router.push('/signup')}
                className="text-blue-600 hover:underline"
              >
                Sign up here
              </button>
            </p>
          </div>
        </div>

        {/* Right Image Panel */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-8">
          <img
            src="/assets/login.svg"
            alt="Login Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
