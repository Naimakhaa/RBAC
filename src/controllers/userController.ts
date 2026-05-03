import type { Request, Response } from "express";
import { getAllUsers, createUser, deleteUser } from "../models/userModel";
import { getAllRoles } from "../models/roleModel";

export const listUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    const roles = await getAllRoles();
    const loginUser = (req as any).session?.user;

    res.render("layouts/main", {
      title: "User Management",
      body: "../users/list",
      users,
      roles,
      userRole: loginUser?.role_id,
      loginUser,
    });
  } catch (error) {
    console.error("ERROR GET USERS:", error);
    res.status(500).send("Gagal mengambil data users");
  }
};

export const storeUser = async (req: Request, res: Response) => {
  try {
    console.log("DATA USER MASUK:", req.body);

    const { username, password, role_id } = req.body;

    if (!username || !password || !role_id) {
      return res.status(400).send("Username, password, dan role wajib diisi");
    }

    await createUser({
      username,
      password,
      role_id,
    });

    res.redirect("/users");
  } catch (error) {
    console.error("ERROR INSERT USER:", error);
    res.status(500).send("Gagal menambahkan user: " + error);
  }
};

export const removeUser = async (req: Request, res: Response) => {
  try {
    await deleteUser(Number(req.params.id));
    res.redirect("/users");
  } catch (error) {
    console.error("ERROR DELETE USER:", error);
    res.status(500).send("Gagal menghapus user: " + error);
  }
};