import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchRelatedProducts } from '../../features/products/productSlice';
import ProductCard from './ProductCard';
import { ProductCardSkeleton } from '../common/Skeleton';

const RelatedProducts = ({ productId }) => {
  const dispatch = useDispatch();
  const { relatedProducts } = useSelector((state) => state.products);

  useEffect(() => {
    if (productId) {
      dispatch(fetchRelatedProducts(productId));
    }
  }, [dispatch, productId]);

  if (!relatedProducts?.length) return null;

  return (
    <section className="mt-16">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-8">
        Related Products
      </h2>
      <div className="flex gap-6 overflow-x-auto pb-4 hide-scrollbar snap-x snap-mandatory">
        {relatedProducts.map((product) => (
          <div key={product._id} className="flex-shrink-0 w-72 snap-start">
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
