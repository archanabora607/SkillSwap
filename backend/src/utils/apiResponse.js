// Standard API response helpers
const sendSuccess = (res, statusCode = 200, message = 'Success', data = {}) => {
  res.status(statusCode).json({ success: true, message, data, ...data });
};

const sendError = (res, statusCode = 500, message = 'Internal Server Error') => {
  res.status(statusCode).json({ success: false, message });
};

module.exports = { sendSuccess, sendError };
