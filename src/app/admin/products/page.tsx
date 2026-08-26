'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Product {
  id: string;
  name: string;
  category: string;
  buyingPrice: number;
  rentPrice?: number;
  stock: number;
  images: string[];
  featured: boolean;
  isNew: boolean;
  createdAt: string;
}

const formatPrice = (price: number | string) => {
  return new Intl.NumberFormat('en-RW').format(Number(price)) + ' RWF';
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [deleteModal, setDeleteModal] = useState<{ show: boolean; product: Product | null }>({
    show: false,
    product: null,
  });

  useEffect(() => {
    let cancelled = false;
    const token = localStorage.getItem('admin_token');
    fetch('/api/products', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then(res => (res.ok ? res.json() : Promise.reject(new Error('Failed to fetch products'))))
      .then(data => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : []);
          setLoading(false);
        }
      })
      .catch(error => {
        console.error('Failed to fetch products:', error);
        if (!cancelled) {
          setLoading(false);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const handleDelete = async (productId: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.ok) {
        setProducts(products.filter((p) => p.id !== productId));
        setDeleteModal({ show: false, product: null });
      }
    } catch (error) {
      console.error('Failed to delete product:', error);
    }
  };

  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !categoryFilter || product.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Products</h2>
        <Link
          href="/admin/products/new"
          className="bg-pink-600 text-white px-4 py-2 rounded-lg hover:bg-pink-700 transition-colors inline-flex items-center gap-2"
        >
          <span>+</span>
          Add Product
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none"
        >
          <option value="">All Categories</option>
          <option value="Short Dresses">Short Dresses</option>
          <option value="Long Dresses">Long Dresses</option>
          <option value="Complete Clothes">Complete Clothes</option>
          <option value="Tops">Tops</option>
          <option value="Shorts">Shorts</option>
          <option value="Skirts">Skirts</option>
          <option value="Pants">Pants</option>
          <option value="Shoes">Shoes</option>
        </select>
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading products...</div>
      ) : filteredProducts.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-sm">
          <p className="text-gray-500">No products found</p>
        </div>
      ) : (
        <>
          <div className="hidden md:block bg-white rounded-xl shadow-sm overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-200">
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Product</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Category</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Buying</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Rent</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Stock</th>
                  <th className="px-6 py-3 text-left text-sm font-medium text-gray-500">Badges</th>
                  <th className="px-6 py-3 text-right text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {filteredProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              alt={product.name}
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                              📷
                            </div>
                          )}
                        </div>
                        <span className="font-medium text-gray-900">{product.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                      {formatPrice(product.buyingPrice)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      {product.rentPrice ? formatPrice(product.rentPrice) : '-'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">
                      <span className={product.stock < 10 ? 'text-red-600 font-medium' : ''}>
                        {product.stock}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2">
                        {product.featured && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="inline-flex px-2 py-1 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/admin/products/${product.id}/edit`}
                          className="px-3 py-1 text-sm text-pink-600 hover:bg-pink-50 rounded-lg transition-colors"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => setDeleteModal({ show: true, product })}
                          className="px-3 py-1 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {filteredProducts.map((product) => (
              <div key={product.id} className="bg-white rounded-xl shadow-sm p-4">
                <div className="flex gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0">
                    {product.images?.[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-gray-400">
                        📷
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <h3 className="font-medium text-gray-900 truncate">{product.name}</h3>
                      <div className="flex gap-1 ml-2">
                        {product.featured && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                            Featured
                          </span>
                        )}
                        {product.isNew && (
                          <span className="px-2 py-0.5 text-xs font-medium bg-green-100 text-green-800 rounded-full">
                            New
                          </span>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-500">{product.category}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="font-medium text-gray-900">{formatPrice(product.buyingPrice)}</span>
                      <span className="text-sm text-gray-500">Stock: {product.stock}</span>
                    </div>
                    {product.rentPrice && (
                      <p className="text-xs text-gray-500">Rent: {formatPrice(product.rentPrice)}</p>
                    )}
                    <div className="flex gap-2 mt-3">
                      <Link
                        href={`/admin/products/${product.id}/edit`}
                        className="flex-1 text-center px-3 py-2 text-sm text-pink-600 bg-pink-50 rounded-lg hover:bg-pink-100 transition-colors"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => setDeleteModal({ show: true, product })}
                        className="flex-1 text-center px-3 py-2 text-sm text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {deleteModal.show && deleteModal.product && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Product</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete &quot;{deleteModal.product.name}&quot;? This action cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteModal({ show: false, product: null })}
                className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteModal.product!.id)}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
