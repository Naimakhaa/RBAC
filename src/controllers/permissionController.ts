import type { Request, Response } from "express";
import {
  getAllPermissions,
  createPermission,
} from "../models/permissionModel";

export const listPermissions = async (req: Request, res: Response) => {
  try {
    const permissions = await getAllPermissions();
    const loginUser = (req as any).session?.user;

    res.render("layouts/main", {
      title: "Permission Management",
      body: "../permissions/list",
      permissions,
      loginUser,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal mengambil data permissions");
  }
};

export const storePermission = async (req: Request, res: Response) => {
  try {
    await createPermission(req.body);
    res.redirect("/permissions");
  } catch (error) {
    console.error(error);
    res.status(500).send("Gagal menambahkan permission");
  }
};