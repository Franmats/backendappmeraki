import { pool } from "../config/db"
import { UserInterface } from "../types/user"
import { createHash } from "../utils"
export class AdminUserService {
  static async getAllUsers() {
    const { rows } = await pool.query(`
      SELECT id, name, email, dni, role, is_active
      FROM users
      ORDER BY id DESC
    `)

    return rows
  }

  static async updateUserName(id: number, name: string): Promise<void> {
    await pool.query(
      `
      UPDATE users
      SET name = $1
      WHERE id = $2
      `,
      [name, id]
    )
  }

  static async setUserActive(
    id: number,
    isActive: boolean
  ): Promise<void> {
    await pool.query(
      `
      UPDATE users
      SET is_active = $1
      WHERE id = $2
      `,
      [isActive, id]
    )
  }

  static async deleteUser(id: number): Promise<boolean> {
    const { rowCount } = await pool.query(
      `
      DELETE FROM users
      WHERE id = $1
      `,
      [id]
    )

    return rowCount === 1
  }

  static async createUserByAdmin(data: UserInterface) {
    const {
      name,
      email,
      dni,
      password,
      role = "user",
      is_active = true,
      celular,
    } = data

    const { rows } = await pool.query(
      `
      INSERT INTO users
        (name, email, dni, password, role, is_active, celular)
      VALUES
        ($1, $2, $3, $4, $5, $6, $7)
      RETURNING id, name, email, dni, role, is_active
      `,
      [
        name,
        email ?? null,
        dni ?? null,
        createHash(password),
        role,
        is_active,
        celular ?? null,
      ]
    )

    return rows[0]
  }

  static async existsByEmailOrDni(email?: string, dni?: string) {
    const { rowCount } = await pool.query(
      `
      SELECT 1
      FROM users
      WHERE ($1::text IS NOT NULL AND email = $1)
         OR ($2::text IS NOT NULL AND dni = $2)
      `,
      [email ?? null, dni ?? null]
    )

    return rowCount > 0
  }
}

