import Logo from './Logo';

const Loader = () => {
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-slate-50 dark:bg-slate-900 transition-colors">
      <div className="relative">
        <div className="w-16 h-16 rounded-full border-4 border-slate-200 dark:border-slate-700 border-t-primary-500 animate-spin" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full gradient-primary opacity-20 animate-pulse" />
        </div>
      </div>
      <div className="mt-6">
        <Logo className="text-3xl" />
      </div>
      <p className="mt-3 text-sm text-slate-500 dark:text-slate-400 animate-pulse-slow">
        Loading...
      </p>
    </div>
  );
};

export const InlineLoader = ({ size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
  };

  return (
    <div className={`flex items-center justify-center py-8 ${className}`}>
      <div
        className={`${sizeClasses[size]} rounded-full border-slate-200 dark:border-slate-700 border-t-primary-500 animate-spin`}
      />
    </div>
  );
};

Loader.Inline = InlineLoader;

export default Loader;

