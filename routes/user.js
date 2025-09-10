const express = require("express");
const router = express.Router();

router.get("/signUp", (req, res) => {
    res.render("users/signup.ejs");
});

module.exports = router