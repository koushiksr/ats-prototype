import { User } from "../models/user";

export async function getAllRecuitersService() {
  const users = await User.find({ role: "Recruiter" });
  return users;
}
export async function getCandidatService(id) {
  const users = await User.findOne({ _id: id });
  return users;
}
