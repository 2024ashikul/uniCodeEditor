
const express = require('express')

const path = require('path')
const fs = require('fs');

const archiver = require("archiver");
const router = express.Router();

const serveIndex = require('serve-index');

router.use('/files', express.static(path.join(__dirname, '/files')));

router.use(
  "/uploadedfiles",
  express.static(path.join(process.cwd(), "uploads", "submissions")),
  serveIndex(path.join(process.cwd(), "uploads", "submissions"), { icons: true })
);

router.get("/download/:folder/:filename", (req, res) => {
  const { folder, filename } = req.params; 
  const folderPath = path.join(process.cwd(), "uploads", "submissions", folder, filename);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: "Folder not found" });
  }

  // Set headers so browser downloads instead of displaying
  res.setHeader("Content-Disposition", `attachment; filename=${folder}.zip`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error("Archive error:", err);
    res.status(500).send({ message: "Error creating zip" });
  });

  archive.pipe(res); // Stream zip to response
  archive.directory(folderPath, false); // Add folder contents
  archive.finalize(); // Complete the zip
});

router.get("/download/:folder", (req, res) => {
  const { folder } = req.params; // e.g. "123-45-1694638291023"
  const folderPath = path.join(process.cwd(), "uploads", "submissions", folder);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: "Folder not found" });
  }

  // Set headers so browser downloads instead of displaying
  res.setHeader("Content-Disposition", `attachment; filename=${folder}.zip`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error("Archive error:", err);
    res.status(500).send({ message: "Error creating zip" });
  });

  archive.pipe(res); // Stream zip to response
  archive.directory(folderPath, false); // Add folder contents
  archive.finalize(); // Complete the zip
});


router.use(
  "/profilephotos",
  express.static(path.join(process.cwd(), "uploads", "profile_photos"))
);

router.use('/files', express.static(path.join(__dirname, '/files')));

router.get("/material/download/:folder", (req, res) => {
  const { folder } = req.params; // e.g. "123-45-1694638291023"
  const folderPath = path.join(process.cwd(), "uploads", "materials", folder);

  if (!fs.existsSync(folderPath)) {
    return res.status(404).json({ message: "Folder not found" });
  }

  // Set headers so browser downloads instead of displaying
  res.setHeader("Content-Disposition", `attachment; filename=${folder}.zip`);
  res.setHeader("Content-Type", "application/zip");

  const archive = archiver("zip", { zlib: { level: 9 } });

  archive.on("error", (err) => {
    console.error("Archive error:", err);
    res.status(500).send({ message: "Error creating zip" });
  });

  archive.pipe(res); // Stream zip to response
  archive.directory(folderPath, false); // Add folder contents
  archive.finalize(); // Complete the zip
});

router.use(
  "/materials",
  express.static(path.join(process.cwd(), "uploads", "materials"))
  ,
  serveIndex(path.join(process.cwd(), "uploads", "materials"), { icons: true })
);

module.exports = router;