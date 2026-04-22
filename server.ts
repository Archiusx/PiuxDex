import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // Global Shared Clipboard State
  let globalClipboard = {
    content: "",
    lastUpdated: Date.now(),
    updatedBy: "System"
  };

  // API Routes
  app.get("/api/clipboard", (req, res) => {
    res.json(globalClipboard);
  });

  app.post("/api/clipboard", (req, res) => {
    const { content, user } = req.body;
    if (typeof content === 'string') {
      globalClipboard = {
        content: content.substring(0, 10000), // Cap at 10k chars
        lastUpdated: Date.now(),
        updatedBy: user || "Anonymous"
      };
      res.json({ success: true, ...globalClipboard });
    } else {
      res.status(400).json({ error: "Invalid content" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
