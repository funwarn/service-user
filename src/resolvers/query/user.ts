/* Query - User Resolver */
// Models
import UserModel from "../../models/user";

// Helpers
import AuthHelper from "../../helpers/auth";
import * as ErrorHandler from "../../helpers/errors/english.json";

interface Username {
  username: string;
}

// My User Profile
const myProfile = async (_: any, __: any, context: any) => {
  try {
    // Authentication User
    const userData = await AuthHelper(context);
    if (!userData) {
      return ErrorHandler.InvalidToken;
    }

    // User Data
    const {
      _id,
      add_username,
      display_name,
      banned_id,
      birthdate,
      gender,
      email,
      username,
      bio,
      gen_id
    } = userData;

    return {
      success: true,
      user: {
        _id,
        username,
        add_username,
        display_name,
        email,
        birthdate,
        gender,
        bio,
        user_id: gen_id
      },
      errors: []
    };
  } catch (err) {
    return ErrorHandler.SomethingWrong;
  }
};

// User Profile by Username
const userProfile = async (_: any, { username }: Username, context: any) => {
  try {
    const userData: any = await UserModel.findOne({ username });

    if (userData) {
      return {
        success: true,
        user: {
          username: userData.username,
          display_name: userData.display_name,
          bio: userData.bio
        },
        errors: []
      };
    } else {
      return { success: true, user: null, errors: [] };
    }
  } catch (err) {
    return ErrorHandler.SomethingWrong;
  }
};

export { myProfile, userProfile };
