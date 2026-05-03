import type { Request, Response } from "express";
import { getAllRoles, createRole } from "../models/roleModel";

export const listRoles = async (req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    const loginUser = (req as any).session?.user;

    res.render("layouts/main", {
      title: "Role Management",
      body: "../roles/list",
      roles,
      loginUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengambil data roles");
  }
};

export const storeRole = async (req: Request, res: Response) => {
  try {
    await createRole(req.body.name);
    res.redirect("/roles");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal menambahkan role");
  }
};