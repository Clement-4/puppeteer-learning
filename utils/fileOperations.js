import { existsSync, mkdirSync, writeFile } from "fs";

export function createFolder(folderName) {
  if (!existsSync(folderName)) {
    mkdirSync(folderName, { recursive: true });
  }
}

export function writeIntoFile(fileName, data) {
  writeFile(fileName, JSON.stringify(data), "utf-8", (err) => {
    if (err) {
      console.log(
        `Error happened while writing into file with code : ${err.code} \n message : ${err.message},`
      );
    }
    console.log("Saved data onto the file");
  });
}
