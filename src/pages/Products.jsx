import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import productService from '../services/productService';
import Input from '../components/ui/Input';
import Select from '../components/ui/Select';
import Button from '../components/ui/Button';
import Card, { CardHeader, CardBody } from '../components/ui/Card';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import toast from 'react-hot-toast';

const Products = () => {
  const { isAuthenticated } = useAuth();
  const [viewMode, setViewMode] = useState('view'); // 'view' or 'create'
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    cat: '', // category
    img: [], // multiple images
  });
  const [errors, setErrors] = useState({});
  const [imagePreviews, setImagePreviews] = useState([]);

  // Fetch categories and products on mount
  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await productService.getCategories();
      // Handle different response formats
      const categoriesData = Array.isArray(response) 
        ? response 
        : (response.results || response.data || []);
      setCategories(categoriesData);
    } catch (error) {
      console.error('Error fetching categories:', error);
      toast.error('Failed to load categories');
    }
  };

  const fetchProducts = async () => {
    try {
      setFetching(true);
      const response = await productService.getProducts();
      // Handle different response formats
      const productsData = Array.isArray(response) 
        ? response 
        : (response.results || response.data || []);
      setProducts(productsData);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
    } finally {
      setFetching(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    
    if (files.length === 0) return;

    // Validate file types
    const validFiles = files.filter(file => {
      const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
      return validTypes.includes(file.type);
    });

    if (validFiles.length !== files.length) {
      toast.error('Some files are not valid images. Only JPG, PNG, and WebP are allowed.');
    }

    if (validFiles.length > 0) {
      setFormData((prev) => ({
        ...prev,
        img: [...prev.img, ...validFiles],
      }));

      // Create previews
      validFiles.forEach((file) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreviews((prev) => [...prev, reader.result]);
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      img: prev.img.filter((_, i) => i !== index),
    }));
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }

    if (!formData.price) {
      newErrors.price = 'Price is required';
    } else if (isNaN(formData.price) || parseFloat(formData.price) <= 0) {
      newErrors.price = 'Price must be a valid positive number';
    }

    if (!formData.cat) {
      newErrors.cat = 'Category is required';
    }

    if (formData.img.length === 0) {
      newErrors.img = 'At least one image is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      // Create FormData
      const submitData = new FormData();
      submitData.append('name', formData.name);
      if (formData.description) {
        submitData.append('description', formData.description);
      }
      submitData.append('price', formData.price);
      submitData.append('cat', formData.cat); // category as 'cat'

      // Append all images as 'img' array
      formData.img.forEach((image) => {
        submitData.append('img', image);
      });

      await productService.createProduct(submitData);
      toast.success('Product created successfully!');
      
      // Reset form
      setFormData({
        name: '',
        description: '',
        price: '',
        cat: '',
        img: [],
      });
      setImagePreviews([]);
      setViewMode('view');
      
      // Refresh products list
      fetchProducts();
    } catch (error) {
      console.error('Error creating product:', error);
      toast.error(error.response?.data?.message || 'Failed to create product');
      
      // Handle field-specific errors
      if (error.response?.data) {
        const backendErrors = error.response.data;
        const fieldErrors = {};
        
        Object.keys(backendErrors).forEach((key) => {
          if (Array.isArray(backendErrors[key])) {
            fieldErrors[key] = backendErrors[key][0];
          } else {
            fieldErrors[key] = backendErrors[key];
          }
        });
        
        setErrors((prev) => ({ ...prev, ...fieldErrors }));
      }
    } finally {
      setLoading(false);
    }
  };

  const categoryOptions = categories.map((cat) => ({
    value: cat.id?.toString() || cat.pk?.toString() || cat.id,
    label: cat.name || cat.title || 'Unnamed Category',
  }));

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardBody>
            <p className="text-center text-gray-600">
              Please login to view and create products.
            </p>
          </CardBody>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Products</h1>
          <p className="text-gray-600">Create and manage your products</p>
        </div>
        <Button
          variant={viewMode === 'view' ? 'primary' : 'secondary'}
          onClick={() => {
            setViewMode(viewMode === 'view' ? 'create' : 'view');
            setFormData({
              name: '',
              description: '',
              price: '',
              cat: '',
              img: [],
            });
            setImagePreviews([]);
            setErrors({});
          }}
        >
          {viewMode === 'view' ? 'Create Product' : 'View Products'}
        </Button>
      </div>

      {viewMode === 'create' ? (
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Create New Product</h2>
          </CardHeader>
          <CardBody>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Product Name */}
              <Input
                label="Product Name"
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter product name"
                error={errors.name}
                required
              />

              {/* Description */}
              <div className="w-full">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Enter product description..."
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
                />
              </div>

              {/* Price */}
              <Input
                label="Price"
                type="number"
                name="price"
                value={formData.price}
                onChange={handleChange}
                placeholder="0.00"
                step="0.01"
                min="0"
                error={errors.price}
                required
              />

              {/* Category */}
              <Select
                label="Category"
                name="cat"
                value={formData.cat}
                onChange={handleChange}
                options={categoryOptions}
                error={errors.cat}
                required
                placeholder="Select a category"
              />

              {/* Multiple Images */}
              <div className="w-full">
                <label htmlFor="images" className="block text-sm font-medium text-gray-700 mb-1">
                  Product Images <span className="text-red-500">*</span>
                </label>
                <input
                  type="file"
                  id="images"
                  name="images"
                  onChange={handleImageChange}
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  multiple
                  className={`w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent ${
                    errors.img ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.img && (
                  <p className="mt-1 text-sm text-red-600">{errors.img}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  You can select multiple images. Accepted formats: JPG, PNG, WebP
                </p>

                {/* Image Previews */}
                {imagePreviews.length > 0 && (
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    {imagePreviews.map((preview, index) => (
                      <div key={index} className="relative">
                        <img
                          src={preview}
                          alt={`Preview ${index + 1}`}
                          className="w-full h-32 object-cover rounded-lg border border-gray-300"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600 transition-colors"
                          aria-label="Remove image"
                        >
                          ×
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Submit Button */}
              <div className="flex gap-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  loading={loading}
                  disabled={loading}
                >
                  Create Product
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  size="lg"
                  onClick={() => {
                    setViewMode('view');
                    setFormData({
                      name: '',
                      description: '',
                      price: '',
                      cat: '',
                      img: [],
                    });
                    setImagePreviews([]);
                    setErrors({});
                  }}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>
      ) : (
        <div>
          {fetching ? (
            <div className="flex justify-center items-center py-12">
              <LoadingSpinner size="lg" />
            </div>
          ) : products.length === 0 ? (
            <Card>
              <CardBody>
                <p className="text-center text-gray-600 py-8">
                  No products found. Create your first product!
                </p>
              </CardBody>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <Card key={product.id || product.pk} hover>
                  <div className="relative h-48 bg-gray-100 overflow-hidden">
                    {product.images && product.images.length > 0 ? (
                      <img
                        src={product.images[0]?.image || product.images[0]?.image_url || product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.target.src = 'https://via.placeholder.com/400x300?text=No+Image';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        No Image
                      </div>
                    )}
                  </div>
                  <CardBody>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">
                      {product.name}
                    </h3>
                    {product.description && (
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                        {product.description}
                      </p>
                    )}
                    {product.price && (
                      <p className="text-lg font-bold text-primary-600 mb-2">
                        ${parseFloat(product.price).toFixed(2)}
                      </p>
                    )}
                    {product.category && (
                      <span className="inline-block px-3 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
                        {product.category.name || product.category}
                      </span>
                    )}
                  </CardBody>
                </Card>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Products;


