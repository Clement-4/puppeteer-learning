import puppeteer from "puppeteer";
import fs from "fs";

//INFO: It is invoked immediately, so it can be ifee, go check the api for more reference

async function sleep(time) {
  return new Promise((resolve) => {
    console.log(`Sleeping for ${time} ms`);
    setTimeout(resolve, time);
  });
}

function createFolder(folderName) {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName, { recursive: true });
  }
}

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.goto("https://chapters.indigo.ca/");

  const url = page.url();
  console.log(`URL: ${url}`);
  const content = await page.content();
  console.log(`Page content length: ${content.length}`);

  const baseScreenshotFolderName = "./screenshots";

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
    await browser.close();
  }
})();
