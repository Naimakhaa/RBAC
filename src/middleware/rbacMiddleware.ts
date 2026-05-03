import type { Request, Response, NextFunction } from "express";
import pool from "../config/database";
import type { RowDataPacket } from "mysql2";

interface PermissionRow extends RowDataPacket {
  name: string;
}

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = (req as any).session?.user;

      if (!user) {
        return res.redirect("/login");
      }

      const [rows] = await pool.query<PermissionRow[]>(
        `
        SELECT p.name
        FROM users u
        JOIN roles r ON u.role_id = r.id
        JOIN role_permissions rp ON r.id = rp.role_id
        JOIN permissions p ON rp.permission_id = p.id
        WHERE u.id = ?
        `,
        [user.id]
      );

      const permissions = rows.map((row) => row.name);

      if (!permissions.includes(requiredPermission)) {
        return res.status(403).send("Forbidden: insufficient permissions");
      }

      next();
    } catch (error) {
      console.error(error);
      return res.status(500).send("Server error");
    }
  };
};