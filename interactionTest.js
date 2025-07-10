/*
TASK: test interactions with a form and ui elements

- INFO: URL : https://youtube.com/
- Get a screenshot and a blurred screenshot
- Complete and submit the search form with value from cli or env
- INFO: element to select : input : 'input.ytSearchboxComponentInput.yt-searchbox-input.title' and button : '.ytSearchboxComponentSearchButton.ytSearchboxComponentSearchButtonDark'
- screenshot of search results
- output text from firstMatch 'ytd-video-renderer h3 a#video-title'
- click on firstMatch, navigate
- click on dismiss button for login '#dismiss-button'
- wait for and check number of comments `ytd-comments-header-renderer h2`
- screenshot of video playing
*/

import puppeteer from "puppeteer";

const baseScreenshotFolderName =
  process.env.BASE_SCREENSHOT_FOLDER_NAME ?? "./screenshots";
const baseInteractionTestFolderName = `${baseScreenshotFolderName}/interactionTest`;

const defaultSearchTerm = "MrBeast";
const searchTermCLI =
  process.argv.length >= 3 ? process.argv[2] : defaultSearchTerm;
const searchTermENV = process.env.SEARCHTEXT ?? defaultSearchTerm;

const CLASS_SELECTOR =
  "input.ytSearchboxComponentInput.yt-searchbox-input.title";
const VIDEO_TITLE_SELECTOR = "ytd-video-renderer h3 a#video-title";

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

  await page.waitForSelector(CLASS_SELECTOR);
  await page.type(CLASS_SELECTOR, searchTermCLI, { delay: 50 });

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

  await page.waitForSelector(VIDEO_TITLE_SELECTOR);
  await page.screenshot({
    path: `${baseInteractionTestFolderName}/firstVideoSuggestion.jpg`,
  });

  const firstMatch = await page.$eval(VIDEO_TITLE_SELECTOR, (elem) => {
    return elem.innerText;
  });

  console.log({ firstMatch });

  await Promise.all([
    page.waitForNavigation(),
    page.click(VIDEO_TITLE_SELECTOR),
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

  await page.close();
  await browser.close();
})();
