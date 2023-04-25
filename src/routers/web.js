import express from "express";
import userController from "../controllers/userController";

let router = express.Router();

let initWebRoutes = (app) => {
  router.post("/login", userController.handleLogin);
  router.post("/register", userController.handleCreateNewUser);
  router.put("/edit-user", userController.handleEditUser);
  router.delete("/delete-user", userController.handleDeleteUser);
  return app.use("/api/", router);
};

module.exports = initWebRoutes;
