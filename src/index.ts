import express from "express";
import session from "express-session";
import "dotenv/config";
import path from "path";

import userRoutes from "./routers/userRoutes";
import roleRoutes from "./routers/roleRoutes";
import permissionRoutes from "./routers/permissionRoutes";

const app = express();

app.set("view engine", "ejs");
app.set("views", path.join(process.cwd(), "src/views"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

app.use(
  session({
    secret: "rbac-secret-key",
    resave: false,
    saveUninitialized: false,
  })
);

// auto login sebagai admin
app.use((req: any, res, next) => {
  req.session.user = {
    id: 1,
    username: "admin",
    role_id: 1,
  };

  next();
});

app.use("/users", userRoutes);
app.use("/roles", roleRoutes);
app.use("/permissions", permissionRoutes);

app.get("/", (req, res) => {
  res.redirect("/users");
});

app.listen(process.env.PORT || 3000, () => {
  console.log(`Server running on http://localhost:${process.env.PORT || 3000}`);
});