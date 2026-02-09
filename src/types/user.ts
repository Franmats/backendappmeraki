export interface UserInterface {
    name: string;
    email: string;
    dni?: string; // Documento Nacional de Identidad
    password: string; // Almacenar la contraseña hasheada
    is_active: boolean; // Indica si el usuario está activo, por defecto true
    celular?: number | null; // Celular del usuario, opcional
    role: 'admin' | 'user'; // Rol del usuario, por defecto 'user'

}

export interface UserToken {
  id: number
  name: string
  role: "admin" | "user"
  email?: string
  dni?: string
}
