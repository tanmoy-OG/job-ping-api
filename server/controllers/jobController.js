import Job from '../models/jobs.js';
import User from '../models/user.js';
import { sendJobNotification } from '../utils/mailer.js';

// Post a new job
export const postJob = async (req, res) => {
  // ... (create a new job and save it to the database)
  try {
    const { title, description, experienceLevel, endDate, candidates } = req.body;
    const userId = req.user._id;

    // Create a new job post
    const newJob = new Job({
      title,
      description,
      experienceLevel,
      endDate,
      candidates,
      createdBy: userId,
    });

    await newJob.save();

    const jobDetails = {
      title,
      description,
      experienceLevel,
      endDate,
    };

    // Send job details to candidates
    await sendJobNotification(candidates, jobDetails);

    res.status(201).json({ message: 'Job posted successfully and update sent to candidates', job: newJob });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};
