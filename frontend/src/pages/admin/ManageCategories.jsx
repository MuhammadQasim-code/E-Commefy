import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../../features/categories/categorySlice';
import DataTable from '../../components/admin/DataTable';
import Modal from '../../components/common/Modal';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi2';

const ManageCategories = () => {
  const dispatch = useDispatch();
  const { categories, loading } = useSelector((state) => state.categories);

  const [modalOpen, setModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '',
  });

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const handleOpenAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '', description: '', image: '' });
    setModalOpen(true);
  };

  const handleOpenEdit = (category) => {
    setEditingCategory(category);
    setFormData({
      name: category.name || '',
      description: category.description || '',
      image: category.image || '',
    });
    setModalOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Category name is required');
      return;
    }

    setSubmitting(true);
    try {
      if (editingCategory) {
        // Edit category
        await dispatch(
          updateCategory({ id: editingCategory._id, categoryData: formData })
        ).unwrap();
        toast.success('Category updated successfully');
      } else {
        // Create category
        await dispatch(createCategory(formData)).unwrap();
        toast.success('Category created successfully');
      }
      setModalOpen(false);
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;
    try {
      await dispatch(deleteCategory(id)).unwrap();
      toast.success('Category deleted successfully');
      dispatch(fetchCategories());
    } catch (err) {
      toast.error(err.message || 'Failed to delete. Make sure no products belong to it.');
    }
  };

  const columns = [
    {
      header: 'Image',
      render: (row) => {
        const getImgUrl = () => {
          if (!row.image) return 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100';
          if (row.image.startsWith('http')) return row.image;
          const normalizedPath = row.image.startsWith('/') ? row.image : `/${row.image}`;
          return `http://localhost:5000${normalizedPath}`;
        };
        const img = getImgUrl();
        return (
          <img
            src={img}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover bg-slate-50 border border-slate-100 dark:border-slate-800"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=100';
            }}
          />
        );
      },
    },
    {
      header: 'Name',
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200 capitalize">{row.name}</span>,
    },
    {
      header: 'Slug',
      accessor: 'slug',
    },
    {
      header: 'Description',
      accessor: 'description',
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Category Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Group catalog products by categories
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-5 py-3 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add New Category</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={categories}
        loading={loading}
        renderRowActions={(row) => (
          <>
            <button
              onClick={() => handleOpenEdit(row)}
              className="p-2 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-colors"
              title="Edit Category"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete Category"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </>
        )}
      />

      {/* Add / Edit modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingCategory ? 'Edit Category' : 'Create Category'}
      >
        <form onSubmit={handleSubmit} className="space-y-5 py-2">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Category Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Electronics"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Image URL
            </label>
            <input
              type="text"
              name="image"
              value={formData.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/photo-..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="3"
              placeholder="Brief description of the category..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-250 focus:outline-none focus:ring-4 focus:ring-primary-500/20 resize-none"
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              className="px-5 py-2.5 rounded-xl border border-slate-350 dark:border-slate-700 text-slate-650 dark:text-slate-350 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-5 py-2.5 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 flex items-center"
            >
              {submitting ? 'Saving...' : 'Save Category'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ManageCategories;
