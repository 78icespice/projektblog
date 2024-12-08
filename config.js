import express from "express";
import { engine } from "express-handlebars";
import pg from "pg";
const { Pool } = pg;
import cookieParser from "cookie-parser";
import multer from "multer";
const upload = multer({ dest: "public/uploads/" });
import sessions from "express-session";
import bbz307 from "bbz307";

export function createApp(dbconfig) {
  const app = express();

  const pool = new Pool(dbconfig);
  const login = new bbz307.Login(
    "users",
    ["benutzername", "passwort" "profilbild"],
    pool
  );

  app.engine("handlebars", engine());
  app.set("view engine", "handlebars");
  app.set("views", "./views");

  app.use(express.static("public"));
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.use(
    sessions({
      secret: "thisismysecrctekeyfhrgfgrfrty84fwir767",
      saveUninitialized: true,
      cookie: { maxAge: 86400000, secure: false },
      resave: false,
    })
  );

  app.get("/register", (req, res) => {
    res.render("register");
  });

  app.post("/register", upload.none(), async (req, res) => {
    const user = await login.registerUser(req);
    if (user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/register");
      return;
    }
  });

  app.get("/login", (req, res) => {
    res.render("login");
  });

  app.post("/login", upload.none(), async (req, res) => {
    const user = await login.loginUser(req);
    if (!user) {
      res.redirect("/login");
      return;
    } else {
      res.redirect("/intern");
      return;
    }
  });

  app.get("/event_formular", function (req, res) {
    res.render("event_formular");
  });

  app.post("/event", upload.none(), async function (req, res) {
    await pool.query(
      "INSERT INTO events (event_name, description) VALUES ($1, $2)",
      [req.body.event_name, req.body.description]
    );
    res.redirect("/");
  });

  app.post("/event", upload.none(), async function (req, res) {
    const user = await login.loggedInUser(req);
    await pool.query(
      "INSERT INTO event (event_name, description) VALUES ($1, $2, $3)",
      [req.body.event_name, req.body.description, user.id]
    );
    res.redirect("/");
  });

  app.locals.pool = pool;

  return app;
}

export { upload };
