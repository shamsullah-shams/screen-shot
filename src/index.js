const express = require("express");
const puppeteer = require("puppeteer");
const cors = require("cors");
const fs = require("fs");
require("dotenv").config();
require("dotenv").config();

const PORT = process.env.PORT || 8080;

const app = express();
app.use(cors());

app.get("/generate-pdf", async (req, res) => {
  const browser = await puppeteer.launch({
    headless: "new",
  });
  const page = await browser.newPage();

  try {
    await page.goto("https://www.ebay.de/itm/203511710042", {
      waitUntil: "networkidle2",
    });

    // Use createPdfStream to obtain a readable stream of the PDF content
    const pdfStream = await page.createPDFStream({ format: "A4" });

    // Pipe the PDF stream to a file stream (you can also pipe it to the response directly)
    const fileStream = fs.createWriteStream("newss.pdf");
    pdfStream.pipe(fileStream);

    // Wait for the stream to finish writing
    await new Promise((resolve) => pdfStream.on("end", resolve));

    await browser.close();

    console.log("PDF saved successfully.");
    return res.download("newss.pdf");
  } catch (error) {
    console.error("Error:", error);
    await browser.close();
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT);
