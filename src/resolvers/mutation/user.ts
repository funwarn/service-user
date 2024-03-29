/* Mutation - User Resolver */
// Models
import UserModel from "../../models/user";

// Helpers
import AuthHelper from "../../helpers/auth";
import * as ErrorHandler from "../../helpers/errors/english.json";

interface InputInterface {
  input: {
    username: string;
    display_name: string;
    birthdate: string;
    gender: string;
    bio: string;
  };
}

interface BodyDataInterface {
  display_name?: string;
  birthdate?: string;
  gender?: string;
  bio?: string;
}

// Update User Profile
const updateMyProfile = async (
  _: any,
  { input }: InputInterface,
  context: any
) => {
  try {
    // Authentication User
    const userData = await AuthHelper(context);
    if (!userData) {
      return ErrorHandler.InvalidToken;
    }

    // User Data
    const { _id } = userData;

    // Inputs
    const { display_name, birthdate, gender, bio } = input;

    // Update specified data
    let bodyData: BodyDataInterface = {};
    if (display_name) {
      bodyData.display_name = display_name;
    }
    if (birthdate) {
      bodyData.birthdate = birthdate;
    }
    if (gender) {
      bodyData.gender = gender;
    }
    if (bio) {
      bodyData.bio = bio;
    }

    // Update User Data
    const userDataUpdated: any = await UserModel.findOneAndUpdate(
      { _id },
      { $set: bodyData },
      { new: true }
    );

    return {
      success: true,
      user: {
        _id: userDataUpdated._id,
        user_id: userDataUpdated.gen_id,
        display_name: userDataUpdated.display_name,
        birthdate: userDataUpdated.birthdate,
        gender: userDataUpdated.gender,
        bio: userDataUpdated.bio
      },
      errors: []
    };
  } catch (err) {
    return ErrorHandler.SomethingWrong;
  }
};

// Update Username
const updateUsername = async (
  _: any,
  { input }: InputInterface,
  context: any
) => {
  try {
    // Authentication User
    const userData = await AuthHelper(context);
    if (!userData) {
      return ErrorHandler.InvalidToken;
    }

    // User Data
    const { _id } = userData;

    // Inputs
    const { username } = input;

    // Check if that username already exists or not
    const usernameData = await UserModel.findOne({ username });
    if (!usernameData) {
      // Update User Data
      const userDataUpdated: any = await UserModel.findOneAndUpdate(
        { _id },
        { $set: { username } },
        { new: true }
      );

      return {
        success: true,
        user: {
          _id: userDataUpdated._id,
          user_id: userDataUpdated.gen_id,
          username: userDataUpdated.username
        },
        errors: []
      };
    } else {
      return ErrorHandler.UsernameAlreadyExists;
    }
  } catch (err) {
    return ErrorHandler.SomethingWrong;
  }
};

export { updateMyProfile, updateUsername };
