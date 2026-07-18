import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import bg1 from '../../assets/backgroundbanner.png';
import bg2 from '../../assets/image copy.png';
import bg3 from '../../assets/image.png';

const slides = [
  {
    bg: bg1,
    h1: 'Skardu Explore: Car Rentals & Tours',
    p:  'Premium Prado rentals and guided tour packages to K2, Deosai, and Hunza',
  },
  {
    bg: bg2,
    h1: 'Professional Drivers for Skardu',
    p:  'Local guides with mountain experience and safe, comfy vehicles',
  },
  {
    bg: bg3,
    h1: 'Modern Fleet Ready',
    p:  'Choose from Prado, Corolla, Premio, and Grand Cabin for all routes',
  },
];

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);

  const goTo = useCallback((idx) => {
    setCurrent((idx + slides.length) % slides.length);
  }, []);

  useEffect(() => {
    const t = setInterval(() => goTo(current + 1), 5000);
    return () => clearInterval(t);
  }, [current, goTo]);

  return (
    <section id="home" className="hero">
      <div className="hero-slider">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('${s.bg}')` }}
          >
            <div className="container hero-content">
              <h1 className="fade-in">{s.h1}</h1>
              <p className="fade-in-delay">{s.p}</p>
              <div className="hero-btns fade-in-delay-2">
                <a href="https://wa.me/923182277086" target="_blank" rel="noreferrer" className="btn btn-primary btn-lg">Book via WhatsApp</a>
                <a href="#fleet" className="btn btn-outline btn-lg">View Our Fleet</a>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="slider-controls">
        <button onClick={() => goTo(current - 1)}><ChevronLeft size={22} /></button>
        <button onClick={() => goTo(current + 1)}><ChevronRight size={22} /></button>
      </div>

      <div className="slider-dots">
        {slides.map((_, i) => (
          <div
            key={i}
            className={`dot ${i === current ? 'active' : ''}`}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    </section>
  );
}
