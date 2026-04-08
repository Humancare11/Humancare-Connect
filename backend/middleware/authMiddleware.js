const jwt = require("jsonwebtoken");

module.exports = function (req, res, next) {
  const authHeader = req.header("Authorization");

  if (!authHeader) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    let token = authHeader;

    // Agar header "Bearer <token>" format me aaye
    if (authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agar token sign karte waqt { user: { id, role } } bheja hai
    if (decoded.user) {
      req.user = decoded.user;
    } else {
      req.user = decoded;
    }

    next();
  } catch (error) {
    res.status(401).json({ msg: "Invalid token" });
  }
};
