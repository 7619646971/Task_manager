const express = require("express");
const router = express.Router();
const controller = require("../controllers/apiController");
const verifyToken = require("../services/auth");

router.get("/tasks", verifyToken, controller.getTasks);
router.post("/task", verifyToken, controller.createTask);
router.put("/task/:id", verifyToken, controller.updateTask);
router.delete("/task/:id", verifyToken, controller.deleteTask);

// Auth routes
router.post("/user/registration", controller.signUp);
router.post("/user/login", controller.Login);

//
router.post("/user/verify", controller.verifyUser);

module.exports = router;
