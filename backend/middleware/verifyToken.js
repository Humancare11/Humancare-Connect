// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ msg: "No token provided. Please login." });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // { id, role }
    next();
  } catch (err) {
    return res.status(401).json({ msg: "Invalid or expired token. Please login again." });
  }
};

// Only allow doctors
const doctorOnly = (req, res, next) => {
  if (req.user?.role !== "doctor") {
    return res.status(403).json({ msg: "Access denied. Doctors only." });
  }
  next();
};

// Only allow admins (regular + superadmin can access admin routes)
const adminOnly = (req, res, next) => {
  if (req.user?.role !== "admin" && req.user?.role !== "superadmin") {
    return res.status(403).json({ msg: "Access denied. Admins only." });
  }
  next();
};

// Only allow superadmin
const superAdminOnly = (req, res, next) => {
  if (req.user?.role !== "superadmin") {
    return res.status(403).json({ msg: "Access denied. Super Admins only." });
  }
  next();
};

module.exports = { verifyToken, doctorOnly, adminOnly, superAdminOnly };