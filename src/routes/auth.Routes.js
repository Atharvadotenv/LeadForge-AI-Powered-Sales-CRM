const express = require('express');
const { registerController, loginController } = require('../controllers/auth.controller');
const { checkUser } = require('../middleware/checkUserExists');

const router = express.Router();

router.post("/register",registerController);
router.post("/login",checkUser, loginController)


module.exports = router;

/*
  "email": "developer.test@example.com",
  "username": "dev_test",
  "password": "SecurePassword123!",
  "displayName": "Alex Test"
}
  */
