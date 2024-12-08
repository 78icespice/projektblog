import { createApp, upload } from "./config.js";

const app = createApp({
  user: "maelin",
  host: "cloud.bbz",
  database: "maelin",
  password: "fMQpY3ScBPm7GE8RFNhV",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  res.render("start", {});
});

app.get("/new_post", async function (req, res) {
  res.render("new_post", {});
});

app.get("/", async function (req, res) {
  const events = await app.locals.pool.query("select * form events");
  res.render("start", { events: events.rows });
});

app.post("/create_post", upload.single("image"), async function (req, res) {
  const result = await app.locals.pool.query(
    "INSERT INTO todos (text, dateiname) VALUES ($1, $2)",
    [req.body.text, req.file.filename]
  );
  console.log(result);
  res.redirect("/");
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});

app.get("/news", async function (req, res) {
  res.render("news", {});
});
