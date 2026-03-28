import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description?: string;
  priority: 'low' | 'medium' | 'high';
  status: 'pending' | 'completed';
  taskDate: Date;
  description_vector:[Number]
}

const taskSchema = new Schema<ITask>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    status: {
      type: String,
      enum: ['pending','progress', 'completed'],
      default: 'pending',
    },
    taskDate: { type: Date }, 
    description_vector: {
      type: [Number],
      default: [],
    }
  },
  { timestamps: true }
);

taskSchema.index({ userId: 1, taskDate: 1 });
taskSchema.index({ status: 1 }); // for getting task with status primarily

const Task = mongoose.model<ITask>('Task', taskSchema);
export default Task;