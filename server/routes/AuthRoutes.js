const { register, login } = require("../controllers/AuthControllers");

const router = require("express").Router();

// router.post("/");
router.post("/register", register);
router.post("/login", login);
// router.get("/urls", getURLs);

module.exports = router;
