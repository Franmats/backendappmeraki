// services/UserService.ts
import { pool } from "../config/db"
import type { UserInterface } from "../types/user"

export class UserService {
  // Crear usuario




  // Obtener usuario por ID
  static async getUserById(id: number) {
    const { rows } = await pool.query(
      `
      SELECT id, name, email, dni, celular, role
      FROM users
      WHERE id = $1
      `,
      [id]
    )

    return rows[0] ?? null
  }

  // Obtener usuario por EMAIL (admin)
  static async getUserByEmail(email: string) {
    const { rows } = await pool.query(
      `
      SELECT id, name, email, password, role
      FROM users
      WHERE email = $1
      `,
      [email]
    )

    return rows[0] ?? null
  }
  // Obtener usuario por NAME (admin)
  static async getUserByName(name: string) {
    const { rows } = await pool.query(
      `
      SELECT id, name, email, password, role
      FROM users
      WHERE name = $1
      `,
      [name]
    )

    return rows[0] ?? null
  }

  // Obtener usuario por DNI (usuarios finales)
  static async getUserByDni(dni: string) {
    const { rows } = await pool.query(
      `
      SELECT id, name, dni, password, role
      FROM users
      WHERE dni = $1
      `,
      [dni]
    )

    return rows[0] ?? null
  }





  
}
