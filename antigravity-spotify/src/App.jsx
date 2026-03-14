import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./lib/firebase";
import { useAuthStore } from "./store/useAuthStore";
import { Layout } from "./components/layout/Layout";
import { Home } from "./pages/Home";
import { Search } from "./pages/Search";
import { Library } from "./pages/Library";
import { Auth } from "./pages/Auth";

export default function App() {
  const { user, setUser, isLoading } = useAuthStore();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsub();
  }, [setUser]);

  if (isLoading) {
    return (
      <div className="h-screen w-full bg-[#050510] flex items-center justify-center">
        <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth" element={!user ? <Auth /> : <Navigate to="/" />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="search" element={<Search />} />
          <Route path="library" element={user ? <Library /> : <Navigate to="/auth" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
