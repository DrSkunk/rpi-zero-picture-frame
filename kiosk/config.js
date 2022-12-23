export default {
  width: process.env.WIDTH || 800,
  albumUrl: process.env.ALBUM_URL || "https://goo.gl/photos/XQ2sGUyPe3swFVga6",
  cron: process.env.CRON || "0 0 * * *",
  downloadLocation: process.env.DOWNLOAD_LOCATION || "./photos",
};
