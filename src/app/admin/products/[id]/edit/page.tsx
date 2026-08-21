'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { use } from 'react';
import { compressImage } from '@/lib/compressImage';

const DRESS_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42'];
const COLORS = ['Black', 'White', 'Red', 'Blue', 'Pink', 'Green', 'Navy', 'Beige', 'Purple', 'Yellow', 'Orange', 'Gold'];

export default function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [error, setError] = useState('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [newImages, setNewImages] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    category: '',
    price: '',
    buyingPrice: '',
    rentPrice: '',
    description: '',
    stock: '',
    featured: false,
    isNew: false,
    availableSizes: [] as string[],
    availableColors: [] as string[],
  });

  useEffect(() => {
    const fetchProduct = async () => {
      const token = localStorage.getItem('admin_token');
      try {
        const res = await fetch(`/api/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (res.ok) {
          const data = await res.json();
          setForm({
            name: data.name,
            category: data.category,
            price: String(data.price),
            buyingPrice: data.buyingPrice !== undefined ? String(data.buyingPrice) : '',
            rentPrice: data.rentPrice !== undefined ? String(data.rentPrice) : '',
            description: data.description || '',
            stock: String(data.stock),
            featured: data.featured,
            isNew: data.newArrival,
            availableSizes: data.sizes || [],
            availableColors: data.colors || [],
          });
          setExistingImages(data.images || []);
        } else {
          setError('Product not found');
        }
      } catch {
        setError('Failed to load product');
      } finally {
        setFetching(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: 'featured' | 'isNew') => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleSizeToggle = (size: string) => {
    setForm((prev) => ({
      ...prev,
      availableSizes: prev.availableSizes.includes(size)
        ? prev.availableSizes.filter((s) => s !== size)
        : [...prev.availableSizes, size],
    }));
  };

  const handleColorToggle = (color: string) => {
    setForm((prev) => ({
      ...prev,
      availableColors: prev.availableColors.includes(color)
        ? prev.availableColors.filter((c) => c !== color)
        : [...prev.availableColors, color],
    }));
  };

  const handleNewImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const base64Images: string[] = [];
    for (const file of Array.from(files)) {
      const reader = new FileReader();
      const base64 = await new Promise<string>((resolve) => {
        reader.onloadend = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });
      const compressed = await compressImage(base64);
      base64Images.push(compressed);
    }
    setNewImages((prev) => [...prev, ...base64Images]);
  };

  const removeExistingImage = (index: number) => {
    setExistingImages((prev) => prev.filter((_, i) => i !== index));
  };

  const removeNewImage = (index: number) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.category || !form.price || !form.stock) {
      setError('Please fill in all required fields');
      return;
    }

    const allImages = [...existingImages, ...newImages];
    if (allImages.length === 0) {
      setError('Please keep or upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch(`/api/products/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.price),
          buyingPrice: Number(form.buyingPrice) || 0,
          rentPrice: Number(form.rentPrice) || 0,
          description: form.description,
          stock: Number(form.stock),
          featured: form.featured,
          newArrival: form.isNew,
          sizes: form.availableSizes,
          colors: form.availableColors,
          images: allImages,
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to update product');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableSizesForCategory = form.category === 'Shoes' ? SHOE_SIZES : DRESS_SIZES;

  if (fetching) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading product...</div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Edit Product</h2>
        <p className="text-gray-500 mt-1">Update product details</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {error && (
          <div className="bg-red-50 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Basic Information</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Product Name *
              </label>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category *
                </label>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                  required
                >
                  <option value="">Select category</option>
                  <option value="Short Dresses">Short Dresses</option>
                  <option value="Long Dresses">Long Dresses</option>
                  <option value="Tops">Tops</option>
                  <option value="Shoes">Shoes</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Price (RWF) *
                </label>
                <input
                  type="number"
                  name="price"
                  value={form.price}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                  placeholder="0"
                  min="0"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Buying Price (RWF)
                </label>
                <input
                  type="number"
                  name="buyingPrice"
                  value={form.buyingPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                  placeholder="0"
                  min="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Rent Price (RWF)
                </label>
                <input
                  type="number"
                  name="rentPrice"
                  value={form.rentPrice}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none resize-none text-black"
                placeholder="Enter product description"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Stock Quantity *
              </label>
              <input
                type="number"
                name="stock"
                value={form.stock}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-black"
                placeholder="0"
                min="0"
                required
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Product Images *</h3>

          {existingImages.length > 0 && (
            <div className="mb-4">
              <p className="text-sm font-medium text-gray-700 mb-2">Current Images</p>
              <div className="grid grid-cols-4 gap-3">
                {existingImages.map((image, index) => (
                  <div key={`existing-${index}`} className="relative group">
                    <img
                      src={image}
                      alt={`Existing ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleNewImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition-colors"
            >
              <span className="text-4xl mb-2">📷</span>
              <span className="text-sm text-gray-500">Click to add more images</span>
            </label>
          </div>

          {newImages.length > 0 && (
            <div className="mt-4">
              <p className="text-sm font-medium text-gray-700 mb-2">New Images</p>
              <div className="grid grid-cols-4 gap-3">
                {newImages.map((preview, index) => (
                  <div key={`new-${index}`} className="relative group">
                    <img
                      src={preview}
                      alt={`New ${index + 1}`}
                      className="w-full h-24 object-cover rounded-lg"
                    />
                    <button
                      type="button"
                      onClick={() => removeNewImage(index)}
                      className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Available Sizes</h3>
          {form.category ? (
            <div className="flex flex-wrap gap-3">
              {availableSizesForCategory.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                    form.availableSizes.includes(size)
                      ? 'border-pink-500 bg-pink-50 text-pink-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={form.availableSizes.includes(size)}
                    onChange={() => handleSizeToggle(size)}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">Select a category first to see available sizes</p>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Available Colors</h3>
          <div className="flex flex-wrap gap-3">
            {COLORS.map((color) => (
              <label
                key={color}
                className={`flex items-center gap-2 px-4 py-2 border rounded-lg cursor-pointer transition-colors ${
                  form.availableColors.includes(color)
                    ? 'border-pink-500 bg-pink-50 text-pink-700'
                    : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                <input
                  type="checkbox"
                  checked={form.availableColors.includes(color)}
                  onChange={() => handleColorToggle(color)}
                  className="sr-only"
                />
                <div
                  className={`w-4 h-4 rounded-full border ${
                    form.availableColors.includes(color) ? 'border-pink-500' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.toLowerCase() === 'white' ? '#f9fafb' : color.toLowerCase() }}
                />
                {color}
              </label>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-lg font-semibold text-black mb-4">Product Flags</h3>
          <div className="space-y-4">
            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-black">Featured Product</p>
                <p className="text-sm text-gray-500">Show this product in featured section</p>
              </div>
              <div
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.featured ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle('featured')}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    form.featured ? 'left-7' : 'left-1'
                  }`}
                />
              </div>
            </label>

            <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
              <div>
                <p className="font-medium text-black">New Arrival</p>
                <p className="text-sm text-gray-500">Mark this product as new</p>
              </div>
              <div
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  form.isNew ? 'bg-pink-600' : 'bg-gray-300'
                }`}
                onClick={() => handleToggle('isNew')}
              >
                <div
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    form.isNew ? 'left-7' : 'left-1'
                  }`}
                />
              </div>
            </label>
          </div>
        </div>

        <div className="flex gap-4 justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 text-white bg-pink-600 rounded-lg hover:bg-pink-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
