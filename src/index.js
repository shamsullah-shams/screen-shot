const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const Model = require("./model");
const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// static routes
app.use(express.static(path.join(__dirname, "public", "build")));

// root route
app.use("/", (req, res, next) => {
  console.log(path.join(__dirname, "public", "build", "index.html"));
  res.sendFile(path.join(__dirname, "public", "build", "index.html"));
});

app.post("/generate-pdf", async (req, res) => {
  const url = req.body.url;
  const type = req.body.type;
  const visitorId = req.body.visitorId;
  const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
  if (!url || !urlRegex.test(url)) {
    return res.status(400).send({ message: "Invalid URL address" });
  }

  if (!type || (type !== "pdf" && type !== "image")) {
    return res.status(400).send({ message: "Invalid file type" });
  }

  try {
    const result = await Model.findOne({ visitorId });
    if (result && result.option >= 3) {
      return res.status(400).send({ message: "You have tried 3 times" });
    } else if (result) {
      result.option = result.option + 1;
      await result.save();
    } else if (!result) {
      const object = new Model({ visitorId: visitorId, option: 1 });
      await object.save();
    }
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: error?.message || "Internal server error" });
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

mongoose.connect(
  "mongodb://127.0.0.1:27017/shot",
  { useCreateIndex: true, useNewUrlParser: true, useUnifiedTopology: true },
  (error) => {
    console.log({ error });
    app.listen(PORT);
  }
);
