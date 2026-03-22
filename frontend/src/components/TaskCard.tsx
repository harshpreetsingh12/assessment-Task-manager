type Priority = "high" | "medium" | "low";
import { ITask } from "@/models/Task.model";

export default function TaskCard(
  { task, onDelete,onEdit } : 
  { task: ITask, onDelete: (id: string) => void, onEdit:(task:ITask)=>void }
) {
  const priorityColors: Record<Priority, string> = {
    high: 'border-red-500/50 bg-red-500/5 text-red-400',
    medium: 'border-orange-500/50 bg-orange-500/5 text-orange-400',
    low: 'border-blue-500/50 bg-blue-500/5 text-blue-400',
  };

  return (
    <div className="group relative flex items-center justify-between p-6 bg-zinc-900/50 border border-zinc-800 rounded-2xl backdrop-blur-sm hover:border-purple-500/50 transition-all">
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span className={`text-[10px] uppercase font-bold px-2 py-1 rounded-md border ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
          <h3 className="text-lg font-semibold text-zinc-100">{task.title}</h3>
        </div>
        <p className="text-sm text-zinc-400 max-w-md">{task.description}</p>
      </div>

    <div>
        <button 
          onClick={() => onEdit(task)}
          className="opacity-0 group-hover:opacity-100 p-3 bg-purple-500/10 ring-purple-600 rounded-xl hover:bg-purple-600 hover:text-white transition-all mr-5 cursor-pointer"
          >
          ✏️ 
        </button>

        <button 
          onClick={() => onDelete(task._id)}
          className="opacity-0 group-hover:opacity-100 p-3 bg-red-500/10 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all cursor-pointer"
          >
          🗑️ 
      </button>
        </div>
    </div>
  );
}