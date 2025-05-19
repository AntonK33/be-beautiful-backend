import { registerUser } from "../services/auth.js";

export const registerController = async (req, res) => {
  const payload = {
    language: req.body.language,
    email: req.body.email,
    password: req.body.password,
  };

  const file = req.file;

  const email = await registerUser(payload, file);

  res.status(201).json({
    status: 201,
    message: "User registered successfully!",
    data: {
      email,
    },
  });
};
