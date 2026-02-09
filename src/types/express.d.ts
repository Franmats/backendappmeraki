import type { UserToken } from "./user"

declare global {
  namespace Express {
    interface Request {
      session?: {
        user?: UserToken
      }
    }
  }
}
