const express = require("express");
const fs = require("fs");
const path = require("path");
const { generatePortfolio, generatePDF } = require("./generate");

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, "../frontend")));

// Ensure "generated" directory exists
const generatedDir = path.join(__dirname, "generated");
if (!fs.existsSync(generatedDir)) {
  fs.mkdirSync(generatedDir);
}

// ✅ Serve *any* generated portfolio file by name
app.get("/portfolio/:filename", (req, res) => {
  const file = req.params.filename;
  const filePath = path.join(generatedDir, file);

  fs.access(filePath, fs.constants.F_OK, (err) => {
    if (err) {
      res.status(404).send("Portfolio not found");
    } else {
      res.sendFile(filePath);
    }
  });
});

// Portfolio generation
app.post("/generate-portfolio", generatePortfolio);

// PDF generation
app.post("/generate-pdf", async (req, res) => {
  let body = "";
  req.on("data", chunk => { body += chunk.toString(); });
  req.on("end", async () => {
    const parsed = new URLSearchParams(body);
    const json = JSON.parse(parsed.get("data"));

    try {
      const pdfBuffer = await generatePDF(json);

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", "attachment; filename=portfolio.pdf");
      res.send(pdfBuffer);
    } catch (err) {
      console.error("PDF generation error:", err);
      res.status(500).send("Failed to generate PDF");
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
