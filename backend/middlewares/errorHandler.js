export function notFoundHandler(req, res, next) {
  res.status(404).json({
    success: false,
    message: "Route not found",
    path: req.originalUrl,
  });
}

export function errorHandler(err, req, res, next) {
  console.error("Error:", err.message); 

  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Something went wrong on the server.",
  });
}