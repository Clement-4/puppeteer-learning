/*
TASK: test interactions with a form and ui elements

https://youtube.com/
TODO: Get a screenshot and a blurred screenshot
TODO: Complete and submit the search form with value from cli or env
'#search-input #search' and '#search-icon-legacy'
TODO: screenshot of search results
TODO: output text from firstMatch 'ytd-video-renderer h3 a#video-title'
TODO: click on firstMatch, navigate
TODO: click on dismiss button for login '#dismiss-button'
TODO: wait for and check number of comments `ytd-comments-header-renderer h2`
TODO: screenshot of video playing
TODO: get text for first suggested 'ytd-compact-video-renderer'
TODO: output comment count and first suggested video title
*/

import puppeteer from "puppeteer";

const baseScreenshotFolderName =
  process.env.BASESCREENSHOTFOLDERNAME ?? "./screenshots";

const defaultSearchTerm = "MrBeast";
const searchTermCLI =
  process.argv.length >= 3 ? process.argv[2] : defaultSearchTerm;
const searchTermENV = process.env.SEARCHTEXT ?? defaultSearchTerm;

(async function () {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  await page.setViewport({
    width: 1600,
    height: 1000,
    isMobile: false,
    isLandscape: true,
    hasTouch: false,
    deviceScaleFactor: 1,
  });

  await page.goto("https://www.youtube.com/");

  const classSelector =
    "input.ytSearchboxComponentInput.yt-searchbox-input.title";

  await page.waitForSelector(classSelector);
  await page.type(classSelector, searchTermCLI, { delay: 50 });

  await page.emulateVisionDeficiency("blurredVision");
  await page.screenshot({
    path: `${baseScreenshotFolderName}/interactionTest/homePageBlurred.jpg`,
  });
  await page.emulateVisionDeficiency("none");
  await page.screenshot({
    path: `${baseScreenshotFolderName}/interactionTest/homePageNomal.jpg`,
  });

  await browser.close();
})();
