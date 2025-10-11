import React, { useState } from 'react';
import './App.css';

const ImageDownloadApp = () => {
  // State for search, images, filters, and loading
  const [searchQuery, setSearchQuery] = useState('');
  const [images, setImages] = useState([]);
  const [minWidth, setMinWidth] = useState(100);
  const [minHeight, setMinHeight] = useState(100);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Function to search for images using Unsplash API
  const searchImages = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a search term');
      return;
    }

    setLoading(true);
    setError(null);
    const key = 'Ud3ufrVq9r8PKM2mdO0vgpWSYAKXlvw2as3zCZ6bfH0';
    try {

      // Using Unsplash API
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(searchQuery)}&per_page=20&client_id=${key}`
      );

      if (!response.ok) {
        throw new Error(`API request failed with status ${response.status}`);
      }

      const data = await response.json();
      // Filter images based on minimum dimension requirements
      const filteredImages = data.results.filter(
        (img) => img.width >= minWidth && img.height >= minHeight
      );

      setImages(filteredImages);
    } catch (err) {
      console.error('Error fetching images:', err);
      setError(err.message || 'An error occurred while fetching images');
    } finally {
      setLoading(false);
    }
  };

  // Function to download an image
  const downloadImage = async (url, filename) => {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const downloadUrl = window.URL.createObjectURL(blob);

      // Create a temporary link and click it to trigger download
      const link = document.createElement('a');
      link.href = downloadUrl;
      link.download = filename || 'image.jpg';
      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error('Error downloading image:', err);
      setError('Failed to download image');
    }
  };

  return (
    <div className="app">
      <header className="header">
        <h1>Modern Image Search & Download</h1>
        <p>Find and download high-quality images</p>
      </header>

      <main className="main-content">
        <section className="search-section">
          <div className="search-controls">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for images..."
              className="search-input"
            />
            <div className="dimension-filters">
              <div>
                <label htmlFor="min-width">Min Width:</label>
                <input
                  id="min-width"
                  type="number"
                  value={minWidth}
                  onChange={(e) => setMinWidth(Number(e.target.value))}
                  min="1"
                  className="dimension-input"
                />
              </div>
              <div>
                <label htmlFor="min-height">Min Height:</label>
                <input
                  id="min-height"
                  type="number"
                  value={minHeight}
                  onChange={(e) => setMinHeight(Number(e.target.value))}
                  min="1"
                  className="dimension-input"
                />
              </div>
            </div>
            <button onClick={searchImages} disabled={loading} className="search-button">
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>
        </section>

        {error && <div className="error-message">{error}</div>}

        <section className="results-section">
          {images.length > 0 ? (
            <div className="image-grid">
              {images.map((image) => (
                <div key={image.id} className="image-card">
                  <img
                    src={image.urls.small}
                    alt={image.alt_description || 'Search result'}
                    className="image-preview"
                    loading="lazy"
                  />
                  <div className="image-info">
                    <p>Size: {image.width}×{image.height}px</p>
                    <button
                      onClick={() => downloadImage(image.urls.regular, `unsplash-${image.id}.jpg`)}
                      className="download-button"
                    >
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : loading ? (
            <div className="loading">Loading images...</div>
          ) : (
            <div className="no-results">Enter a search term to begin</div>
          )}
        </section>
      </main>
    </div>
  );
};

export default ImageDownloadApp;