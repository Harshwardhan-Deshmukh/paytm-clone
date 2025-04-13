import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/configs.js";
import { doesUserExists } from "../utils/dbUtils.js";
import { comparePassword } from "../utils/passwordHasher.js";
import responseHandler from "../utils/responseHandler.js";
import {
  signInBodyChecker,
  signUpBodyChecker,
} from "../validation/zodSchema.js";

export const signUp = async (req, res, next) => {
  const data = signUpBodyChecker.safeParse(req.body);

  if (data.success) {
    const { username } = data.data;
    const userData = await doesUserExists(username);
    if (userData) {
      return responseHandler(
        res,
        411,
        "ERROR",
        null,
        `Username ${username} already exists`,
      );
    } else {
      next();
    }
  } else {
    return responseHandler(res, 411, "ERROR", null, data.error.errors);
  }
};

export const signIn = async (req, res, next) => {
  const data = signInBodyChecker.safeParse(req.body);
  if (data.success) {
    const { username, password } = data.data;
    const userData = await doesUserExists(username);
    const isValidPassword = await comparePassword(password, userData.password);
    if (userData._id && isValidPassword) {
      const token = jwt.sign(
        {
          id: userData._id,
          username: userData.username,
        },
        JWT_SECRET,
        { expiresIn: "1h" },
      );
      req.token = token;
      next();
    } else {
      return responseHandler(res, 401, "ERROR", null, `Invalid credentials`);
    }
  } else {
    return responseHandler(res, 411, "ERROR", null, data.error.errors);
  }
};

export const authenticationMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith("Bearer ")) {
    const jwtToken = authHeader.split(" ")[1];

    try {
      const decodedUserData = jwt.verify(jwtToken, JWT_SECRET); // will throw an error if jwt is malformed
      req.user = decodedUserData;
      next();
    } catch (err) {
      err.statusCode = 401;
      throw err;
    }
  } else {
    return responseHandler(
      res,
      411,
      "ERROR",
      null,
      "Please check your Authorization header",
    );
  }
};
