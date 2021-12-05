import { Router } from "../../deps.ts";
import {
  register,
  login,
} from "../controllers/authController.ts";

const router = new Router({ prefix: "/api/v1/auth" });

router
  .post("/login", login)
  .post("/register", register)

router.allowedMethods();

export default router;
