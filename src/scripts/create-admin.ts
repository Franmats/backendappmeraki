import {pool} from "../config/db"
import { createHash } from "../utils"

async function createAdmin() {
  const name = ""
  const email = ""
  const password = "" 
  const role = "admin"

  const exists = await pool.query(
    `SELECT 1 FROM users WHERE email = $1`,
    [email]
  )

  if (exists.rowCount) {
    console.log("❌ El admin ya existe")
    process.exit(0)
  }

  await pool.query(
    `
    INSERT INTO users (name, email, password, role, is_active)
    VALUES ($1, $2, $3, $4, true)
    `,
    [name, email, createHash(password), role]
  )

  console.log("✅ Admin creado correctamente")
  process.exit(0)
}

createAdmin().catch(err => {
  console.error("Error creando admin:", err)
  process.exit(1)
})
