import { create } from 'zustand';

export const usePlayerStore = create((set) => ({
  currentTrack: null,
  isPlaying: false,
  queue: [],
  queueIndex: -1,
  volume: 1,

  play: (track) => set((state) => ({
    currentTrack: track,
    isPlaying: true,
    queue: [track],
    queueIndex: 0
  })),

  togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),
  
  setVolume: (volume) => set({ volume }),

  nextTrack: () => set((state) => {
    if (state.queueIndex < state.queue.length - 1) {
      const nextIndex = state.queueIndex + 1;
      return {
        currentTrack: state.queue[nextIndex],
        queueIndex: nextIndex,
        isPlaying: true
      };
    }
    return state;
  }),

  prevTrack: () => set((state) => {
    if (state.queueIndex > 0) {
      const prevIndex = state.queueIndex - 1;
      return {
        currentTrack: state.queue[prevIndex],
        queueIndex: prevIndex,
        isPlaying: true
      };
    }
    return state;
  }),

  setQueue: (tracks, index = 0) => set({ 
    queue: tracks, 
    queueIndex: index,
    currentTrack: tracks[index] || null,
    isPlaying: true
  }),

  addToQueue: (track) => set((state) => ({
    queue: [...state.queue, track]
  })),
}));
