import { Response } from 'express';
import Task from '../models/Task.model';
import mongoose from 'mongoose';
import { aiService } from '../services/ai.service';

// create a New Task
export const createTask = async (req: any, res: Response) => {
  try {
    const { title, description, priority, taskDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const neutralDate= new Date(taskDate);
    neutralDate.setUTCHours(0, 0, 0, 0);

    const task = await Task.create({
      userId: req.user.id, // Attached by auth middleware
      title,
      description,
      priority,
      taskDate:neutralDate,
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get All User Tasks
export const getTasks = async (req: any, res: Response) => {
  try {
    const { date } = req.query; // Expecting "2026-03-21"
    
    if (!date) {
      return res.status(400).json({ message: "Date parameter is required" });
    }

    const queryDate = new Date(date as string);
    queryDate.setUTCHours(0, 0, 0, 0);

    const tasks = await Task.find({
      userId: req.user.id,
      taskDate: queryDate
    }).sort({ createdAt: -1 }); 

    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

// Delete a Task
export const deleteTask = async (req: any, res: Response) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) { // checking id is mongoose object id valid
      return res.status(400).json({ message: "Invalid task ID" });
    }
    // Ensure the taskbelongs to the user before deleting
    const task = await Task.findOneAndDelete({ _id: id, userId: req.user.id });

    if (!task) {
      return res.status(404).json({ message: 'Task not found or unauthorized' });
    }

    res.json({ message: 'Task removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting task' });
  }
};

export const getAiSummary = async (req: any, res: Response) => {
  try {

    const { date } = req.query; // date to generate summary for

    const today = new Date(date);
    today.setUTCHours(0, 0, 0, 0);

    // Fetch only tasks for today that aren't completed yet
    const tasks = await Task.find({ 
      userId: req.user.id, 
      taskDate: today,
      status: { $ne: 'completed' } 
    });

    if (tasks.length === 0) {
      return  res.status(200).json({ 
        summary: "You have no pending tasks for today. Enjoy your day!",
      });
    }

    // Delegate to the Service
    const summary = await aiService.generateDailyBriefing(tasks);

    // Send Response
    res.json({ summary });

  } catch (error) {
    // Graceful Failure Handling)
    console.log(error)
    res.status(200).json({ 
      summary: "I couldn't generate your AI briefing right now, but don't let that stop you! You have tasks to complete.",
      error: true 
    });
  }
};