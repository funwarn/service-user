/* Authentication Helper */
import jwt from "jsonwebtoken";

// Configs
import keys from "../configs/keys";

// Models
import UserModel from "../models/user";

const AuthHelper = (context: any) => {
  try {
    const { token } = context;

    if (token.startsWith("Bearer ")) {
      const accessToken = token.substring(7, token.length);

      return jwt.verify(
        accessToken,
        keys.access_token_secret,
        (err: any, decoded: any) => {
          if (err) return false;

          const userData = UserModel.findById(decoded._id);

          return userData;
        }
      );
    } else {
      return false;
    }
  } catch (err) {
    return false;
  }
};
export default AuthHelper;
