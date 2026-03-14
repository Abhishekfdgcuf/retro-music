import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Play, Heart } from "lucide-react";
import { fetchTrendingTracks } from "../lib/jamendo";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../lib/supabase";

export function Home() {
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [likedTracks, setLikedTracks] = useState(new Set());
  const { play, currentTrack, isPlaying } = usePlayerStore();
  const { user } = useAuthStore();

  useEffect(() => {
    async function loadTracks() {
      const data = await fetchTrendingTracks(12);
      setTracks(data);
      setLoading(false);
    }
    loadTracks();
  }, []);

  useEffect(() => {
    async function loadLikedTracks() {
      if (!user) return;
      const { data, error } = await supabase
        .from('liked_songs')
        .select('song_id')
        .eq('user_id', user.uid);
      if (!error && data) {
        setLikedTracks(new Set(data.map(item => item.song_id)));
      }
    }
    loadLikedTracks();
  }, [user]);

  const handlePlay = (track) => {
    play(track);
  };

  const handleLike = async (track) => {
    if (!user) return;
    const isLiked = likedTracks.has(track.id);
    if (isLiked) {
      // Unlike
      await supabase
        .from('liked_songs')
        .delete()
        .eq('user_id', user.uid)
        .eq('song_id', track.id);
      setLikedTracks(prev => {
        const newSet = new Set(prev);
        newSet.delete(track.id);
        return newSet;
      });
    } else {
      // Like
      await supabase
        .from('liked_songs')
        .insert({
          user_id: user.uid,
          song_id: track.id,
          song_data: track,
          liked_at: new Date().toISOString()
        });
      setLikedTracks(prev => new Set(prev).add(track.id));
    }
  };

  return (
    <div className="space-y-12 pb-24">
      {/* Hero Section */}
      <section className="relative rounded-3xl overflow-hidden min-h-[400px] flex items-end p-12 mt-4 group">
        <div className="absolute inset-0 bg-gradient-to-t from-[#050510] via-[#050510]/60 to-transparent z-10" />
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop')] bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-1000" />
        <div className="absolute inset-0 bg-purple-900/40 mix-blend-color z-0" />
        
        <div className="relative z-20 max-w-2xl space-y-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <span className="px-4 py-1.5 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold tracking-widest uppercase text-white shadow-[0_0_20px_rgba(255,255,255,0.1)]">
              Trending Now
            </span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-6xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white via-white/90 to-white/40 tracking-tighter"
          >
            Cosmic <br /> Frequencies
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg text-white/60 max-w-lg leading-relaxed"
          >
            Immerse yourself in zero-gravity soundscapes. Your endless musical universe awaits.
          </motion.p>
        </div>
      </section>

      {/* Trending Grid */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Top Dimensions</h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="aspect-square bg-white/5 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {tracks.map((track, i) => (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.05 }}
                className="group relative"
              >
                <div className="aspect-square rounded-2xl overflow-hidden relative shadow-[0_8px_30px_rgb(0,0,0,0.5)] bg-white/5 border border-white/10 group-hover:border-purple-500/50 transition-colors duration-500">
                  <img
                    src={track.image}
                    alt={track.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <button
                      onClick={() => handlePlay(track)}
                      className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white hover:scale-110 hover:bg-white hover:text-black transition-all shadow-[0_0_30px_rgba(255,255,255,0.3)]"
                    >
                      <Play className="w-6 h-6 fill-current ml-1" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLike(track); }}
                    className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Heart className={`w-4 h-4 ${likedTracks.has(track.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                  {currentTrack?.id === track.id && isPlaying && (
                     <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-purple-500/80 backdrop-blur flex items-center justify-center animate-pulse shadow-[0_0_15px_rgba(168,85,247,0.8)]">
                        <div className="w-2 h-2 rounded-full bg-white" />
                     </div>
                  )}
                </div>
                <div className="mt-4">
                  <h3 className="text-white font-medium text-sm truncate group-hover:text-purple-400 transition-colors">{track.name}</h3>
                  <p className="text-white/50 text-xs truncate mt-1">{track.artist_name}</p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
