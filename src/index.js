const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
require("dotenv").config();
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded());

app.post("/generate-pdf", async (req, res) => {
  const url = req.body.url;
  const type = req.body.type;
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  console.log(type);
  if (!url || !urlRegex.test(url)) {
    return res.status(400).send({ message: "Invalid URL address" });
  }

  if (!type || (type !== "pdf" && type !== "image")) {
    return res.status(400).send({ message: "Invalid file type" });
  }

  // create pdf or image
  const browser = await puppeteer.launch({ headless: "new" });
  const page = await browser.newPage();

  await page.goto(url, { waitUntil: "networkidle0" });

  if (type === "image") {
    await page.setViewport({ width: 1280, height: 720 });
    await page.screenshot({
      path: "screenshot.jpg",
    });
    // download screen shot
    res.download("screenshot.jpg");
  } else if (type === "pdf") {
    await page.emulateMediaType("screen");
    await page.pdf({
      path: "result.pdf",
      margin: { top: "100px", right: "50px", bottom: "100px", left: "50px" },
      printBackground: true,
      format: "A3",
    });
    // download pdf
    res.download("result.pdf");
  }
});

app.listen(PORT);
