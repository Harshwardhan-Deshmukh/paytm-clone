import { User } from "../database/db.js";

export const doesUserExists = async (username) => {
  const user = await User.findOne({ username });
  return user;
};
