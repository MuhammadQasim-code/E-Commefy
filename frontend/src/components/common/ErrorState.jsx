import { HiExclamationTriangle } from 'react-icons/hi2';

const ErrorState = ({
  message = 'Something went wrong',
  onRetry,
  className = '',
}) => {
  return (
    <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
      <div className="w-20 h-20 rounded-full bg-red-50 dark:bg-red-900/20 flex items-center justify-center mb-6">
        <HiExclamationTriangle className="w-10 h-10 text-red-500" />
      </div>
      <h3 className="text-xl font-semibold text-slate-700 dark:text-slate-200 mb-2">
        Oops!
      </h3>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-6">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary-500 to-accent-500 text-white font-medium hover:shadow-lg hover:shadow-primary-500/25 transition-all duration-300 hover:-translate-y-0.5"
        >
          Try Again
        </button>
      )}
    </div>
  );
};

export default ErrorState;
