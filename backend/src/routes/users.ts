import { Router } from "../../deps.ts";
import {
  getUsers,
  updateUser,
  deleteUser, } from "../controllers/userController.ts";
import authorize from "../middleware/authorize.ts";

const router = new Router({ prefix: "/api/v1/user" });

router
  .get("/users", authorize, getUsers)
  .patch("/update/:userId", authorize, updateUser)
  .delete("/delete/:userId", authorize, deleteUser);

router.allowedMethods();

export default router;
