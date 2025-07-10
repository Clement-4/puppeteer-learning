/*
TASK: 
- INFO: URL  https://www.algonquincollege.com/ then take screenshot
- Get screenshots full and partial
- Get content from HTML
- Fill out search input with "Mobile"
- Wait for results then take screenshot
- Find rows where tr class is "odd" or "even"
- Save td[1] td[2] td[3] and td[5] with program title and length and area
- Create JSON file with list of product content
- save json file with fs.writeFile(filename, (err)=>{});
*/

import puppeteer from "puppeteer-extra";
import StealthPlugin from "puppeteer-extra-plugin-stealth";
import { writeIntoFile } from "./utils/fileOperations.js";

puppeteer.use(StealthPlugin());

const keyToSearch = "Mobile";
const pageUrl = "https://www.algonquincollege.com/";
const baseScreenshotFolderName =
  process.env.BASESCREENSHOTFOLDERNAME ?? "./screenshots";
const fileToWrite = "./data/courseDetails.json";

const inputSelector = "input#programSearch";
const buttonSelector = "button.programSearchButton";
const courseTableListSelector = "table.programFilterList tbody tr";

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.goto(pageUrl);
  await page.screenshot({
    path: `${baseScreenshotFolderName}/scrape/fullPage.jpg`,
    fullPage: true,
  });

  const content = await page.content();
  console.log(`web page content length : ${content.length}`);

  const button = await page.waitForSelector(buttonSelector);
  await page.type(inputSelector, keyToSearch, { delay: 100 });
  await button.click();

  await page.waitForNavigation({ waitUntil: "load" });
  await page.waitForSelector("table.programFilterList");
  await page.screenshot({
    path: `${baseScreenshotFolderName}/scrape/coursePage.jpg`,
    fullPage: true,
  });

  const data = await page.$$eval(courseTableListSelector, (rows) => {
    return rows
      .map((row) => {
        if (row.classList.contains("odd") || row.classList.contains("even")) {
          const tds = row.querySelectorAll("td");
          return {
            name: tds[1].innerText,
            area: tds[2].innerText,
            campus: tds[3].innerText,
            length: tds[5].innerText,
          };
        } else {
          return null;
        }
      })
      .filter((row) => row);
  });

  writeIntoFile(fileToWrite, data);

  await page.close();
  await browser.close();
})();
