import { useState, useEffect } from "react";
import { Search as SearchIcon, Play, Heart } from "lucide-react";
import { searchTracks } from "../lib/jamendo";
import { usePlayerStore } from "../store/usePlayerStore";
import { useAuthStore } from "../store/useAuthStore";
import { supabase } from "../lib/supabase";

export function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [likedTracks, setLikedTracks] = useState(new Set());
  const { play } = usePlayerStore();
  const { user } = useAuthStore();

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

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setIsSearching(true);
    const data = await searchTracks(query, 20);
    setResults(data);
    setIsSearching(false);
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
    <div className="space-y-8 pb-24">
      <div className="sticky top-0 z-30 pt-4 pb-4 bg-[#050510]/80 backdrop-blur-xl">
        <form onSubmit={handleSearch} className="relative max-w-2xl group">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <SearchIcon className="h-6 w-6 text-white/40 group-focus-within:text-purple-400 transition-colors" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 text-white text-lg rounded-full focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500 block pl-14 p-4 hover:bg-white/10 transition-colors shadow-[0_0_30px_rgba(0,0,0,0.5)] placeholder:text-white/30"
            placeholder="Search for floating melodies, artists, or cosmic beats..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500/20 to-blue-500/20 blur opacity-0 group-focus-within:opacity-100 transition-opacity -z-10" />
        </form>
      </div>

      <div className="space-y-4">
        {isSearching ? (
           <div className="flex justify-center py-20">
              <div className="w-12 h-12 rounded-full border-2 border-white/20 border-t-purple-500 animate-spin" />
           </div>
        ) : results.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4">
            {results.map((track) => (
              <div
                key={track.id}
                className="flex items-center gap-4 bg-white/5 border border-white/5 hover:bg-white/10 hover:border-purple-500/30 p-3 rounded-2xl transition-all group"
              >
                <div className="relative w-16 h-16 rounded-xl overflow-hidden flex-shrink-0">
                  <img src={track.image} alt={track.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button
                      onClick={() => play(track)}
                      className="w-10 h-10 rounded-full bg-white text-black flex items-center justify-center hover:scale-105 transition-transform"
                    >
                      <Play className="w-5 h-5 fill-current ml-1" />
                    </button>
                  </div>
                  <button
                    onClick={(e) => { e.stopPropagation(); handleLike(track); }}
                    className="absolute top-1 right-1 w-6 h-6 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center border border-white/20 text-white hover:scale-110 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <Heart className={`w-3 h-3 ${likedTracks.has(track.id) ? 'fill-red-500 text-red-500' : 'text-white'}`} />
                  </button>
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="text-white font-medium truncate group-hover:text-purple-300 transition-colors">{track.name}</h4>
                  <p className="text-white/50 text-sm truncate">{track.artist_name}</p>
                </div>
              </div>
            ))}
          </div>
        ) : query && !isSearching ? (
          <div className="text-center text-white/50 py-20 text-lg">
            No signals found in this quadrant of the galaxy.
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 opacity-60">
             {/* Decorative placeholder categories when not searching */}
             {['Ambient', 'Synthwave', 'Zero-G LoFi', 'Deep Space Techno'].map(genre => (
               <div key={genre} className="aspect-video rounded-2xl bg-gradient-to-br from-white/10 to-white/5 border border-white/10 flex items-center justify-center overflow-hidden relative group cursor-pointer hover:border-white/30 transition-colors">
                  <span className="font-bold tracking-wide z-10">{genre}</span>
                  <div className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               </div>
             ))}
          </div>
        )}
      </div>
    </div>
  );
}
