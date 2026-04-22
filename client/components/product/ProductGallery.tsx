import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Maximize2 } from "lucide-react";

interface ProductGalleryProps {
  images: string[];
  productName: string;
  videoUrl?: string;
}

export function ProductGallery({
  images,
  productName,
  videoUrl,
}: ProductGalleryProps) {
  const [mainImageIndex, setMainImageIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Handle empty or undefined images array
  const validImages = Array.isArray(images) && images.length > 0 
    ? images.filter(img => img && typeof img === 'string' && img.trim() !== '')
    : [];

  // Reset index if images array becomes empty
  useEffect(() => {
    if (validImages.length === 0) {
      setMainImageIndex(0);
    } else if (mainImageIndex >= validImages.length) {
      setMainImageIndex(0);
    }
  }, [validImages.length, mainImageIndex]);

  const handlePrevImage = () => {
    setMainImageIndex((prev) => (prev === 0 ? validImages.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setMainImageIndex((prev) => (prev === validImages.length - 1 ? 0 : prev + 1));
  };

  const goToImage = (index: number) => {
    if (index >= 0 && index < validImages.length) {
      setMainImageIndex(index);
    }
  };

  // Show placeholder if no images
  if (validImages.length === 0) {
    return (
      <div className="product-gallery space-y-3">
        <div className="flex items-center justify-center bg-gray-100 p-16 animate-fade-in">
          <div className="text-center text-muted-foreground">
            <p className="text-lg font-medium">Aucune image disponible</p>
            <p className="text-sm mt-2">Images du produit en cours de chargement...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Main Gallery */}
      <div className="product-gallery space-y-3">
        {/* Main Image Container */}
        <div className="flex items-center justify-center bg-white p-2 animate-fade-in relative group">
          <div className="relative w-full flex justify-center">
            <img
              src={validImages[mainImageIndex]}
              alt={productName}
              className="h-auto w-auto object-contain hover:scale-105 transition-transform duration-500 cursor-pointer"
              onClick={() => setIsFullscreen(true)}
            />
            <div className="absolute -inset-4 bg-gradient-to-r from-accent/20 to-accent/10 rounded-2xl -z-10 blur-xl" />

            {/* Fullscreen Button */}
            <button
              onClick={() => setIsFullscreen(true)}
              className="absolute top-4 right-4 bg-white/90 hover:bg-white text-foreground p-2 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
              title="Voir en plein écran"
            >
              <Maximize2 className="w-5 h-5" />
            </button>

            {/* Image Counter */}
            {validImages.length > 1 && (
              <div className="absolute bottom-4 left-4 bg-foreground/80 text-white px-3 py-1 rounded-full text-xs font-medium">
                {mainImageIndex + 1} / {validImages.length}
              </div>
            )}

            {/* Navigation Arrows */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  title="Image précédente"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-foreground p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-lg"
                  title="Image suivante"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </>
            )}
          </div>
        </div>

        {/* Thumbnail Images */}
        {validImages.length > 1 && (
          <div className="thumbnail-container flex gap-3 overflow-x-auto pb-2">
            {validImages.map((image, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={`flex-shrink-0 w-20 h-20 rounded-lg border-2 transition-all duration-300 overflow-hidden ${
                  mainImageIndex === index
                    ? "border-accent shadow-lg scale-105"
                    : "border-border hover:border-accent/50"
                }`}
              >
                <img
                  src={image}
                  alt={`${productName} ${index + 1}`}
                  className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Modal */}
      {isFullscreen && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4">
          <button
            onClick={() => setIsFullscreen(false)}
            className="absolute top-6 right-6 bg-white text-foreground p-2 rounded-lg hover:bg-gray-200 transition-colors"
            title="Fermer le plein écran"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Fullscreen Image */}
          <div className="relative w-full h-full flex items-center justify-center max-w-5xl mx-auto">
            <img
              src={validImages[mainImageIndex]}
              alt={productName}
              className="max-w-full max-h-full object-contain"
            />

            {/* Navigation Controls in Fullscreen */}
            {validImages.length > 1 && (
              <>
                <button
                  onClick={handlePrevImage}
                  className="absolute left-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={handleNextImage}
                  className="absolute right-4 bg-white/20 hover:bg-white/30 text-white p-3 rounded-full transition-all duration-300"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>

                {/* Fullscreen Counter */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/60 text-white px-4 py-2 rounded-full text-sm font-medium">
                  {mainImageIndex + 1} / {validImages.length}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
