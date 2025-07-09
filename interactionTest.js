/*
TASK: test interactions with a form and ui elements

https://youtube.com/
TASK: Get a screenshot and a blurred screenshot
TASK: Complete and submit the search form with value from cli or env
'#search-input #search' and '#search-icon-legacy'
TASK: screenshot of search results
TASK: output text from firstMatch 'ytd-video-renderer h3 a#video-title'
TASK: click on firstMatch, navigate
TASK: click on dismiss button for login '#dismiss-button'
TASK: wait for and check number of comments `ytd-comments-header-renderer h2`
TASK: screenshot of video playing
*/

import puppeteer from "puppeteer";

const baseScreenshotFolderName =
  process.env.BASESCREENSHOTFOLDERNAME ?? "./screenshots";
const baseInteractionTestFolderName = `${baseScreenshotFolderName}/interactionTest`;

const defaultSearchTerm = "MrBeast";
const searchTermCLI =
  process.argv.length >= 3 ? process.argv[2] : defaultSearchTerm;
const searchTermENV = process.env.SEARCHTEXT ?? defaultSearchTerm;

async function sleep(time) {
  return new Promise((resolve) => {
    console.log(`Sleeping for ${time} ms`);
    setTimeout(resolve, time);
  });
}

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
    path: `${baseInteractionTestFolderName}/homePageBlurred.jpg`,
  });
  await page.emulateVisionDeficiency("none");
  await page.screenshot({
    path: `${baseInteractionTestFolderName}/homePageNomal.jpg`,
  });

  await Promise.all([
    page.waitForNavigation(),
    page.click(
      ".ytSearchboxComponentSearchButton.ytSearchboxComponentSearchButtonDark"
    ),
  ]);

  await page.waitForSelector("ytd-video-renderer h3 a#video-title");
  await page.screenshot({
    path: `${baseInteractionTestFolderName}/firstVideoSuggestion.jpg`,
  });

  const firstMatch = await page.$eval(
    "ytd-video-renderer h3 a#video-title",
    (elem) => {
      return elem.innerText;
    }
  );

  console.log({ firstMatch });

  await Promise.all([
    page.waitForNavigation(),
    page.click("ytd-video-renderer h3 a#video-title"),
    sleep(25000),
  ]);
  await page.screenshot({
    path: `${baseInteractionTestFolderName}/first-video.jpg`,
  });
  await page.waitForSelector("ytd-comments-header-renderer");
  const videoComments = await page.$eval(
    "ytd-comments-header-renderer h2",
    (h2) => {
      return h2.innerText;
    }
  );
  console.log({ videoComments });

  await browser.close();
})();
