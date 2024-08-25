import React, { useState, useEffect } from 'react';
import './ImageCarousel.css';
import note from '../../../assets/icons/note.svg';
import heic2any from 'heic2any'; // Import heic2any library for HEIC conversion
const ImageCarousel = ({ images, arrowClick, index, isLiked, handleLike, types, isRepost }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showLikeImage, setShowLikeImage] = useState(false);

  useEffect(() => {
    if (isLiked) {
      setShowLikeImage(true);
      const timer = setTimeout(() => {
        setShowLikeImage(false);
      }, 1000); // 1 seconds
      return () => clearTimeout(timer);
    }
  }, [isLiked]);

  useEffect(() => {
    // This effect runs only once when the component mounts to set initial state
    setShowLikeImage(false);
  }, []);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
    arrowClick(index, (currentImage + 1) % images.length);
  };
  const prevImage = () => {
    setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
    arrowClick(index, currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  const toggleLikeImage = () => {
    setShowLikeImage(!showLikeImage);
    handleLike();
    const timer = setTimeout(() => {
      setShowLikeImage(false);
    }, 1000); // 1 second
    return () => clearTimeout(timer);
  };

  return (
    <div className="image-carousel-container">
      <div className="image-container-outer">
        <div className="images-container" style={{ height: isRepost ? '50vh' : '100%' }}>
          {types && types[currentImage] === 0 ? (
            <img src={images[currentImage]} alt="Post" className="upload-image" />
          ) : (
            <video className="upload-image" controls src={images[currentImage]}>
              <source type="video/mp4" />
            </video>
          )}
          {/* {images && images.length > 1 && (
            <div className="images-count-container">
              <div className="counts-icon-container">
                <img className="count-icon" src={note} alt="note" />
              </div>
              <div className="count-number-container">
                <p className="count-number">
                  {currentImage + 1}/{images.length}
                </p>
              </div>
            </div>
          )} */}
          {showLikeImage && (
            <div className="like-overlay">
              <div id="heart"></div>
            </div>
          )}
        </div>
      </div>
      {images && images.length > 1 && (
        <div className="prev-next-btn-container">
          <div
            className="imgCarouselContainer"
            onClick={(e) => {
              e.stopPropagation();
              prevImage();
            }}
          >
            <img src="/arrowLeft.svg" className="imgCarousel" alt="left" />
          </div>

          <div
            className="imgCarouselContainer"
            onClick={(e) => {
              e.stopPropagation();
              nextImage();
            }}
          >
            <img src="/arrowRight.svg" className="imgCarousel" alt="left" />
          </div>
        </div>
      )}
      {images && images.length > 1 && (
        <div className="imgSliderContainer">
          <div className="imgSliderBox">
            {images.map((_, idx) => (
              <div key={idx} className={idx === currentImage ? 'imgActive' : 'imgNotActive'}></div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
export default ImageCarousel;
