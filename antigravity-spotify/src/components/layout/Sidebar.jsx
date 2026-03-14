import { Home, Search, Library, Plus, Sparkles } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "../../lib/utils";

const NAV_ITEMS = [
  { icon: Home, label: "Home", href: "/" },
  { icon: Search, label: "Search", href: "/search" },
  { icon: Library, label: "Your Library", href: "/library" },
];

export function Sidebar() {
  const location = useLocation();

  return (
    <aside className="w-64 flex-shrink-0 bg-black/40 backdrop-blur-xl border-r border-white/5 h-full p-6 flex flex-col gap-8">
      <Link to="/" className="flex items-center gap-3 group">
        <div className="relative">
          <div className="absolute inset-0 bg-purple-500 rounded-full blur group-hover:blur-md transition-all duration-300 opacity-50 group-hover:opacity-100" />
          <Sparkles className="w-8 h-8 text-white relative z-10" />
        </div>
        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 tracking-tight">
          AntiGravity
        </span>
      </Link>

      <nav className="flex flex-col gap-2">
        {NAV_ITEMS.map(({ icon: Icon, label, href }) => {
          const isActive = location.pathname === href;
          return (
            <Link
              key={href}
              to={href}
              className={cn(
                "flex items-center gap-4 px-4 py-3 rounded-2xl transition-all duration-300 text-sm font-medium",
                isActive 
                  ? "bg-white/10 text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]" 
                  : "text-white/50 hover:text-white hover:bg-white/5"
              )}
            >
              <Icon className={cn("w-5 h-5", isActive ? "text-purple-400" : "")} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="mt-auto">
        <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/10 to-blue-500/10 border border-white/5 overflow-hidden relative group cursor-pointer">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-blue-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 flex flex-col items-center gap-2 text-center">
            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center mb-1 group-hover:scale-110 transition-transform duration-300">
              <Plus className="w-5 h-5 text-white" />
            </div>
            <span className="text-sm font-semibold text-white">New Playlist</span>
            <span className="text-xs text-white/50">Create in zero-G</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
