const express = require("express");
const Job = require("../models/job");

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const jobs = await Job.find().sort({ createdAt: -1 });
    res.json(jobs);
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Failed to load job postings" });
  }
});

router.post("/", async (req, res) => {
  const { title, department, description = "" } = req.body || {};

  if (!title?.trim() || !department?.trim()) {
    return res
      .status(400)
      .json({ message: "Title and Department must not be empty" });
  }

  try {
    const job = await Job.create({
      title: title.trim(),
      department: department.trim(),
      description,
    });
    res.status(201).json(job);
  } catch (error) {
    console.error("Error creating job:", error);
    res.status(500).json({ message: "Failed to create job posting" });
  }
});

module.exports = router;
