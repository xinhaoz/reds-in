const { createServer } = require("http");
const { parse } = require("url");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "0.0.0.0";
const port = parseInt(process.env.PORT || "3000", 10);

console.log(`Starting server in ${dev ? "development" : "production"} mode`);
console.log(`Hostname: ${hostname}, Port: ${port}`);

const app = next({ dev });
const handle = app.getRequestHandler();

console.log("Preparing Next.js app...");
app
  .prepare()
  .then(() => {
    console.log("Next.js app prepared successfully");
    const httpServer = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error("Error occurred handling", req.url, err);
        res.statusCode = 500;
        res.end("internal server error");
      }
    });

    const io = new Server(httpServer, {
      path: "/api/socket",
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    console.log("Setting up Socket.IO server...");
    const setupSocketServer = require("./src/lib/socketServer");
    setupSocketServer(io);

    console.log("Starting HTTP server...");
    httpServer
      .once("error", (err) => {
        console.error(err);
        process.exit(1);
      })
      .listen(port, hostname, () => {
        console.log(`> Ready on http://${hostname}:${port}`);
      });
  })
  .catch((err) => {
    console.error("Failed to start server:", err);
    process.exit(1);
  });
