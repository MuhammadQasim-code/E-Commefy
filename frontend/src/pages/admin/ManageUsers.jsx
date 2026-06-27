import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAllUsers, updateUserRole, deleteUser } from '../../features/users/userSlice';
import DataTable from '../../components/admin/DataTable';
import formatDate from '../../utils/formatDate';
import toast from 'react-hot-toast';
import { HiTrash, HiUserCircle } from 'react-icons/hi2';

const ManageUsers = () => {
  const dispatch = useDispatch();
  const { users, loading } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);

  const [updatingId, setUpdatingId] = useState(null);

  useEffect(() => {
    dispatch(fetchAllUsers({ limit: 100 }));
  }, [dispatch]);

  const handleRoleChange = async (id, role) => {
    if (id === currentUser?._id) {
      toast.error("You cannot change your own admin role.");
      return;
    }
    setUpdatingId(id);
    try {
      await dispatch(updateUserRole({ id, role })).unwrap();
      toast.success('User role updated successfully');
      dispatch(fetchAllUsers({ limit: 100 }));
    } catch (err) {
      toast.error(err.message || 'Failed to update role');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDelete = async (id) => {
    if (id === currentUser?._id) {
      toast.error("You cannot delete yourself.");
      return;
    }
    if (!window.confirm('Are you sure you want to delete this user? This cannot be undone.')) return;

    try {
      await dispatch(deleteUser(id)).unwrap();
      toast.success('User deleted successfully');
      dispatch(fetchAllUsers({ limit: 100 }));
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    }
  };

  const columns = [
    {
      header: 'Avatar',
      render: (row) => (
        <div className="w-9 h-9 rounded-full gradient-primary flex items-center justify-center text-white font-bold uppercase text-xs">
          {row.name?.substring(0, 2) || 'US'}
        </div>
      ),
    },
    {
      header: 'Name',
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.name}</span>,
    },
    {
      header: 'Email',
      accessor: 'email',
    },
    {
      header: 'Joined',
      render: (row) => <span>{formatDate(row.createdAt)}</span>,
    },
    {
      header: 'Role',
      render: (row) => {
        const isCurrentUpdating = updatingId === row._id;
        return (
          <select
            value={row.role}
            disabled={isCurrentUpdating || row._id === currentUser?._id}
            onChange={(e) => handleRoleChange(row._id, e.target.value)}
            className={`px-3 py-1.5 rounded-xl border text-xs font-bold ${
              row.role === 'admin'
                ? 'bg-indigo-500/10 text-indigo-650 border-indigo-500/20'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-600 border-slate-200'
            } focus:outline-none cursor-pointer disabled:opacity-50`}
          >
            <option value="customer">Customer</option>
            <option value="admin">Admin</option>
          </select>
        );
      },
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          User Management
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          Review details and control user access roles
        </p>
      </div>

      <DataTable
        columns={columns}
        data={users}
        loading={loading}
        renderRowActions={(row) => (
          <button
            onClick={() => handleDelete(row._id)}
            disabled={row._id === currentUser?._id}
            className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
            title="Delete User"
          >
            <HiTrash className="w-4 h-4" />
          </button>
        )}
      />
    </div>
  );
};

export default ManageUsers;
