import puppeteer from "puppeteer";
import { createFolder } from "./utils/fileOperations";

//INFO: It is invoked immediately, so it can be ifee, go check the api for more reference

const baseScreenshotFolderName =
  process.env.BASESCREENSHOTFOLDERNAME ?? "./screenshots";

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  //INFO: browser pre setting
  await page.setViewport({
    width: 1600,
    height: 1000,
    isMobile: false,
    isLandscape: true,
    hasTouch: false,
    deviceScaleFactor: 1,
  });
  await page.setGeolocation({ latitude: 49.5, longitude: 100.0 });

  await page.goto("https://chapters.indigo.ca/");

  const url = page.url();
  console.log(`URL: ${url}`);
  const content = await page.content();
  console.log(`Page content length: ${content.length}`);

  try {
    createFolder(baseScreenshotFolderName);
    await page.screenshot({
      path: `${baseScreenshotFolderName}/fullPageScreenshot.jpg`,
      fullPage: true,
    });
    await page.screenshot({
      path: `${baseScreenshotFolderName}/customScreenshot.jpg`,
      clip: { x: 200, y: 200, width: 500, height: 500 },
      encoding: "binary",
      type: "jpeg",
    });
  } catch (err) {
    console.error(`Error during screenshot or folder creation: ${err.message}`);
  } finally {
    await page.close();
    await browser.close();
  }
})();
