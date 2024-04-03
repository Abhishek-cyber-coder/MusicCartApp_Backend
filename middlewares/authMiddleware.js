const jwt = require("jsonwebtoken");

const verifyAuthorization = (req, res, next) => {
  try {
    const token = req.header("Authorization");

    if (!token) {
      return res.status(401).json({
        message: "Unauthorized user",
        success: false,
      });
    }

    const decode = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.body.userId = decode.userId;
    next();
  } catch (error) {
    res.status(401).json({
      message: "Invalid token",
      success: false,
    });
  }
};

module.exports = verifyAuthorization;
