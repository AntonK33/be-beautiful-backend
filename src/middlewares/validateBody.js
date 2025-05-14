export const validateBody = (schema) => {
  return async (req, _res, next) => {
    try {
      await schema.validateAsync(req.body, {
        abortEarly: false,
      });
      next();
    } catch (validationError) {
      next(validationError);
    }
  };
};
