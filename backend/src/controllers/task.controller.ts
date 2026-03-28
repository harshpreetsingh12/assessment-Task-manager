import { Request, Response } from 'express';
import Task, { ITask } from '../models/Task.model';
import mongoose from 'mongoose';
import { aiService } from '../services/ai.service';

// create a New Task
export const createTask = async (req: Request, res: Response) => {
  try {
    const { title, description, priority, taskDate } = req.body;

    if (!title) {
      return res.status(400).json({ message: 'Title is required' });
    }

    const neutralDate= new Date(taskDate);
    neutralDate.setUTCHours(0, 0, 0, 0);

    const textToEmbed = `${title} ${description || ""}`;
    const embedding = await aiService.generateEmbedding(textToEmbed);

    const task = await Task.create({
      userId: req.user.id, // Attached by auth middleware
      title,
      description,
      priority,
      taskDate:neutralDate,
      description_vector:embedding
    });

    res.status(201).json(task);
  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error creating task' });
  }
};

// Get All User Tasks
export const getTasks = async (req: Request, res: Response) => {
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

// Update Task details
export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body; 

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid task ID" });
    }

    if(updates?.title || updates?.description){
      const {title,description}=updates
      const textToEmbed = `${title} ${description || ""}`;
      const embedding = await aiService.generateEmbedding(textToEmbed);
      if(embedding){
        updates.description_vector=embedding
      }
    }

    const task = await Task.findOneAndUpdate(
      { _id: id, userId: req.user.id },
      { $set: updates },
      { new: true } 
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.json(task);
  } catch (error) {
    res.status(500).json({ message: "Error updating task" });
  }
};

// Delete a Task
export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (typeof id !== "string" || !mongoose.Types.ObjectId.isValid(id)) { // checking id is mongoose object id valid
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

export const getAiSummary = async (req: Request, res: Response) => {
  try {

    const { date } = req.query; // date to generate summary for

    if (typeof date !== "string") {
      return res.status(400).json({ 
        summary: "",
        message:'Invalid date object',
        error: true 
      });
    }
    const today = new Date(date);
    today.setUTCHours(0, 0, 0, 0);

    // Fetch only tasks for today that aren't completed yet
    const tasks = await Task.find({ 
      userId: req.user.id, 
      taskDate: today,
      status: { $ne: 'completed' } 
    });

    // if (tasks.length === 0) { // commented this as fallback will handle 
    //   return  res.status(200).json({ 
    //     summary: "You have no pending tasks for today. Enjoy your day!",
    //   });
    // }
    
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        await aiService.streamDailyBriefing(tasks, (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`); 
        });
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`); // signal end
    } catch (err) {
      console.log(err)
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    } finally {
        res.end();
    }

  } catch (error) {
    // Graceful Failure Handling)
    console.log(error)
    res.status(200).json({ 
      summary: "I couldn't generate your AI briefing right now, but don't let that stop you! You have tasks to complete.",
      error: true 
    });
  }
};

export const taskChat = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    const searchResults=await chatWithTasks(question,req.user.id)

    if(!searchResults || !Array.isArray(searchResults)){
      return res.status(400).json({
        result:searchResults,
        message: 'Task search failed'
      });
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.flushHeaders();

    try {
        await aiService.streamChatResponse(question,searchResults, (chunk) => {
          res.write(`data: ${JSON.stringify({ chunk })}\n\n`); 
        });
        res.write(`data: ${JSON.stringify({ done: true })}\n\n`); // signal end
    } catch (err) {
      console.log(err)
        res.write(`data: ${JSON.stringify({ error: "Stream failed" })}\n\n`);
    } finally {
        res.end();
    }

  } catch (error) {
    console.log(error)
    res.status(500).json({ message: 'Error searching task' });
  }
};

async function chatWithTasks(userQuestion:string,userId:string):Promise<ITask[]> {
  try {
    // 1. Convert the user's question into a vector using your Python Service
    const queryVector = await aiService.generateEmbedding(userQuestion);

    // 2. Perform the Vector Search in MongoDB
    const results = await Task.aggregate([
      {
        "$vectorSearch": {
          "index": "task_search",
          "path": "description_vector",  
          "queryVector": queryVector,
          "numCandidates":100,     // Internal pool to search from
          "limit": 5 ,
          "filter": { "userId": { "$eq": new mongoose.Types.ObjectId(userId) } }
        }
      },
      {
        "$project": {
          "title": 1,
          "description": 1,
          "status": 1,
          "score": { "$meta": "vectorSearchScore" } 
        }
      }
    ]);

    return results;
  } catch (error) {
    console.error("Vector Search failed:", error);
    throw error;
  }
}


export const taskChatSearchTester = async (req: Request, res: Response) => {
  try {
    const { question } = req.body;

    const searchResults=await chatWithTasks(question,req.user.id)
    res.json(searchResults);
  }
  catch(e){
    console.log(e)
  }
}
