import { AdminUserService } from "../services/admin.service"

import {  isValidPassword } from "../utils"
import { generateToken } from "../utils"
import  {UserService} from "../services/users.service"

/**
 * Obtener todos los usuarios (ADMIN)
 */
export const getAllUsersAdmin = async (req, res) => {
  try {
    const users = await AdminUserService.getAllUsers()
    res.status(200).json(users)
  } catch (error) {
    console.error("Error al obtener usuarios:", error)
    res.status(500).json({ message: "Error al obtener usuarios" })
  }
}

/**
 * Actualizar nombre de usuario
 */
export const updateUserNameAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { name } = req.body

    if (!name) {
      return res.status(400).json({ message: "El nombre es obligatorio" })
    }

    await AdminUserService.updateUserName(id, name)

    res.status(200).json({ message: "Nombre actualizado correctamente" })
  } catch (error) {
    console.error("Error al actualizar nombre:", error)
    res.status(500).json({ message: "Error al actualizar usuario" })
  }
}

/**
 * Activar / desactivar usuario (soft delete)
 */
export const setUserActiveAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id)
    const { is_active } = req.body

    if (typeof is_active !== "boolean") {
      return res
        .status(400)
        .json({ message: "is_active debe ser boolean" })
    }

    await AdminUserService.setUserActive(id, is_active)

    res.status(200).json({
      message: is_active
        ? "Usuario activado"
        : "Usuario desactivado",
    })
  } catch (error) {
    console.error("Error al cambiar estado:", error)
    res.status(500).json({ message: "Error al cambiar estado del usuario" })
  }
}

/**
 * Eliminar usuario (hard delete – usar con cuidado)
 */
export const deleteUserAdmin = async (req, res) => {
  try {
    const id = Number(req.params.id)

    const deleted = await AdminUserService.deleteUser(id)

    if (!deleted) {
      return res
        .status(404)
        .json({ message: "Usuario no encontrado" })
    }

    res.status(200).json({ message: "Usuario eliminado correctamente" })
  } catch (error) {
    console.error("Error al eliminar usuario:", error)
    res.status(500).json({ message: "Error al eliminar usuario" })
  }
}

export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email y contraseña son obligatorios",
      })
    }

    const admin = await UserService.getUserByEmail(email)

    if (!admin || admin.role !== "admin") {
      return res.status(403).json({ message: "Acceso denegado" })
    }

    if (!isValidPassword(admin.password, password)) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = generateToken({
      id: admin.id,
      name: admin.name,
      email: admin.email,
      role: admin.role,
    })

    res.status(200).json({
      message: "Login admin correcto",
      payload: token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error en login admin" })
  }
}


export const createUserAdmin = async (req, res) => {
  try {
    const {
      name,
      email,
      dni,
      password,
      role,
      is_active,
      celular,
    } = req.body

    if (!name || !password) {
      return res.status(400).json({ message: "Nombre y contraseña obligatorios" })
    }

    if (!email && !dni) {
      return res
        .status(400)
        .json({ message: "Debe tener email o DNI" })
    }

    const exists = await AdminUserService.existsByEmailOrDni(email, dni)
    if (exists) {
      return res
        .status(400)
        .json({ message: "El usuario ya existe" })
    }

    const user = await AdminUserService.createUserByAdmin({
      name,
      email,
      dni,
      password,
      role: role ?? "user",
      is_active: is_active ?? true,
      celular: celular ?? null,
    })

    res.status(201).json({
      message: "Usuario creado correctamente",
      payload: user,
    })
  } catch (error) {
    console.error("Error al crear usuario:", error)
    res.status(500).json({ message: "Error al crear usuario" })
  }
}
