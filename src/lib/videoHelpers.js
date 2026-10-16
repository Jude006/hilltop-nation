export const getYouTubeId = (url) => {
  if (!url) return null;
  const patterns = [
    /youtube\.com\/watch\?v=([^&]+)/,
    /youtu\.be\/([^?]+)/,
    /youtube\.com\/embed\/([^?]+)/,
  ];
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match && match[1]) return match[1];
  }
  return null;
};

export const isDirectVideo = (url) =>
  Boolean(url && (url.match(/\.(mp4|webm|ogg|mov)$/i) || url.includes("cloudinary")));

// Resolves the best available thumbnail for a sermon without needing the
// backend to store one: uses an explicit sermon.thumbnail if present,
// falls back to YouTube's own thumbnail CDN, falls back to using the raw
// video element (browsers show its first loaded frame), and finally a
// plain dark card if none of those apply.
export const getThumbnail = (sermon) => {
  const url = sermon?.videoUrl || sermon?.link;
  if (sermon?.thumbnail) return { type: "image", src: sermon.thumbnail };

  const ytId = getYouTubeId(url);
  if (ytId) return { type: "image", src: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` };

  if (isDirectVideo(url)) return { type: "video", src: url };

  return { type: "none" };
};

export const formatSermonDate = (date) =>
  date
    ? new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Recent";