import { useEffect, useState } from "react";
import { Heart, Disc3, Play } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { usePlayerStore } from "../store/usePlayerStore";
import { supabase } from "../lib/supabase";

export function Library() {
  const { user } = useAuthStore();
  const { play } = usePlayerStore();
  const [likedSongs, setLikedSongs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadLibrary() {
      if (!user) {
        setLoading(false);
        return;
      }
      
      const { data, error } = await supabase
        .from('liked_songs')
        .select('*')
        .eq('user_id', user.uid)
        .order('liked_at', { ascending: false });

      if (error) {
        console.error("Error fetching library:", error);
      } else {
        setLikedSongs(data || []);
      }
      setLoading(false);
    }

    loadLibrary();
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6">
        <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center relative group">
          <div className="absolute inset-0 bg-purple-500/20 blur-xl rounded-full opacity-50 group-hover:opacity-100 transition-opacity" />
          <Heart className="w-10 h-10 text-white/50 relative z-10" />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-2">Connect to the Network</h2>
          <p className="text-white/50 max-w-md">Sign in to sync your favorite cosmic tracks across the universe and build your personal gravity-defying library.</p>
        </div>
        <button className="px-8 py-3 rounded-full bg-white text-black font-semibold hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
          Launch Comm Link
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex items-end gap-6 bg-gradient-to-t from-[#050510] to-purple-900/20 p-8 rounded-3xl border border-white/5">
        <div className="w-48 h-48 rounded-2xl bg-gradient-to-br from-purple-500 to-blue-600 shadow-[0_0_40px_rgba(168,85,247,0.4)] flex items-center justify-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=1000&auto=format&fit=crop')] mix-blend-overlay opacity-50 group-hover:scale-110 transition-transform duration-1000" />
          <Heart className="w-16 h-16 text-white drop-shadow-lg" fill="currentColor" />
        </div>
        <div className="space-y-2 pb-2">
          <span className="text-xs font-bold tracking-widest uppercase text-white/70">Playlist</span>
          <h1 className="text-6xl font-black tracking-tighter shadow-black drop-shadow-md">Liked Coordinates</h1>
          <p className="text-white/60 text-sm font-medium">{user.displayName || "Astronaut"} • {likedSongs.length} signals</p>
        </div>
      </div>

      {loading ? (
        <div className="space-y-4 animate-pulse">
           {[...Array(5)].map((_, i) => (
             <div key={i} className="h-16 bg-white/5 rounded-xl border border-white/5" />
           ))}
        </div>
      ) : likedSongs.length > 0 ? (
        <div className="space-y-2">
           <div className="grid grid-cols-[16px_1fr_auto] gap-4 px-6 py-2 text-xs font-medium text-white/50 uppercase tracking-wider mb-2 border-b border-white/5">
              <span>#</span>
              <span>Title</span>
              <span>Saved</span>
           </div>
           
           {likedSongs.map((item, index) => {
             const track = item.song_data;
             return (
               <div 
                 key={item.id}
                 className="grid grid-cols-[16px_1fr_auto] items-center gap-4 px-6 py-3 hover:bg-white/5 rounded-xl group transition-colors cursor-pointer"
                 onClick={() => play(track)}
               >
                 <span className="text-white/50 text-sm w-4 text-center group-hover:hidden">{index + 1}</span>
                 <Play className="w-4 h-4 fill-white hidden group-hover:block text-purple-400" />
                 
                 <div className="flex items-center gap-4 min-w-0">
                   <div className="w-10 h-10 rounded overflow-hidden flex-shrink-0 relative">
                     <img src={track.image} alt={track.name} className="w-full h-full object-cover" />
                     {/* Zero-G spin effect on hover inside list */}
                     <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity" />
                     <Disc3 className="absolute inset-0 m-auto w-5 h-5 opacity-0 group-hover:opacity-100 text-white/80 animate-spin-slow transition-opacity drop-shadow-md" />
                   </div>
                   <div className="truncate">
                     <h4 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">{track.name}</h4>
                     <p className="text-white/50 text-sm truncate">{track.artist_name}</p>
                   </div>
                 </div>

                 <span className="text-white/30 text-sm hidden sm:block">
                   {new Date(item.liked_at).toLocaleDateString()}
                 </span>
               </div>
             );
           })}
        </div>
      ) : (
        <div className="text-center py-24 px-4 border border-white/10 rounded-3xl bg-white/5 border-dashed">
          <Heart className="w-12 h-12 text-white/20 mx-auto mb-4" />
          <h3 className="text-xl font-medium mb-2">No signals intercepted yet</h3>
          <p className="text-white/50">Explore the Search sector to find tracks you love.</p>
        </div>
      )}
    </div>
  );
}
