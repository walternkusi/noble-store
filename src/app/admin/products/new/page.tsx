'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { compressImage } from '@/lib/compressImage';

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: '',
    category: '',
    buyingPrice: '',
    rentPrice: '',
    description: '',
    stock: '',
    featured: false,
    isNew: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggle = (name: 'featured' | 'isNew') => {
    setForm((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
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
    setImagePreviews((prev) => [...prev, ...base64Images]);
  };

  const removeImage = (index: number) => {
    setImagePreviews((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!form.name || !form.category || !form.stock) {
      setError('Please fill in all required fields');
      return;
    }

    if (imagePreviews.length === 0) {
      setError('Please upload at least one image');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('admin_token');
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: form.name,
          category: form.category,
          price: Number(form.buyingPrice) || 0,
          buyingPrice: Number(form.buyingPrice) || 0,
          rentPrice: Number(form.rentPrice) || 0,
          description: form.description,
          stock: Number(form.stock),
          featured: form.featured,
          newArrival: form.isNew,
          images: imagePreviews,
        }),
      });

      if (res.ok) {
        router.push('/admin/products');
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to create product');
      }
    } catch {
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-black">Add New Product</h2>
        <p className="text-gray-500 mt-1">Fill in the details to add a new product</p>
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
                  <option value="Complete Clothes">Complete Clothes</option>
                  <option value="Tops">Tops</option>
                  <option value="Shorts">Shorts</option>
                  <option value="Skirts">Skirts</option>
                  <option value="Shoes">Shoes</option>
              </select>
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
          <div>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={handleImageChange}
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-pink-500 transition-colors"
            >
              <span className="text-4xl mb-2">📷</span>
              <span className="text-sm text-gray-500">Click to upload images</span>
            </label>
          </div>

          {imagePreviews.length > 0 && (
            <div className="mt-4 grid grid-cols-4 gap-3">
              {imagePreviews.map((preview, index) => (
                <div key={index} className="relative group">
                  <img
                    src={preview}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 w-6 h-6 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}
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
            {loading ? 'Saving...' : 'Save Product'}
          </button>
        </div>
      </form>
    </div>
  );
}
