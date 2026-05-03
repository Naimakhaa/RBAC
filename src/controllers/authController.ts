import type { Request, Response } from "express";
import pool from "../config/database";

export const showLogin = (req: Request, res: Response) => {
  res.render("auth/login", { error: null });
};

export const login = async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    const [rows]: any = await pool.query(
      "SELECT * FROM users WHERE username = ?",
      [username]
    );

    if (rows.length === 0) {
      return res.render("auth/login", {
        error: "Username tidak ditemukan",
      });
    }

    const user = rows[0];

    if (password !== user.password) {
      return res.render("auth/login", {
        error: "Password salah",
      });
    }

    (req as any).session.user = {
      id: user.id,
      username: user.username,
      role_id: user.role_id,
    };

    res.redirect("/users");
  } catch (error) {
    console.error("LOGIN ERROR:", error);
    res.status(500).send("Login gagal: " + error);
  }
};

export const logout = (req: Request, res: Response) => {
  (req as any).session.destroy(() => {
    res.redirect("/login");
  });
};