import { Router } from "express";
import { listUsers, storeUser, removeUser } from "../controllers/userController";
import { checkPermission } from "../middleware/rbacMiddleware";

const router = Router();

router.get("/", checkPermission("user:view"), listUsers);
router.post("/", checkPermission("user:create"), storeUser);
router.post("/delete/:id", checkPermission("user:delete"), removeUser);

export default router;