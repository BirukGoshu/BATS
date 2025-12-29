import { useState, useEffect } from 'react';
import Slideshow from '../components/Slideshow';
import productService from '../services/productService';
import designService from '../services/designService';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const Home = () => {
  const [products, setProducts] = useState([]);
  const [designs, setDesigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch products and designs in parallel
        const [productsData, designsData] = await Promise.all([
          productService.getProducts({ limit: 10 }).catch(() => ({ results: [] })),
          designService.getDesigns({ limit: 10 }).catch(() => ({ results: [] })),
        ]);

        // Handle different response formats (array or object with results)
        setProducts(Array.isArray(productsData) ? productsData : (productsData.results || productsData.data || []));
        setDesigns(Array.isArray(designsData) ? designsData : (designsData.results || designsData.data || []));
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load products and designs');
        // Set empty arrays on error so slideshows show "no items" message
        setProducts([]);
        setDesigns([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">
          Welcome to BATS Fashion
        </h1>
        <p className="text-gray-600 text-lg">
          Clothing Manufacturing, Fashion Design, and Online Sales Platform
        </p>
      </div>

      {/* Products Slideshow */}
      <div className="mb-12">
        <Slideshow
          items={products}
          title="Featured Products"
          autoPlayInterval={5000}
          showDots={true}
        />
      </div>

      {/* Designs Slideshow */}
      <div>
        <Slideshow
          items={designs}
          title="Latest Designs"
          autoPlayInterval={5000}
          showDots={true}
        />
      </div>

      {error && (
        <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">{error}</p>
        </div>
      )}
    </div>
  );
};

export default Home;




