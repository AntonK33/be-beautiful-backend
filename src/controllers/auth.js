import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  updateUser,
} from "../services/auth.js";

export const registerController = async (req, res) => {
  const payload = {
    name: req.body.name,
    language: req.body.language,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
  };

  const session = await registerUser(payload, req);

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

export const getCurrentUserController = async (req, res) => {
  const user = await getCurrentUser(req.user);
  res.status(200).json({
    status: 200,
    message: "User information retrieved successfully!",
    data: user,
  });
};

export const updateCurrentUserController = async (req, res) => {
  const updateData = req.body;

  const file = req.file;

  const updatedUser = await updateUser(req.user, updateData, file);

  res.status(200).json({
    status: 200,
    message: "User updated successfully!",
    data: updatedUser,
  });
};

export const refreshTokenController = async (req, res) => {
  // const { sessionId, refreshToken } = req.cookies;
  const { refreshToken } = req.body;

  const session = await refreshSession(refreshToken);

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
    message: "Session refreshed successfully!",
    data: {
      accessToken: session.accessToken,
      refreshToken: session.refreshToken,
    },
  });
};

export const logoutController = async (req, res) => {
  const { accessToken } = req.body;

  if (!accessToken) {
    return res.status(401).json({
      status: 401,
      message: "Session not found",
    });
  }

  if (accessToken) {
    await logoutUser(accessToken);
  }

  res.clearCookie("refreshToken");
  res.clearCookie("accessToken");

  res.status(204).send();
};
