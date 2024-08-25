import React, { useState } from 'react';
import './ImageCarousel.css';
import note from '../../../assets/icons/note.svg';

const ImageCarousel = ({ images }) => {
  const [currentImage, setCurrentImage] = useState(0);

  const nextImage = () => {
    setCurrentImage((currentImage + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImage(currentImage === 0 ? images.length - 1 : currentImage - 1);
  };

  return (
    <div className="image-carousel">
      <div className="carousel-image">
        {images[currentImage].type === 0 ? (
          <img src={images[currentImage].url} alt="Post" className="new-img" />
        ) : (
          <video className="new-img" controls src={images[currentImage].url}>
            <source src={images[currentImage].url} type="video/mp4" />
          </video>
        )}

        {/* <div className="image-counter">
          <p className="post-photo-count">
            {currentImage + 1}/{images.length}
          </p>
        </div> */}
      </div>
      {/* <button className="prev-button" onClick={prevImage}>
        &#8249;
      </button>
      <button className="next-button" onClick={nextImage}>
        &#8250;
      </button> */}
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
