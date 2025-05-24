import { loginUser, registerUser } from "../services/auth.js";

export const registerController = async (req, res) => {
  const payload = {
    language: req.body.language,
    email: req.body.email,
    password: req.body.password,
  };

  const file = req.file;

  const session = await registerUser(payload, file, req);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    secure: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(201).json({
    status: 201,
    message: "User registered successfully!",
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const loginController = async (req, res) => {
  const { email, password } = req.body;

  const session = await loginUser(email, password, req);

  res.cookie("refreshToken", session.refreshToken, {
    httpOnly: true,
    secure: true,
    expires: session.refreshTokenValidUntil,
  });

  res.cookie("sessionId", session._id, {
    httpOnly: true,
    secure: true,
    expires: session.refreshTokenValidUntil,
  });

  res.status(200).json({
    status: 200,
    message: "Logged in successfully!",
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};
