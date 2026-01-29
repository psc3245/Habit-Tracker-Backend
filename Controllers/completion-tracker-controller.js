import * as completionTrackerService from "../Services/completion-tracker-service.js";

export async function createCompletionTracker(req, res) {
  try {
    const data = completionTrackerService.createCompletionSchema.parse(
      req.body
    );
    const completion = await completionTrackerService.createCompletion(data);
    res.status(201).json(completion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findAllCompletions(req, res) {
  try {
    const completions = await completionTrackerService.findAllCompletions();
    res.json(completions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findCompletionById(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const completion = await completionTrackerService.findCompletionById(id);

    if (!completion) {
      return res.status(404).json({ error: "Completion not found" });
    }

    res.json(completion);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findCompletionsByUserAndDate(req, res) {
  try {
    const { userId, date } = req.query;

    if (!userId || !date) {
      return res.status(400).json({ error: "userId and date required" });
    }

    const completions =
      await completionTrackerService.findCompletionsByUserAndDate(userId, date);
    res.json(completions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function findCompletionsByHabit(req, res) {
  try {
    const { habitId } = req.query;

    if (!habitId) {
      return res.status(400).json({ error: "habitId required" });
    }

    const completions = await completionTrackerService.findCompletionsByHabit(
      habitId
    );
    res.json(completions);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
export async function updateCompletion(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const data = completionTrackerService.updateCompletionSchema.parse(
      req.body
    );
    const updated = await completionTrackerService.updateCompletion(id, data);

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function deleteCompletion(req, res) {
  try {
    const id = Number(req.params.id);

    if (Number.isNaN(id)) {
      return res.status(400).json({ error: "Invalid id" });
    }

    const deleted = await completionTrackerService.deleteCompletion(id);

    if (!deleted) {
      return res.status(404).json({ error: "Completion not found" });
    }
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}
