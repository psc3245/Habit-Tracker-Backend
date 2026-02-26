import * as userService from "../Services/user-service.js";

export async function signUp(req, res) {
  try {
    const data = userService.signUpSchema.parse(req.body);
    const user = await userService.signUp(data);
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function login(req, res) {
  try {
    const data = userService.loginSchema.parse(req.body);
    const user = await userService.login(data);
    res.status(200).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findAllUsersOrByUsername(req, res) {
  try {
    const { username } = req.query;

    const users = username
      ? await userService.findByUsername(username)
      : await userService.findAll();

    res.json(users);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findUserById(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const user = await userService.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateUser(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const data = userService.updateUserSchema.parse(req.body);
    const updated = await userService.updateUser(id, data);

    if (!updated) {
      return res.status(404).json({ error: "User not found" });
    }

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteUser(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await userService.deleteUser(id);

    if (!deleted) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(204).send();
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findUserHabits(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const habits = await userService.findHabitsByUserId(id);
    res.json(habits);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
