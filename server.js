// server.js
const { createServer } = require("http");
const next = require("next");

const dev = false;
const app = next({ dev });
const handle = app.getRequestHandler();

// cPanel Passenger sets PORT for you; fall back to 3000 locally
const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

app.prepare().then(() => {
  createServer((req, res) => handle(req, res)).listen(PORT, HOST, () => {
    console.log(`Next.js ready on http://${HOST}:${PORT}`);
  });
});
