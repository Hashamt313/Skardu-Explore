import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import bg1 from '../../assets/backgroundbanner.png';
import bg2 from '../../assets/image copy.png';
import bg3 from '../../assets/image.png';
import bg1 from '../../assets/backgroundbanner.jpg';
import bg2 from '../../assets/image-copy.jpg';
import bg3 from '../../assets/image.jpg';

const slides = [
  {

export default function HeroSlider() {
  const [current, setCurrent] = useState(0);
  const [loadRemaining, setLoadRemaining] = useState(false);

  const goTo = useCallback((idx) => {
    setCurrent((idx + slides.length) % slides.length);
    return () => clearInterval(t);
  }, [current, goTo]);

  useEffect(() => {
    const loadRemainingSlides = () => setLoadRemaining(true);

    if (document.readyState === 'complete') {
      const timer = setTimeout(loadRemainingSlides, 0);
      return () => clearTimeout(timer);
    }

    window.addEventListener('load', loadRemainingSlides, { once: true });
    return () => window.removeEventListener('load', loadRemainingSlides);
  }, []);

  return (
    <section id="home" className="hero">
      <link rel="preload" as="image" href={bg1} fetchPriority="high" />
      <div className="hero-slider">
        {slides.map((s, i) => (
          <div
            key={i}
            className={`slide ${i === current ? 'active' : ''}`}
            style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('${s.bg}')` }}
            style={{
              backgroundImage: (i === 0 || loadRemaining)
                ? `linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.5)),url('${s.bg}')`
                : undefined,
            }}
          >
            <div className="container hero-content">
              <h1 className="fade-in">{s.h1}</h1>
