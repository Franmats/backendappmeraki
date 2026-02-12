import express from 'express';
import { getAllUsersAdmin, deleteUserAdmin, updateUserNameAdmin, adminLogin,setUserActiveAdmin,createUserAdmin } from '../controllers/admin.controller';
import { authenticateUser } from '../controllers/users.controller';
import { authorizeRole } from '../middlewares/authorizeRole';

const router = express.Router();

/* router.get('/admin/users',authenticateUser,authorizeRole(["admin"]), getAllUsersAdmin);
router.put('/admin/users/:id', authenticateUser, authorizeRole(["admin"]), updateUserNameAdmin);
router.put('/admin/users/:id/active', authenticateUser, authorizeRole(["admin"]), setUserActiveAdmin); */

/* router.post("/admin/login", adminLogin);



router.delete('/admin/users/:id', authenticateUser, authorizeRole(["admin"]), deleteUserAdmin); 
router.post("/admin/usercreate", authenticateUser, authorizeRole(["admin"]),createUserAdmin); */




export default router;