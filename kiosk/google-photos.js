import fs from "fs/promises";
import path from "path";

// Source https://github.com/balenablocks/photo-gallery/blob/master/server.js
export async function fetchImages(albumURL, width = 800) {
  console.log("Fetching images...");

  const hostname = getHostName(albumURL);

  // Google Photos
  if (!["photos.app.goo.gl", "goo.gl"].includes(hostname)) {
    throw new Error("Invalid album URL");
  }

  let photos = [];

  // Parse photos
  const rx =
    /\["(https:\/\/[^\.]+.googleusercontent\.com\/[^"]+)",([0-9]+),([0-9]+)[,\]]/;

  const extractPhotos = (data) =>
    data
      .match(new RegExp(rx, "g"))
      .map((m) => m.match(rx))
      .map((p) => {
        // const width = +p[2];
        // const height = +p[3];
        // const url = `${p[1]}=w${width}-h${height}-no`;
        const name = p[1].split("/").pop();
        return { url: `${p[1]}=w${width}`, name }; // Change here to increase/decrease image width-size
      });

  const response = await fetch(albumURL);
  // Fetch and remove duplicate images
  if (response.status !== 200) {
    throw new Error("📷 - Google Photos: Could not fetch album.");
  }
  const data = await response.text();
  photos = extractPhotos(data);
  // photos = [...new Set(photos)]; // save only unique values

  console.log("Found " + photos.length + " images.");

  return photos;
}

export async function updateImages(images, downloadLocation) {
  console.log("Downloading images...");

  let removed = 0;
  // Remove images that are no longer in the album
  const files = await fs.readdir(downloadLocation);
  for (const file of files) {
    if (!images.find((image) => image.name === file)) {
      await fs.unlink(path.join(downloadLocation, file));
    }
  }

  let alreadyExists = 0;
  let downloaded = 0;
  let errored = 0;

  for (const image of images) {
    // check if it already exists
    try {
      await fs.access(path.join(downloadLocation, image.name));
      alreadyExists++;
      continue;
    } catch (error) {
      downloaded++;

      // download image
      const response = await fetch(image.url);
      if (response.status !== 200) {
        errored++;
        continue;
      }
      const buffer = Buffer.from(await response.arrayBuffer());
      await fs.writeFile(
        path.join(downloadLocation, image.name),
        buffer,
        "binary"
      );
    }
  }
  console.log("Removed: " + removed);
  console.log("Already exists: " + alreadyExists);
  console.log("Downloaded: " + downloaded);
  console.log("Errored: " + errored);
}

/**
 * From a given URL, gets the hostname
 * @param {String} url Website url.
 */
function getHostName(url) {
  const match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    return match[2];
  } else {
    return null;
  }
}
