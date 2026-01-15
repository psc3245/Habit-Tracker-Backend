import * as z from "zod";
import * as userRepo from "../Repositories/user-repo.js";

export const createUserSchema = z.object({
  email: z.email(),
  username: z.string(),
  pass: z.string(),
  dob: z.coerce.date(),
});

export const findUserSchema = z
  .object({
    id: z.number().optional(),
    username: z.string().optional(),
  })
  .refine(
    data => data.id || data.username,
    { message: "Must provide id or username" }
  );

export async function createUser({ email, username, pass, dob,  }) {
  if (!email) {
    throw new Error("email required");
  }

  return userRepo.create({
    email,
    username,
    pass,
    dob,
  });
}

export async function findAll() {
  return userRepo.findAll();
}

export async function findById(id) {
  if (!id) {
    throw new Error("id required");
  }

  return userRepo.findById(id);
}

export async function findByUsername(username) {
  if (!username) {
    throw new Error("username required");
  }

  return userRepo.findByUsername(username);
}
