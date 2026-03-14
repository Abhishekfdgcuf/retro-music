import { Outlet } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { FloatingPlayer } from "../player/FloatingPlayer";

export function Layout() {
  return (
    <div className="flex h-screen w-full bg-[#050510] text-slate-100 overflow-hidden relative selection:bg-purple-500/30">
      {/* Nebula Background Elements */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-blue-900/20 blur-[120px] rounded-full mix-blend-screen" />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[30%] h-[30%] bg-fuchsia-900/10 blur-[100px] rounded-full mix-blend-screen" />
      </div>

      <Sidebar />
      
      <main className="flex-1 h-full overflow-y-auto relative z-10 pb-32 no-scrollbar">
        <div className="max-w-7xl mx-auto px-8 py-10">
          <Outlet />
        </div>
      </main>

      <FloatingPlayer />
    </div>
  );
}
