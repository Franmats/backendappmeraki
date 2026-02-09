export const authorizeRole = (roles = []) => {
  return (req, res, next) => {
    const user = req.session?.user

    if (!user) {
      return res.status(401).json({ message: "No autenticado" })
    }

    if (!roles.includes(user.role)) {
      return res.status(403).json({ message: "Permisos insuficientes" })
    }

    next()
  }
}
