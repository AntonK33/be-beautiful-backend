import { HttpError } from 'http-errors';

export const errorHandler = (err, _req, res, _next) => {
  if (err.name === 'ValidationError') {
    res.status(400).json({
      status: 400,
      message: err.message,
      data: err.details,
    });
  }

  if (err instanceof HttpError) {
    res.status(err.status).json({
      status: err.statusCode,
      message: err.name,
      data: err.message,
    });
    return;
  }

  res.status(500).json({
    status: 500,
    message: 'Something went wrong',
    data: err.message,
  });
};
