const JAMENDO_CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID || '56d30c95'; // Replace with a more permanent one if given, this is a known public ID for testing
const API_BASE = 'https://api.jamendo.com/v3.0';

export async function fetchTrendingTracks(limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&order=popularity_week`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error fetching trending tracks:", error);
    return [];
  }
}

export async function searchTracks(query, limit = 20) {
  try {
    const res = await fetch(`${API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${limit}&search=${encodeURIComponent(query)}`);
    const data = await res.json();
    return data.results || [];
  } catch (error) {
    console.error("Error searching tracks:", error);
    return [];
  }
}

export async function getTrackById(id) {
  try {
    const res = await fetch(`${API_BASE}/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&id=${id}`);
    const data = await res.json();
    return data.results?.[0] || null;
  } catch (error) {
    console.error("Error fetching track:", error);
    return null;
  }
}
