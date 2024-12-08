import { createApp, upload } from "./config.js";

const app = createApp({
  user: "linmae",
  host: "bbz.cloud",
  database: "linmae",
  password: "fMQpY3ScBPm7GE8RFNhV",
  port: 30211,
});

/* Startseite */
app.get("/", async function (req, res) {
  const photos = await app.locals.pool.query("select * from photos");
  res.render("start", { photos: photos.rows });
});

app.get("/impressum", async function (req, res) {
  res.render("impressum", {});
});

app.post("/new_post", upload.single("image"), async function (req, res) {
  await app.locals.pool.query("INSERT INTO photos (image) VALUES ($1)", [
    req.body.image,
  ]);
  res.redirect("/");
});

app.get("/new_post", async function (req, res) {
  res.render("new_post", {});
});

app.post("/likes/:id", async function (req, res) {
  const user = await login.loggedInUser(req);
  if (!user) {
    res.redirect("/login");
    return;
  }
  await app.locals.pool.query(
    "INSERT INTO likes (user_id, photo_id) VALUES ($1, $2)",
    [req.params.id, user.id]
  );
  res.redirect("/");
});

app.get("/events/:id", async function (req, res) {
  const event = await app.locals.pool.query(
    "SELECT * FROM likes WHERE id = $1",
    [req.params.id]
  );
  const likes = await app.locals.pool.query(
    "SELECT COUNT(user_id) FROM likes WHERE photo_id = $1",
    [req.params.id]
  );
  res.render("details", { event: event.rows[0], likes: likes.rows[0] });
});

/* Wichtig! Diese Zeilen müssen immer am Schluss der Website stehen! */
app.listen(3010, () => {
  console.log(`Example app listening at http://localhost:3010`);
});
