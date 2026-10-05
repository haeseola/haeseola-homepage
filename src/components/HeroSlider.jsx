import React, { useState, useEffect, useRef, useCallback } from 'react';

const IMAGES = [
  '1.jpg',
  '2.png',
  '3.png',
  '4.png',
  '5.png',
  '6.png'
];

function HeroSlider() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);
  const timerRef = useRef(null);
  
  const isReducedMotion = useRef(
    window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches
  ).current;

  const getImageUrl = (path) => {
    return `${import.meta.env.BASE_URL}${path}`;
  };

  const nextSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % IMAGES.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentIndex((prevIndex) => (prevIndex - 1 + IMAGES.length) % IMAGES.length);
  }, []);

  const startTimer = useCallback(() => {
    if (IMAGES.length <= 1 || isReducedMotion) return;
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!isHovered) {
        nextSlide();
      }
    }, 4000);
  }, [isHovered, nextSlide, isReducedMotion]);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };

  const handleTouchEnd = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
    handleSwipe();
  };

  const handleSwipe = () => {
    if (IMAGES.length <= 1) return;
    const diff = touchStartX.current - touchEndX.current;
    if (diff > 40) {
      nextSlide();
      startTimer();
    } else if (diff < -40) {
      prevSlide();
      startTimer();
    }
  };

  const handleDotClick = (index) => {
    setCurrentIndex(index);
    startTimer();
  };

  if (IMAGES.length === 0) return null;

  return (
    <div 
      className="hero-slider-container"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <div 
        className="hero-slider-track" 
        style={{ transform: `translateX(-${currentIndex * 100}%)` }}
      >
        {IMAGES.map((img, idx) => (
          <div key={idx} className="hero-slider-slide">
            <img 
              src={getImageUrl(img)} 
              alt={`해설아 이미지 ${idx + 1}`} 
              loading={idx === 0 ? "eager" : "lazy"}
              className="hero-slider-img"
            />
          </div>
        ))}
      </div>
      
      {IMAGES.length > 1 && (
        <div className="hero-slider-dots">
          {IMAGES.map((_, idx) => (
            <button
              key={idx}
              className={`hero-slider-dot ${idx === currentIndex ? 'active' : ''}`}
              onClick={() => handleDotClick(idx)}
              aria-label={`슬라이드 ${idx + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default HeroSlider;
