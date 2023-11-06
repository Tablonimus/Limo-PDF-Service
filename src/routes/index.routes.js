const { Router } = require("express");
const { createPdfFromClient } = require("../controllers/export");
const path = require("path");
const multer = require("multer");
const router = Router();

const { Storage } = require("@google-cloud/storage");

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.originalname.split(".")[0] + "-" + uniqueSuffix + ext);
  },
});
const upload = multer({ storage });

let projectId = "limo-dev-app"; // Get this from Google Cloud
let keyFilename = path.join(
  __dirname,
  `../config/limo-dev-app-d7e50eb2aaf8.json`
); // Get this from Google Cloud -> Credentials -> Service Accounts
const firebaseStorage = new Storage({
  projectId,
  keyFilename,
});
const bucket = firebaseStorage.bucket("limo-dev-app.appspot.com"); // Get this from Google Cloud -> Storage

router.post("/", upload.array("files", 5), async (req, res) => {
  try {
    let files = req.files;

    let outputPaths = [];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(file);
      originalNameTrim = file.originalname.replace(/\s/g, "");

      let outputFilePath = await createPdfFromClient(
        file.path,
        originalNameTrim
      );

      let newPDFPath = path.join(__dirname, `../../${outputFilePath}`);
      console.log(newPDFPath);

      let uploadedResponse = await bucket.upload(newPDFPath);
      outputPaths.push(outputFilePath.replace("temp/", ""));
    }

    return res.status(200).json(outputPaths);
  } catch (error) {
    console.error(error);
  }
});

router.get("/", async (req, res) => {
  try {
    console.log("EN LA RUAT");
    //   await createPdfFromClient();

    res.sendFile();
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
