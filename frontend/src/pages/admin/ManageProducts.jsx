import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProducts, deleteProduct } from '../../features/products/productSlice';
import DataTable from '../../components/admin/DataTable';
import formatCurrency from '../../utils/formatCurrency';
import toast from 'react-hot-toast';
import { HiPlus, HiPencil, HiTrash } from 'react-icons/hi2';

const ManageProducts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { products, loading } = useSelector((state) => state.products);

  const [search, setSearch] = useState('');

  useEffect(() => {
    dispatch(fetchProducts({ search, limit: 100 })); // load all/large batch for admin list
  }, [dispatch, search]);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try {
      await dispatch(deleteProduct(id)).unwrap();
      toast.success('Product deleted successfully');
      dispatch(fetchProducts({ search, limit: 100 }));
    } catch (err) {
      toast.error(err.message || 'Failed to delete product');
    }
  };

  const columns = [
    {
      header: 'Image',
      render: (row) => {
        const img = row.images?.[0]
          ? `http://localhost:5000${row.images[0]}`
          : 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
        return (
          <img
            src={img}
            alt={row.name}
            className="w-10 h-10 rounded-lg object-cover bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=100';
            }}
          />
        );
      },
    },
    {
      header: 'Name',
      render: (row) => <span className="font-bold text-slate-800 dark:text-slate-200">{row.name}</span>,
    },
    {
      header: 'Category',
      render: (row) => <span className="capitalize">{row.category?.name || 'Uncategorized'}</span>,
    },
    {
      header: 'Price',
      render: (row) => (
        <span className="font-semibold text-slate-900 dark:text-slate-250">
          {formatCurrency(row.discountPrice > 0 ? row.discountPrice : row.price)}
        </span>
      ),
    },
    {
      header: 'Stock',
      render: (row) => (
        <span className={`font-bold ${row.stock < 5 ? 'text-red-500' : 'text-slate-700 dark:text-slate-350'}`}>
          {row.stock} items
        </span>
      ),
    },
    {
      header: 'Featured',
      render: (row) => (
        <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-semibold ${
          row.isFeatured ? 'bg-primary-500/10 text-primary-500' : 'bg-slate-100 dark:bg-slate-800 text-slate-400'
        }`}>
          {row.isFeatured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
            Product Management
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Create, edit, or delete catalog items
          </p>
        </div>
        
        <button
          onClick={() => navigate('/admin/products/new')}
          className="px-5 py-3 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 transition-opacity flex items-center justify-center space-x-2"
        >
          <HiPlus className="w-5 h-5" />
          <span>Add New Product</span>
        </button>
      </div>

      <DataTable
        columns={columns}
        data={products}
        loading={loading}
        searchPlaceholder="Filter products by name..."
        searchValue={search}
        onSearchChange={setSearch}
        renderRowActions={(row) => (
          <>
            <button
              onClick={() => navigate(`/admin/products/edit/${row._id}`)}
              className="p-2 rounded-xl text-blue-500 hover:bg-blue-500/10 transition-colors"
              title="Edit Product"
            >
              <HiPencil className="w-4 h-4" />
            </button>
            <button
              onClick={() => handleDelete(row._id)}
              className="p-2 rounded-xl text-red-500 hover:bg-red-500/10 transition-colors"
              title="Delete Product"
            >
              <HiTrash className="w-4 h-4" />
            </button>
          </>
        )}
      />
    </div>
  );
};

export default ManageProducts;
