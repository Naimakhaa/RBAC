import { Router } from "express";
import {
  listPermissions,
  storePermission,
} from "../controllers/permissionController";
import { checkPermission } from "../middleware/rbacMiddleware";

const router = Router();

router.get("/", checkPermission("permission:view"), listPermissions);
router.post("/", checkPermission("permission:create"), storePermission);

export default router;