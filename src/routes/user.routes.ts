import express from 'express';
import { login, authenticateUser, prueba, authToken,} from "../controllers/users.controller";
import { authorizeRole } from '../middlewares/authorizeRole';

const router = express.Router();







router.post('/users/login', login); 
router.get('/users/auth', authToken);

router.get('/user', authenticateUser,authorizeRole(["user"]), prueba); // Ruta para autenticar al usuario

export default router;