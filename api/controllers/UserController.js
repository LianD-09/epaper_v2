const userService = require("../services/UserService");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.register = async (req, res) => {
  try {
    const user = req.body;
    let existUser = await userService.findUserByEmail(user.email);
    if (existUser == null) {
      bcrypt
        .hash(user.password, 10)
        .then((hashedPassword) => {
          const newUser = {
            ...user,
            password: hashedPassword,
          };
          userService.createUser(newUser).then((result) => {
            const { password: password, ...returnUser } = result._doc;
            res.json({ data: returnUser, status: 1 });
          });
        })
        .catch((err) => {
          res.status(500).json({ error: err.message });
        });
    } else {
      res.status(409).json({ error: "Email has been used" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  try {
    const user = req.body;
    userService
      .findUserByEmail(user.email)
      .then((result) => {
        const existUser = result._doc;
        bcrypt
          .compare(user.password, existUser.password)
          .then((passwordCheck) => {
            if (!passwordCheck) {
              res.status(401).json({ error: "Email and password incorrect" });
            } else {
              const token = jwt.sign(
                {
                  userID: existUser._id,
                  userEmail: existUser.email,
                },
                userService.secretKey,
                {
                  expiresIn: "24h",
                }
              );

              const { password: password, ...returnUser } = existUser;
              res.json({ data: { token, ...returnUser }, status: 1 });
            }
          })
          .catch((err) => {
            res.status(500).json({ error: err.message });
          });
      })
      .catch(() => {
        res.status(401).json({ error: "Email and password incorrect" });
      });
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    if (req.params.id === req.user.userID) {
      const user = await userService.getUserById(req.params.id);
      const { password: password, ...returnData } = user._doc;
      res.json({ data: returnData, status: 1 });
    } else {
      res.json({ data: null, status: 1 });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}

exports.updateUser = async (req, res) => {
  try {
    if (req.params.id === req.user.userID) {
      const user = await userService.updateUser(req.params.id, req.body);
      const { password: password, ...returnData } = user._doc;
      res.json({ data: returnData, status: 1 });
    } else {
      res.json({ data: null, status: 1 });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ error: err.message });
  }
}