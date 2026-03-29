import * as settingsService from "../Services/settings-service.js";

export async function getSettingsForUserId(req, res) {
  try {
    const { id } = req.params;
    const settings = await settingsService.getSettingsForUserId(id);
    if (!settings) {
      return res.status(404).json({ error: "Settings not found" });
    }
    res.json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function createSettings(req, res) {
  try {
    const { id } = req.params;
    const settings = await settingsService.createSettings(id);
    res.status(201).json(settings);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}

export async function updateSettings(req, res) {
  try {
    const { id } = req.params;
    const data = settingsService.settingsSchema.parse(req.body);
    const updated = await settingsService.updateSettings(id, data);
    if (!updated) {
      return res.status(404).json({ error: "Settings not found" });
    }
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
}