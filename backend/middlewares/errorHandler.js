export function notFoundHandler(req, res, next) {
  res.status(404).json({
    ok: false,
    error: "Route not found",
    path: req.originalUrl
  });
}

export function errorHandler(err, req, res, next) {
  const status = err.status || err.code || 500;
  const isProd = process.env.NODE_ENV === "production";

  if (!isProd) {
    console.error("Error:", err);
  }

  res.status(status).json({
    ok: false,
    error: err.message || "Internal Server Error",
    ...(isProd ? {} : { stack: err.stack })
  });
}
