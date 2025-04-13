import { User } from "../database/db.js";

export const doesUserExists = async (username) => {
  return await User.findOne({ username });
};
