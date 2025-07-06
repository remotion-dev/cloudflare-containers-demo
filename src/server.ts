import { renderMedia, selectComposition } from "@remotion/renderer";
import express from "express";
import fs from "fs/promises";
import path from "path";

const app = express();
app.use(express.json());
const port = process.env.PORT || 8080;

app.post("/render", async (req, res) => {
  const { compositionId, inputProps } = req.body;
  const outputLocation = path.join("/tmp", `out-${Date.now()}.mp4`);

  try {
    if (!compositionId) {
      res.status(400).send({ message: "`compositionId` is required." });
      return;
    }

    const composition = await selectComposition({
      serveUrl: "./build",
      id: compositionId,
      inputProps,
    });
    console.log("Starting render...");
    await renderMedia({
      composition,
      inputProps,
      codec: "h264",
      outputLocation,
      serveUrl: "./build",
    });
    console.log("Render finished.");
    const fileBuffer = await fs.readFile(outputLocation);
    res.status(200).send(fileBuffer);
  } catch (err) {
    console.error(err);
    res.status(500).send({
      message: "Error rendering video.",
      error: (err as Error).stack,
    });
  } finally {
    // Clean up the temporary file from the container's filesystem
    if (await fs.stat(outputLocation).catch(() => null)) {
      await fs.unlink(outputLocation);
    }
  }
});
app.listen(port, (err) => {
  if (err) {
    console.error(err);
    process.exit(1);
  }
  console.log(`Renderer server listening on port ${port}`);
});
