import { useState } from "react";
import { Sparkles, Mail, Lock, User, Github } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { supabase } from "../lib/supabase";
import { cn } from "../lib/utils";

export function Auth() {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const syncUserToSupabase = async (firebaseUser, name) => {
    try {
      await supabase.from("users").upsert({
        id: firebaseUser.uid,
        email: firebaseUser.email,
        display_name: name || firebaseUser.displayName || firebaseUser.email.split("@")[0],
        avatar_url: firebaseUser.photoURL || null,
        created_at: new Date().toISOString()
      });
    } catch (err) {
      console.error("Error syncing to Supabase:", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isLogin) {
        const cred = await signInWithEmailAndPassword(auth, formData.email, formData.password);
        await syncUserToSupabase(cred.user);
      } else {
        const cred = await createUserWithEmailAndPassword(auth, formData.email, formData.password);
        await updateProfile(cred.user, { displayName: formData.name });
        await syncUserToSupabase(cred.user, formData.name);
      }
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogle = async () => {
    setError("");
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      await syncUserToSupabase(cred.user);
      navigate("/");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden bg-[#050510]">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/30 rounded-full mix-blend-screen filter blur-[100px] animate-pulse delay-1000" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <div className="bg-black/40 backdrop-blur-2xl border border-white/10 rounded-3xl p-8 shadow-[0_0_50px_rgba(168,85,247,0.15)]">
          <div className="flex flex-col items-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center mb-4 shadow-[0_0_30px_rgba(168,85,247,0.4)] relative group">
              <div className="absolute inset-0 bg-white/20 blur-md opacity-0 group-hover:opacity-100 transition-opacity" />
              <Sparkles className="w-8 h-8 text-white relative z-10" />
            </div>
            <h1 className="text-3xl font-bold text-white tracking-tight">AntiGravity</h1>
            <p className="text-white/50 text-sm mt-2">Enter the sonic dimension</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
                <input
                  type="text"
                  placeholder="Display Name"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
                />
              </div>
            )}

            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="email"
                placeholder="Email Address"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40 group-focus-within:text-purple-400 transition-colors" />
              <input
                type="password"
                placeholder="Password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3 pl-12 pr-4 text-white placeholder:text-white/30 focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/50 outline-none transition-all"
              />
            </div>

            {error && (
              <p className="text-red-400 text-sm text-center bg-red-400/10 py-2 rounded-lg">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white font-medium py-3 rounded-xl hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(168,85,247,0.3)]"
            >
              {loading ? "Establishing Link..." : isLogin ? "Sign In" : "Create Profile"}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-white/10">
            <button
              onClick={handleGoogle}
              type="button"
              className="w-full bg-white text-black font-medium py-3 rounded-xl hover:bg-white/90 transition-colors flex items-center justify-center gap-2"
            >
              <Github className="w-5 h-5" />
              Continue with Google
            </button>
          </div>

          <div className="mt-6 text-center">
            <button
              type="button"
              onClick={() => setIsLogin(!isLogin)}
              className="text-white/50 hover:text-white text-sm transition-colors"
            >
              {isLogin ? "Need a cosmic pass? Register" : "Already have a pass? Sign in"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
