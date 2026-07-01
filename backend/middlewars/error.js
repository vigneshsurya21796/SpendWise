const errorhandler = (err, req, res, next) => {
  // console.error("ERROR:", err.message);
  // console.error("STACK:", err.stack);
  const statusCode = err.statusCode || 500;
  return res.status(statusCode).json({
    success: false,
    message: err.message,
    stack: process.env.NODE_ENV === "development" ? err.stack : null,
  });
};

module.exports = errorhandler;
