import fs from "fs/promises";
import cron from "node-cron";
import cronstrue from "cronstrue";
import { fetchImages, updateImages } from "./google-photos.js";
import config from "./config.js";
import FEH from "./feh.js";

const feh = new FEH(config.downloadLocation);

async function update() {
  try {
    await fs.access(config.downloadLocation);
  } catch (error) {
    console.log(error);
    await fs.mkdir(config.downloadLocation);
  }
  const images = await fetchImages(config.albumUrl, config.width);
  await updateImages(images, config.downloadLocation);
}

try {
  await update();
  feh.start();
} catch (error) {
  console.error(error);
}

console.log("Running cron: " + config.cron);
console.log("Cron description: " + cronstrue.toString(config.cron));
cron.schedule(config.cron, update);
