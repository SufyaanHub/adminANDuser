const jwt = require("jsonwebtoken");

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "Access denied - No token provided" });
  }

  // Extract token from "Bearer <token>" format
  const token = authHeader.startsWith("Bearer ") 
    ? authHeader.slice(7) 
    : authHeader;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("Token decoded successfully:", { id: decoded.id, email: decoded.email, role: decoded.role });
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Token verification failed:", error.message);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

// Role-based authorization middleware
exports.authorize = (allowedRoles) => {
  return (req, res, next) => {
    if (!req.user) {
      console.error("No user found in req.user");
      return res.status(401).json({ message: "User not authenticated" });
    }

    console.log("Authorization check - User role:", req.user.role, "Allowed roles:", allowedRoles);

    if (!allowedRoles.includes(req.user.role)) {
      console.error("User role not in allowed roles");
      return res.status(403).json({ message: "Permission denied - Admin access required" });
    }

    next();
  };
};
