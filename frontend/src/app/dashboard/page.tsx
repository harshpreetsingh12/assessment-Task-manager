'use client';

import { useState, useEffect, useRef } from 'react';
import { format } from 'date-fns';
import { taskService } from '@/services/task.service';
import { showToast } from '@/lib/toast';
import TaskCard from '@/components/TaskCard';
import CreateTaskModal from '@/components/CreateTaskModal';
import AISummary from '@/components/AISummary';
import { useAuth } from '@/context/Auth.Context';

export default function Dashboard() {
    const { user, loading: authLoading,logout } = useAuth();

    const [tasks, setTasks] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [loading, setLoading] = useState(true);
    const isFirstRender = useRef(true);

    const fetchTasks = async () => {
        setLoading(true);
        try {
            const formattedDate = format(selectedDate, 'yyyy-MM-dd');
            const response = await taskService.getTasks(formattedDate);
            if(response.ok){
                setTasks(response.data);
            }
        } catch (err) {
            showToast.error('Fetch Failed', 'Could not load your tasks.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        // first render — fetch immediately, no debounce
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchTasks();
            return;
        }

        // after first  changes — debounce
        const timer = setTimeout(() => {
            fetchTasks();
        }, 500);

        return () => clearTimeout(timer);
    }, [selectedDate]);

    const handleDelete = async (id: string) => {
        try {
        await taskService.deleteTask(id);
        setTasks(tasks.filter((t: any) => t._id !== id));
        showToast.success('Task Deleted');
        } catch (err) {
        showToast.error('Error', 'Failed to delete task');
        }
    };

    const handleDate=(e: React.ChangeEvent<HTMLInputElement>)=>{
         if (!e.target.value) return;
         const parsed = new Date(e.target.value + "T00:00:00"); // force local time
         if (!isNaN(parsed.getTime())) {
           // only set if valid date
           setSelectedDate(parsed);
         }
    }

    return (
        <div className="w-4xl max-w-5xl mx-auto space-y-8 mt-5">
        {/* Header & AI Summary */}
        <section>
            <div className='flex justify-between items-center mb-6'>
            <h1 className="text-2xl font-bold capitalize">Welcome back, {user?.name ?? ""}✨</h1>

            <button onClick={logout}
                className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20 cursor-pointer"
                >
                Logout
            </button>
            </div>
            <AISummary />
        </section>

        {/*  Filter & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800">
            <div className="flex flex-col gap-1">
            <label className="text-xs text-zinc-500 font-medium">Filter by Date</label>
            <input 
                type="date" 
                value={selectedDate && !isNaN(selectedDate.getTime()) ? format(selectedDate, 'yyyy-MM-dd'): ''}
                onChange={handleDate}
                className="bg-[#2a2828] cursor-pointer border border-zinc-700 rounded-lg p-2 text-sm outline-none focus:ring-2 focus:ring-purple-500"
            />
            </div>
            
            <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-3 rounded-xl font-bold transition-all shadow-lg shadow-purple-600/20"
            >
            + Create New Task
            </button>
        </div>

        {/* Task List */}
        <div className="grid gap-4">
            {loading ? (
                <div className="text-center py-20 text-zinc-500">Loading your focus list...</div>
            ) : tasks.length > 0 ? (
            tasks.map((task: any) => (
                <TaskCard key={task._id} task={task} onDelete={handleDelete} />
            ))
            ) : (
            <div className="text-center py-20 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-zinc-500">
                No tasks found for this date. Time to relax! ☕
            </div>
            )}
        </div>

        {/* Modal Popup */}
        {isModalOpen && (
            <CreateTaskModal 
                onClose={() => setIsModalOpen(false)} 
                onSuccess={() => {
                    setIsModalOpen(false);
                    fetchTasks();
                }} 
            />
        )}
        </div>
    );
}