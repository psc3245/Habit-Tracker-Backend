import * as userService from "../Services/user.service.js";
import { createUserSchema } from "../Services/user.service.js";

export async function createUserController(req, res) {
  try {
    // Validate + coerce input
    const data = createUserSchema.parse(req.body);

    const user = await userService.createUser(data);

    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}