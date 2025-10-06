const { app, initDB } = require("./app");

(async () => {
  await initDB(); // initialize DB before server start
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
})();
