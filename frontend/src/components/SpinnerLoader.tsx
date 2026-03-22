interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export default function Spinner({ size = 'md', color = 'border-blue-500' }: SpinnerProps) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  };

  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div
        className={`
          ${sizeClasses[size]} 
          ${color} 
          animate-spin 
          rounded-full 
          border-t-transparent 
          border-solid
        `}
      />
    </div>
  );
}