import pool from "../config/database";
import type { RowDataPacket, ResultSetHeader } from "mysql2";

export interface User extends RowDataPacket {
  id: number;
  username: string;
  role_id: number;
  role_name: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const [rows] = await pool.query<User[]>(`
    SELECT users.id, users.username, users.role_id, roles.name AS role_name
    FROM users
    LEFT JOIN roles ON users.role_id = roles.id
  `);

  return rows;
};

export const createUser = async (data: {
  username: string;
  password: string;
  role_id: string;
}) => {
  const [result] = await pool.query<ResultSetHeader>(
    "INSERT INTO users (username, password, role_id) VALUES (?, ?, ?)",
    [data.username, data.password, Number(data.role_id)]
  );

  return result;
};

export const deleteUser = async (id: number) => {
  const [result] = await pool.query<ResultSetHeader>(
    "DELETE FROM users WHERE id = ?",
    [id]
  );

  return result;
};