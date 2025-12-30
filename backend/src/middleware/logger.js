// Simple logger for development
const logger = {
  info: (msg) => console.log(\[INFO] \ - \\),
  error: (msg) => console.error(\[ERROR] \ - \\),
  warn: (msg) => console.warn(\[WARN] \ - \\),
  debug: (msg) => console.log(\[DEBUG] \ - \\),
};

export const requestLogger = (req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.info(\\ \ - \ (\ms)\);
  });
  next();
};

export default logger;
