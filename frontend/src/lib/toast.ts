import { toast } from 'sonner';

export const showToast = {
  success: (title: string, description?: string) => {
    toast.success(title, {
      description,
      className: 'bg-zinc-900 border-zinc-800 text-white rounded-2xl p-4',
      descriptionClassName: 'text-zinc-400 text-xs',
    });
  },

  error: (title: string, description?: string,id?:string) => {
    toast.error(title, {
      description,
    //   className: 'bg-zinc-900 border-red-900/50 text-white rounded-2xl p-4',
      descriptionClassName: 'text-red-400/80 text-xs',
      ...(id? {id}:{})
    });
  },

  info: (title: string, description?: string) => {
    toast(title, {
      description,
      className: 'bg-zinc-900 border-purple-800/50 text-white rounded-2xl p-4',
      descriptionClassName: 'text-purple-300/70 text-xs',
    });
  },
  
  // Custom "AI Briefing" Toast
  ai: (title: string, description?: string) => {
    toast(title, {
      description,
      icon: '✨',
      className: 'bg-black border-purple-600/50 text-white rounded-2xl p-4 shadow-[0_0_20px_rgba(147,51,234,0.2)]',
      descriptionClassName: 'text-zinc-300 italic text-xs',
    });
  },
  promise: (promise: Promise<any>, { loading, success, error }: { loading: string; success: string; error: string }) => {
    return toast.promise(promise, {
      loading,
      success,
      error,
      className: 'bg-zinc-900 border-zinc-800 text-white rounded-2xl p-4',
      descriptionClassName: 'text-zinc-400 text-xs',
    });
  },
};