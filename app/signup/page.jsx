"use client";
import { useState, useEffect } from "react";
import { auth, db, googleProvider } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useRouter } from "next/navigation";
import { onAuthStateChanged } from "firebase/auth";
import { Eye, EyeOff } from "lucide-react";

// --- START: Function to send a professional welcome email ---
async function sendWelcomeEmail({ email, name }) {
  // You should replace this endpoint with your actual backend API route for sending emails
  try {
    await fetch("https://mail-server-poetry-website.onrender.com/api/send-welcome-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email,
        name,
        subject: "Welcome to the Poetry Community!",
        // A professional, warm, and inviting email body
        html: `
          <div style="font-family: Arial, sans-serif; max-width:600px;margin:0 auto;">
            <h2 style="color:#222;">Welcome to the Poetry Community, ${
              name ? name : ""
            }!</h2>
            <p>We're delighted to have you join our growing family of poetry lovers and creators.</p>
            <p>
              At <b>Poetry Community</b>, you can discover and share poems, connect with fellow enthusiasts, and explore a world of creativity and inspiration.
            </p>
            <p>
              <b>Next Steps:</b>
              <ul>
                <li>✨ <a href="https://poems.toshankanwar.website/poem" style="color:#2b6cb0;">Explore featured poems</a></li>
                <li>✍️ Share your own poetic creations</li>
                <li>🤝 Connect with a supportive and vibrant community</li>
              </ul>
            </p>
            <p>
              If you have any questions or suggestions, feel free to reply to this email or reach out to our support team at <a href="mailto:contact@toshankanwar.website" style="color:#2b6cb0;">contact@toshankanwar.website</a>.
            </p>
            <p>
              Welcome aboard, and happy reading and writing!<br/>
              <span style="color:#888;">— The Poemsite Team </span>
            </p>
          </div>
        `,
      }),
    });
  } catch (err) {
    // Optionally handle error, but don't block signup
    console.error("Failed to send welcome email:", err);
  }
}
// --- END ---

export default function Signup() {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        router.push("/");
      }
    });
    return () => unsubscribe();
  }, [router]);

  // --- Helper to add user to mailingList collection ---
  const addToMailingList = async (user) => {
    try {
      await setDoc(doc(db, "mailingList", user.uid), {
        email: user.email,
        userId: user.uid,
        name: user.displayName || name,
        subscribed: true,
        created: new Date(),
      });
    } catch (err) {
      // Optionally handle error, but don't block signup
      console.error("Failed to add to mailing list:", err);
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const userCred = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      // Add to users collection
      await setDoc(doc(db, "users", userCred.user.uid), {
        email,
        name,
        role: "user",
        createdAt: new Date(),
      });

      // Add to mailingList collection
      await addToMailingList(userCred.user);

      // Send professional welcome email
      await sendWelcomeEmail({ email, name });

      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  const handleGoogleSignup = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);

      // Add/update users collection
      await setDoc(
        doc(db, "users", result.user.uid),
        {
          email: result.user.email,
          name: result.user.displayName,
          role: "user",
          createdAt: new Date(),
        },
        { merge: true }
      );

      // Add to mailingList collection
      await addToMailingList(result.user);

      // Send professional welcome email
      await sendWelcomeEmail({
        email: result.user.email,
        name: result.user.displayName,
      });

      router.push("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="h-full flex items-center justify-center bg-gray-50 px-4 py-8">
      <div className="w-full max-w-4xl flex flex-col md:flex-row bg-white rounded-xl shadow-lg overflow-hidden min-h-[70vh]">
        {/* Left Signup Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-gray-800 mb-2">
            Join Us 🎉
          </h1>
          <p className="text-center text-gray-500 mb-6 text-sm sm:text-base">
            Create your account to get started
          </p>

          <form onSubmit={handleSignup} className="space-y-4">
            <input
              type="text"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black"
              required
            />
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-gray-300 p-3 rounded-md focus:outline-none focus:ring-2 focus:ring-black pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute inset-y-0 right-3 flex items-center text-gray-600"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition"
            >
              Sign Up
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-500">Or sign up using</p>
            <button
              onClick={handleGoogleSignup}
              className="mt-3 w-full border border-gray-300 py-2 rounded-md hover:bg-gray-100 transition"
            >
              Sign up with Google
            </button>

            {/* Already have an account */}
            <p className="mt-6 text-sm text-gray-600">
              Already have an account?{" "}
              <button
                onClick={() => router.push("/login")}
                className="text-blue-600 hover:underline"
              >
                Login here
              </button>
            </p>
          </div>
        </div>

        {/* Right Image Panel */}
        <div className="hidden md:flex w-1/2 items-center justify-center bg-gray-100 p-6">
          <img
            src="/assets/signup.svg"
            alt="Signup Illustration"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </div>
  );
}
