import React, { useEffect, useState } from 'react';
import AdminLayout from './AdminLayout';

interface UserImagesPageProps {
  userId: number;
  userEmail: string;
}

interface ImageFile {
  name: string;
  url: string;
  size: string;
}

const UserImagesPage: React.FC<UserImagesPageProps> = ({ userId, userEmail }) => {
  const [images, setImages] = useState<ImageFile[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchUserImages();
  }, [userId]);

  const fetchUserImages = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/user-images/${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user images');
      const data = await response.json();
      setImages(data.images || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load images');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout currentPage="users">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center gap-4">
              <a
                href="/admin"
                className="inline-flex items-center gap-2 text-indigo-400 hover:text-indigo-300"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Back to Users
              </a>
            </div>
            <h1 className="text-3xl font-bold text-white mt-3">User Images</h1>
            <p className="text-gray-400 mt-1">{userEmail}</p>
          </div>
          <button
            onClick={fetchUserImages}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center gap-2"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            Refresh
          </button>
        </div>

        {/* Images Grid */}
        <div className="bg-gray-800 rounded-lg p-6">
          {loading ? (
            <div className="text-center py-12">
              <div className="inline-block w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
              <p className="text-gray-400 mt-4">Loading images...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400">{error}</p>
              <button
                onClick={fetchUserImages}
                className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
              >
                Try Again
              </button>
            </div>
          ) : images.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              No images found for this user
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image, idx) => (
                <div key={idx} className="bg-gray-900 rounded-lg overflow-hidden hover:ring-2 hover:ring-indigo-500 transition-all">
                  <div className="aspect-square bg-gray-700 overflow-hidden">
                    <img
                      src={image.url}
                      alt={image.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer"
                      onClick={() => window.open(image.url, '_blank')}
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-white font-medium truncate">{image.name}</p>
                    <p className="text-gray-400 text-sm mt-1">{image.size}</p>
                    <button
                      onClick={() => {
                        const link = document.createElement('a');
                        link.href = image.url;
                        link.download = image.name;
                        link.click();
                      }}
                      className="mt-3 w-full px-3 py-2 bg-indigo-600 text-white text-sm rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default UserImagesPage;
