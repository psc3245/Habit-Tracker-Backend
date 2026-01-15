import * as z from "zod";
import * as userRepo from "../Repositories/user-repo.js";

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string(),
  pass: z.string(),
  dob: z.coerce.date(),
});

export async function createUser({ email, username, pass, dob }) {
  if (!email) {
    throw new Error("Email required");
  }

  return userRepo.create({
    email,
    username,
    pass,
    dob,
  });
}

export async function findUserById(id) {
  if (!id) {
    throw new Error("ID required");
  }

  return userRepo.findById(id);
}
