import { Router } from "express";
import { listRoles, storeRole } from "../controllers/roleController";
import { checkPermission } from "../middleware/rbacMiddleware";

const router = Router();

router.get("/", checkPermission("role:view"), listRoles);
router.post("/", checkPermission("role:create"), storeRole);

export default router;