import { Toaster } from 'react-hot-toast';
import useTheme from '../../hooks/useTheme';

const Toast = () => {
  const { isDark } = useTheme();

  return (
    <Toaster
      position="top-right"
      gutter={12}
      containerStyle={{ margin: '8px' }}
      toastOptions={{
        duration: 4000,
        style: {
          background: isDark ? '#1E293B' : '#FFFFFF',
          color: isDark ? '#F1F5F9' : '#0F172A',
          border: isDark ? '1px solid rgba(148, 163, 184, 0.1)' : '1px solid rgba(0,0,0,0.05)',
          padding: '14px 20px',
          borderRadius: '16px',
          fontSize: '14px',
          fontWeight: '500',
          boxShadow: isDark
            ? '0 20px 25px -5px rgba(0, 0, 0, 0.4)'
            : '0 20px 25px -5px rgba(0, 0, 0, 0.1)',
          backdropFilter: 'blur(12px)',
        },
        success: {
          iconTheme: {
            primary: '#10B981',
            secondary: isDark ? '#1E293B' : '#FFFFFF',
          },
        },
        error: {
          iconTheme: {
            primary: '#EF4444',
            secondary: isDark ? '#1E293B' : '#FFFFFF',
          },
        },
      }}
    />
  );
};

export default Toast;
