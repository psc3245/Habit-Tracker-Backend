import * as z from "zod";
import * as userRepo from "../Repositories/user-repo.js";
import * as habitRepo from "../Repositories/habit-repo.js";

export const signUpSchema = z.object({
  email: z.email(),
  username: z.string(),
  pass: z.string(),
  dob: z.coerce.date(),
});

export const loginSchema = z
  .object({
    email: z.string().email().optional(),
    username: z.string().optional(),
    pass: z.string(),
  })
  .refine((data) => data.email || data.username, {
    message: "Must provide email or username",
  });

export const findUserSchema = z
  .object({
    id: z.string().optional(),
    username: z.string().optional(),
  })
  .refine((data) => data.id || data.username, {
    message: "Must provide id or username",
  });

export const updateUserSchema = z
  .object({
    email: z.email().optional(),
    username: z.string().optional(),
    pass: z.string().optional(),
    dob: z.coerce.date().optional(),
  })
  .refine((data) => data.email || data.username || data.pass || data.dob, {
    message: "Must provide at least one field besides id",
  });

export async function signUp({ email, username, pass, dob }) {
  if (!email) throw new Error("email required");

  const res = await userRepo.signUp({ email, username, password: pass, dateOfBirth: dob });
  if (!res) throw new Error("Signup attempt failed");

  return res;
}

export async function login({ email, username, pass }) {
  if (!email && !username) throw new Error("email or username required");
  let user;
  if (!username) {
    user = await userRepo.findByEmail(email);
  }
  if (!email) {
    user = await userRepo.findByUsername(username);
  }
  if (!user || user.password != pass) throw new Error("Login attempt failed");

  return user;
}

export async function findAll() {
  return await userRepo.findAll();
}

export async function findById(id) {
  if (!id) throw new Error("id required");
  return await userRepo.findById(id);
}

export async function findByUsername(username) {
  if (!username) throw new Error("username required");
  return await userRepo.findByUsername(username);
}

export async function updateUser(id, updates) {
  if (!id) throw new Error("id required");
  return await userRepo.update(id, updates);
}

export async function deleteUser(id) {
  if (!id) throw new Error("id required");
  return await userRepo.remove(id);
}

export async function findHabitsByUserId(userId) {
  if (!userId) throw new Error("userId required");
  return await habitRepo.findByUserId(userId);
}