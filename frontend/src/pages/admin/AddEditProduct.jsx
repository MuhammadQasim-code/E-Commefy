import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProductById, createProduct, updateProduct } from '../../features/products/productSlice';
import { fetchCategories } from '../../features/categories/categorySlice';
import Loader from '../../components/common/Loader';
import toast from 'react-hot-toast';

const AddEditProduct = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const isEditMode = Boolean(id);

  const { product, loading: productLoading } = useSelector((state) => state.products);
  const { categories, loading: categoriesLoading } = useSelector((state) => state.categories);

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    discountPrice: '0',
    category: '',
    stock: '',
    brand: '',
    tags: '',
    isFeatured: false,
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCategories());
    if (isEditMode) {
      dispatch(fetchProductById(id));
    }
  }, [dispatch, id, isEditMode]);

  useEffect(() => {
    if (isEditMode && product) {
      setFormData({
        name: product.name || '',
        description: product.description || '',
        price: product.price || '',
        discountPrice: product.discountPrice || '0',
        category: product.category?._id || product.category || '',
        stock: product.stock || '',
        brand: product.brand || '',
        tags: product.tags?.join(', ') || '',
        isFeatured: product.isFeatured || false,
      });
      // Existing images previews
      if (product.images) {
        setImagePreviews(product.images.map(img => `http://localhost:5000${img}`));
      }
    }
  }, [product, isEditMode]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    setImageFiles(files);
    
    // Create local previews
    const previews = files.map((file) => URL.createObjectURL(file));
    setImagePreviews(previews);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validations
    if (!formData.name.trim()) return toast.error('Product name is required');
    if (!formData.description.trim()) return toast.error('Product description is required');
    if (!formData.price || parseFloat(formData.price) <= 0) {
      return toast.error('Please enter a valid price');
    }
    if (!formData.category) return toast.error('Please select a category');
    if (formData.stock === '' || parseInt(formData.stock) < 0) {
      return toast.error('Please enter a valid stock count');
    }

    setSubmitting(true);
    
    // Prepare multipart form data for file uploads
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    data.append('price', formData.price);
    data.append('discountPrice', formData.discountPrice);
    data.append('category', formData.category);
    data.append('stock', formData.stock);
    data.append('brand', formData.brand);
    data.append('isFeatured', formData.isFeatured);
    
    // Parse comma-separated tags
    if (formData.tags) {
      const tagArr = formData.tags.split(',').map((t) => t.trim()).filter(Boolean);
      tagArr.forEach((t) => data.append('tags[]', t));
    }

    // Append images
    imageFiles.forEach((file) => {
      data.append('images', file);
    });

    try {
      if (isEditMode) {
        await dispatch(updateProduct({ id, productData: data })).unwrap();
        toast.success('Product updated successfully!');
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success('Product created successfully!');
      }
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.message || 'Operation failed');
    } finally {
      setSubmitting(false);
    }
  };

  if (isEditMode && productLoading) return <Loader />;

  return (
    <div className="max-w-3xl mx-auto space-y-6 animate-fade-in">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6">
        <h2 className="text-2xl font-black text-slate-800 dark:text-slate-100">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h2>
        <p className="text-slate-500 dark:text-slate-400 mt-1">
          {isEditMode ? 'Modify catalog item fields and images' : 'Publish a new item to the store catalog'}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm space-y-4">
          
          {/* Name */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Product Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g. Wireless Bluetooth Headphones"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20"
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
              Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="5"
              placeholder="Detailed product descriptions..."
              className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-855 dark:text-slate-200 focus:outline-none focus:ring-4 focus:ring-primary-500/20 resize-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Base Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="99.99"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none"
              />
            </div>

            {/* Discount price */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Discount Price ($)
              </label>
              <input
                type="number"
                step="0.01"
                name="discountPrice"
                value={formData.discountPrice}
                onChange={handleChange}
                placeholder="79.99"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none"
              />
            </div>

            {/* Stock */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Stock Count
              </label>
              <input
                type="number"
                name="stock"
                value={formData.stock}
                onChange={handleChange}
                placeholder="50"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Category selection */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Category
              </label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="">Select Category</option>
                {categories.map((c) => (
                  <option key={c._id} value={c._id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            {/* Brand */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Brand
              </label>
              <input
                type="text"
                name="brand"
                value={formData.brand}
                onChange={handleChange}
                placeholder="e.g. Sony"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none"
              />
            </div>

            {/* Tags */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                Tags (comma separated)
              </label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleChange}
                placeholder="audio, wireless, noise-canceling"
                className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-slate-850 dark:text-slate-200 focus:outline-none"
              />
            </div>
          </div>

          {/* Featured toggle */}
          <div className="flex items-center space-x-3 pt-2">
            <input
              type="checkbox"
              name="isFeatured"
              id="isFeatured"
              checked={formData.isFeatured}
              onChange={handleChange}
              className="text-primary-500 focus:ring-primary-500 rounded border-slate-300 w-4 h-4"
            />
            <label htmlFor="isFeatured" className="text-sm font-semibold text-slate-700 dark:text-slate-350 cursor-pointer select-none">
              Featured Product (Show on homepage featured panel)
            </label>
          </div>
        </div>

        {/* Image upload section */}
        <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-800/50 p-6 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            Product Images
          </h3>
          
          <div className="flex items-center justify-center border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-8 hover:bg-slate-50/50 transition-colors cursor-pointer relative">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="absolute inset-0 opacity-0 cursor-pointer"
            />
            <div className="text-center space-y-2">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-450">
                Click to upload images (JPEG/PNG/WEBP)
              </p>
              <p className="text-xs text-slate-400">
                Up to 5 images. Max size 5MB each.
              </p>
            </div>
          </div>

          {/* Image Previews */}
          {imagePreviews.length > 0 && (
            <div className="grid grid-cols-5 gap-3 mt-4">
              {imagePreviews.map((src, idx) => (
                <div key={idx} className="relative rounded-lg overflow-hidden border border-slate-200 dark:border-slate-800 h-20 bg-slate-50">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/admin/products')}
            className="px-6 py-3.5 border border-slate-350 dark:border-slate-700 text-slate-650 dark:text-slate-350 font-bold rounded-xl hover:bg-slate-100"
          >
            Cancel
          </button>
          
          <button
            type="submit"
            disabled={submitting}
            className="px-6 py-3.5 bg-primary-600 text-white font-bold rounded-xl gradient-primary hover:opacity-90 flex items-center"
          >
            {submitting ? (
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
            ) : (
              <span>{isEditMode ? 'Update Product' : 'Publish Product'}</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddEditProduct;
