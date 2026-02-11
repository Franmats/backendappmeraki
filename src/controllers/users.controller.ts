import { UserService } from "../services/users.service";
import { isValidPassword,generateToken,authTokenHeader } from "../utils"; // Asegúrate de tener esta función para validar contraseñas
import type {UserInterface} from "../types/user.ts"; // Asegúrate de tener esta interfaz definida




export const getUserByEmail = async (req, res) => {
  try {
    const email = req.params.email;
    const user = await UserService.getUserByEmail(email);
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    // Si el usuario existe, lo devolvemos
    res.status(200).json(user);
  } catch (error) {
    console.error("Error al obtener usuario:", error);
    res.status(500).json({ message: "Error al obtener usuario" });
  }
}





export const login = async (req, res) => {
  try {
    const { email, dni, password } = req.body

    if ((!email && !dni) || !password) {
      return res.status(400).json({
        message: "Debe ingresar email o DNI y contraseña",
      })
    }

    const user = email
      ? await UserService.getUserByEmail(email)
      : await UserService.getUserByDni(dni)

    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" })
    }

    if (!isValidPassword(user.password, password)) {
      return res.status(401).json({ message: "Contraseña incorrecta" })
    }

    const token = generateToken({
      id: user.id,
      name: user.name,
      role: user.role ?? null,
      email: user.email ?? null,
      dni: user.dni ?? null,
    })

    res.status(200).json({
      message: "Login correcto",
      payload: token,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: "Error en el login" })
  }
}


export const authenticateUser = async (req, res, next) => {
   const authHeader = req.headers.authorization;
   req.session = {user:null}

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No autorizado" });
     }

     const token = authHeader.split(" ")[1];
    try {
        const decoded = authTokenHeader(token);
        if (!decoded || !decoded.user) {
            return res.status(403).json({ message: 'Acceso no autorizado' });
        }      
        req.session.user = decoded.user;
        next();
    } catch (error) {
        

        return res.status(403).json({ message: "Fallo en la autenticacion" });
    }
    }

export const homeDataUser = async (req, res) => {
  const user = req.session.user

  if (!user) {
    return res.status(401).json({ message: "No autenticado" })
  }

  const userData = user.email
    ? await UserService.getUserByEmail(user.email)
    : await UserService.getUserByDni(user.dni)

  res.status(200).json({ payload: userData })
}

/* 
export const userProfile = async (req, res) => {
  try {
    console.log("Obteniendo perfil de usuario...")
    console.log("Usuario en sesión:", req.session.user)
    const user = req.session.user;
    if (!user) {
      return res.status(401).json({ message: "Usuario no autenticado" });
    }
    const userData = await UserService.getUserByDni(user.dni);
    if (!userData) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    res.status(200).json({ message: "Perfil de usuario", payload: userData });
  } catch (error) {
    console.error("Error al obtener perfil de usuario:", error);
    res.status(500).json({ message: "Error al obtener perfil de usuario" });
  }
}
 */


export const prueba = async (req, res) => {
  try {
    const user = req.session.user;
    res.status(200).json({ message: "Prueba exitosa" ,payload: user});
  } catch (error) {
    console.error("Error en la prueba:", error);
    res.status(500).json({ message: "Error en la prueba" });
  }
}

export const authToken = async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ message: "Token no proporcionado" });
    }
    const decoded = authTokenHeader(token);
    res.status(200).json({ message: "Token válido", payload: decoded });
    } catch (error) {
    console.error("Error al autenticar token:", error);
    res.status(500).json({ message: "Error al autenticar token" });
  } }