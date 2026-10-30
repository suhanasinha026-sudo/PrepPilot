const http = require("http");
const { createServer } = require("../EduPrep/serve.js");

const server = createServer();
server.listen(0, async () => {
  const port = server.address().port;
  console.log("Test server running on port " + port);

  const routes = [
    "/",
    "/EduPrep/index.html",
    "/shared/eduprep_scroll_background.css",
    "/shared/eduprep_scroll_background.js",
    "/dashboard",
    "/resources",
    "/practice",
    "/flashcards",
    "/pyqs",
    "/subjects",
    "/study-planner",
    "/profile",
    "/study-ai",
    "/login"
  ];

  let errors = 0;
  for (const r of routes) {
    try {
      const res = await fetch(`http://localhost:${port}${r}`);
      if (res.status !== 200) {
        console.error(`Route ${r} returned status ${res.status}`);
        errors++;
      } else {
        const text = await res.text();
        console.log(`Route ${r} OK (status 200, length: ${text.length})`);
      }
    } catch (err) {
      console.error(`Failed to fetch ${r}:`, err);
      errors++;
    }
  }

  server.close(() => {
    if (errors > 0) {
      console.error(`${errors} route test errors`);
      process.exit(1);
    } else {
      console.log("All route tests PASSED successfully!");
      process.exit(0);
    }
  });
});
