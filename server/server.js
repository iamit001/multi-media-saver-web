const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");

const app = express();
const path = require("path");

app.use(express.static(path.join(__dirname, "../client/build")));

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../client/build/index.html"));
});

app.use(cors());
app.use(express.json());

app.post("/extract", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    const html = response.data;

    const $ = cheerio.load(html);
    let media = [];

    // Extract images
    $("img").each((i, el) => {
      let src = $(el).attr("src");

      if (src) {
        // Fix relative URLs
        if (!src.startsWith("http")) {
          src = new URL(src, url).href;
        }

        media.push({ type: "image", src });
      }
    });

    // Extract videos
    $("video, video source").each((i, el) => {
      let src = $(el).attr("src");

      if (src) {
        if (!src.startsWith("http")) {
          src = new URL(src, url).href;
        }

        media.push({ type: "video", src });
      }
    });

    res.json({ success: true, media });

  } catch (err) {
    console.error(err.message);
    res.json({ success: false, media: [] });
  }
});

app.listen(3001, () => {
  console.log("Server running on http://localhost:3001");
});