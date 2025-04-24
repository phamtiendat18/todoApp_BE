const jwt = require("jsonwebtoken");

const authenticateUser = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "You are not authenticated!" });
  }
  jwt.verify(token, process.env.JWT_ACCESS_KEY, (err, user) => {
    if (err) {
      return res.status(403).json("Token is not valid!");
    }
    req.user = user;
    next();
  });
};

const verifyUser = (req, res, next) => {
  authenticateUser(req, res, () => {
    if (req.user.id !== +req.params.id) {
      console.log(req.user.id);

      return res.status(403).json("You aren't allowed!");
    }
    next();
  });
};

module.exports = { authenticateUser, verifyUser };
