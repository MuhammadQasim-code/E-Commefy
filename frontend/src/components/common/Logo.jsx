import { Link } from 'react-router-dom';

const Logo = ({ className = '' }) => {
  return (
    <Link to="/" className={`group flex items-center gap-0.5 font-bold text-2xl select-none ${className}`}>
      <span className="gradient-text tracking-tight">EC</span>
      <span className="text-accent-500 dark:text-accent-400 group-hover:scale-110 transition-transform duration-300">o</span>
    </Link>
  );
};

export default Logo;
