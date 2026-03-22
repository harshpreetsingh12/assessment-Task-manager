'use client';

import { useState, useEffect } from 'react';
import { taskService } from '@/services/task.service';
import { showToast } from '@/lib/toast';
import { CreateTaskDTO, ITask } from '@/models/Task.model';

interface Props {
  onClose: () => void;
  onSuccess: () => void;
  initialData?: ITask | null;
  isEditMode?: boolean;
}

export default function CreateEditTaskModal({ onClose, onSuccess,initialData,isEditMode=false }: Props) {
  const [formData, setFormData] = useState<CreateTaskDTO>({
    title: initialData?.title || '',
    description: initialData?.description || '',
    priority: initialData?.priority || 'medium',
    taskDate:initialData?.taskDate ? new Date(initialData?.taskDate).toISOString().split('T')[0] : new Date().toISOString().split('T')[0],
  });
  const [loading, setLoading] = useState(false);

  // Close on Escape key
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.title.length < 3) {
      return showToast.error("Invalid Input", "Title must be at least 3 characters.");
    }

    setLoading(true);
    if(isEditMode){
      try {
        if(!initialData) {
          showToast.success("Error", "Failed to update task. Try again.");
          return
        } 
        await taskService.updateTask(initialData?._id, formData);
        showToast.success("Task Updated", "Your focus list has been updated.");
        onSuccess(); // Triggers the refetch in Dashboard
      } catch (err) {
        showToast.error("Error", "Failed to save task. Try again.");
      } finally {
        setLoading(false);
      }
    }
    else{
      try {
        await taskService.createTask(formData);
        showToast.success("Task Created", "Your focus list has been updated.");
        onSuccess(); // Triggers the refetch in Dashboard
      } catch (err) {
        showToast.error("Error", "Failed to save task. Try again.");
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="relative w-full max-w-lg bg-zinc-950 border border-zinc-800 rounded-3xl p-8 shadow-2xl shadow-purple-500/10 scale-in-center">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">New Task</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Task Title</label>
            <input
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Finish Rubico Assignment"
              className="w-full mt-1 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all"
            />
          </div>

          <div>
            <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Description</label>
            <textarea
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="What needs to be done?"
              className="w-full mt-1 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Priority</label>
              <select
                value={formData.priority}
                onChange={(e) => setFormData({ ...formData, priority: e.target.value as CreateTaskDTO["priority"] })}
                className="w-full mt-1 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 appearance-none cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-zinc-500 uppercase ml-1">Task Date</label>
              <input
                type="date"
                value={formData.taskDate}
                onChange={(e) => setFormData({ ...formData, taskDate: e.target.value })}
                className="w-full mt-1 p-4 bg-zinc-900 border border-zinc-800 rounded-2xl outline-none focus:ring-2 focus:ring-purple-600 cursor-pointer"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 bg-purple-600 hover:bg-purple-700 text-white rounded-2xl font-bold transition-all transform active:scale-[0.98] disabled:opacity-50 shadow-lg shadow-purple-600/20"
          >
            {loading ? "Saving..." : isEditMode ? "Edit Task": "Create Task"}
          </button>
        </form>
      </div>
    </div>
  );
}