import {
  getCurrentUser,
  loginUser,
  logoutUser,
  refreshSession,
  registerUser,
  updateUser,
} from "../services/auth.js";
import { getEnvVar } from "../utils/getEnvVar.js";
import { saveFileToCloudinary } from "../utils/saveFileToCloudinary.js";
import { saveFileToUploadDir } from '../utils/saveFileToUploadDir.js';


export const registerController = async (req, res) => {
 let photoUrl = null;
  const file = req.file;
  

if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    }

  const payload = {
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    language: req.body.language,
    role: req.body.role,
    email: req.body.email,
    password: req.body.password,
    agree: req.body.agree,
    photo: photoUrl,
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

const userId = req.user._id;
  const file = req.file;
  let photoUrl;

  

  if (file) {
      if (getEnvVar('ENABLE_CLOUDINARY') === 'true') {
        photoUrl = await saveFileToCloudinary(file);
      } else {
        photoUrl = await saveFileToUploadDir(file);
      }
    }

  
   const updatedUser = await updateUser(
       userId,
      { ...req.body, photo: photoUrl },
    );
  

  

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

