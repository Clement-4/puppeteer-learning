/*
TASK: 
- Get screenshots full and partial
- Get content from HTML
- Search on https://www.algonquincollege.com/ then take screenshot
- Fill out search input with "Mobile"
- Wait for results then take screenshot
- Find rows where tr class is "odd" or "even"
- Save td[1] td[2] td[3] and td[5] with program title and length and area
- Create JSON file with list of product content
- save json file with fs.writeFile(filename, (err)=>{});
*/

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
puppeteer.use(StealthPlugin());

const keyToSearch = "Mobile";
const pageUrl = "https://www.algonquincollege.com/";

const baseScreenshotFolderName =
  process.env.BASESCREENSHOTFOLDERNAME ?? "./screenshots";

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(pageUrl);
  await page.screenshot({
    path: `${baseScreenshotFolderName}/scrape/fullPage.jpg`,
    fullPage: true,
  });

  const button = await page.waitForSelector("button.programSearchButton");
  await page.type("input#programSearch", keyToSearch, { delay: 100 });
  await button.click();

  await page.waitForNavigation({ waitUntil: "load" });
  await page.waitForSelector("table.programFilterList");
  await page.screenshot({
    path: `${baseScreenshotFolderName}/scrape/coursePage.jpg`,
    fullPage: true,
  });

  await page.close();
  await browser.close();
})();
