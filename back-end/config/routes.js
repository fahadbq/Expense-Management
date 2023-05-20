const express = require("express");
const budgetCtlr = require("../app/controllers/budgetCtlr");
const categoryCtlr = require("../app/controllers/categoryCtlr");
const expenseCtlr = require("../app/controllers/expenseCtlr");
const usersCtlr = require("../app/controllers/usersCtlr");
const { authenticateUser } = require("../app/middleware/authentication");
const checkCategory = require("../app/middleware/checkCategory");
const encryptedPassword = require("../app/middleware/encryptPassword");
const router = express.Router();
const passport = require("passport");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const fileName = Date.now() + "-" + file.originalname;

    // const filePath = path.join(__dirname, "uploads", fileName);

    // // Replace local file system path with API base URL
    // const apiUrl = "http://localhost:3040";
    // const fileUrl = filePath.replace(__dirname, apiUrl);

    cb(null, fileName);
  },
});

const upload = multer({ storage: storage });

//User Controller
router.post("/api/user/register", encryptedPassword, usersCtlr.register); //encryptPassword

router.post("/api/user/login", usersCtlr.login);

router.get(`/api/user/account`, authenticateUser, usersCtlr.account);

//Update the profile
router.patch(
  "/api/user/:id/profile",
  authenticateUser,
  upload.single("picture"),
  usersCtlr.updateProfile
);

//Google Authentication
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] })
);

//Google Authentication Success
router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    successRedirect: process.env.CLIENT_URL,
    failureRedirect: "/login/failed",
  }),
  usersCtlr.googleAuthentication
);

router.get(
  "/login/success",
  // controller
  (req, res) => {
    if (req.user) {
      res.status(200).json({
        user: req.user,
      });
    } else {
      res.status(403).json({ error: true, message: "Not Authorized" });
    }
  }
);

router.get("/login/failed", (req, res) => {
  res.status(401).json({
    error: true,
    message: "Login in failure",
  });
});

router.get("/logout", (req, res) => {
  req.logout();
  req.redirect(process.env.CLIENT_URL);
});

//Categories
router.get(`/api/categories`, authenticateUser, categoryCtlr.list);

router.post(`/api/categories`, authenticateUser, categoryCtlr.create);

router.get(`/api/categories/:id`, authenticateUser, categoryCtlr.view);

router.put(
  `/api/categories/:id`,
  authenticateUser,
  checkCategory,
  categoryCtlr.update
);

router.delete(
  `/api/categories/:id`,
  authenticateUser,
  checkCategory,
  categoryCtlr.delete
);

//Budget
router.post(`/api/budgets`, authenticateUser, budgetCtlr.create);

router.get(`/api/budgets`, authenticateUser, budgetCtlr.view);

router.put(`/api/budgets/:id`, authenticateUser, budgetCtlr.update);

router.delete(`/api/budgets/:id`, authenticateUser, budgetCtlr.delete);

//Expense
router.get(`/api/expenses`, authenticateUser, expenseCtlr.list);

router.post(`/api/expenses`, authenticateUser, expenseCtlr.create);

router.get(`/api/expenses/:id`, authenticateUser, expenseCtlr.view);

router.put(`/api/expenses/:id`, authenticateUser, expenseCtlr.update);

router.delete(`/api/expenses/:id`, authenticateUser, expenseCtlr.delete);

router.get(`/api/expenses`, authenticateUser, expenseCtlr.listDeleted);

router.get(
  `/api/expenses/undo-delete/:id`,
  authenticateUser,
  expenseCtlr.undoDeleted
);

module.exports = router;