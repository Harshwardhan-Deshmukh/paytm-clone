import { TIMESTAMP } from "../config/configs.js";

const responseHandler = (response, statusCode, status, data, error) => {
  return response.status(statusCode).json({
    status,
    data,
    error: !error || {
      message: error,
    },
    timestamp: TIMESTAMP,
  });
};

export default responseHandler;
