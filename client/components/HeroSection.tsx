import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect } from "react";

interface Slide {
  id: string;
  image: string;
  alt: string;
  order: number;
  title: string;
  description: string;
  button1_text: string;
  button1_link: string;
  button2_text: string;
  button2_link: string;
}

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);

  // Default slides for fallback
  const defaultSlides = [
    {
      id: "1",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F11b105e941ff40af8cd2ef0003fa406d%2F80f49dcbcff144e48bb99a3e868cbfec?format=webp&width=800",
      alt: "Luxence Brand Banner 1",
      order: 0,
      title: "Illuminez vos espaces",
      description: "Des luminaires élégants pour sublimer vos intérieurs.",
      button1_text: "Découvrir",
      button1_link: "/products",
      button2_text: "En savoir plus",
      button2_link: "/about",
    },
    {
      id: "2",
      image:
        "https://cdn.builder.io/api/v1/image/assets%2F11b105e941ff40af8cd2ef0003fa406d%2F46093dda2072493bb83a5549bcecfaf9?format=webp&width=800",
      alt: "Luxence Brand Banner 2",
      order: 1,
      title: "Luxe et Innovation",
      description: "Découvrez notre collection premium de luminaires.",
      button1_text: "Voir la collection",
      button1_link: "/products",
      button2_text: "En savoir plus",
      button2_link: "/about",
    },
  ];

  useEffect(() => {
    const fetchSlides = async () => {
      try {
        const response = await fetch("/api/slides");
        if (response.ok) {
          const data = await response.json();
          setSlides(data.sort((a: Slide, b: Slide) => a.order - b.order));
        } else {
          setSlides(defaultSlides);
        }
      } catch (error) {
        console.error("Error fetching hero slides:", error);
        setSlides(defaultSlides);
      } finally {
        setLoading(false);
      }
    };

    fetchSlides();
  }, []);

  // Auto-play carousel
  useEffect(() => {
    if (!isAutoPlay || slides.length === 0) return;

    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlay, slides.length]);

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const nextSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
    setIsAutoPlay(false);
    setTimeout(() => setIsAutoPlay(true), 10000);
  };

  return (
    <section className="relative w-full h-[500px] md:h-[600px] overflow-hidden group">
      {/* Background Image Carousel */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-all duration-700 ease-out ${
            index === currentSlide
              ? "opacity-100 scale-100"
              : "opacity-0 scale-105"
          }`}
        >
          <img
            src={slide.image}
            alt={slide.alt}
            className="w-full h-full object-cover"
            loading="eager"
            decoding="async"
          />
          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-black/40" />
        </div>
      ))}

      {/* Text Content Overlay */}
      <div className="absolute inset-0 flex items-center justify-start z-10">
        <div className="container mx-auto px-4 md:px-8">
          <div className="max-w-lg animate-fade-in space-y-6">
            <div className="space-y-4">
              <p
                className="text-accent font-roboto text-xs font-semibold uppercase tracking-widest animate-slide-up opacity-0"
                style={{ animation: "slide-up 0.6s ease-out 0.2s forwards" }}
              >
                Luxury Lighting
              </p>
              <h1
                className="text-4xl md:text-5xl lg:text-6xl font-futura font-bold leading-tight text-white animate-slide-up opacity-0"
                style={{ animation: "slide-up 0.6s ease-out 0.3s forwards" }}
              >
                {slides[currentSlide]?.title || "Illuminez vos espaces"}
              </h1>
            </div>

            <p
              className="text-sm md:text-base text-white/90 font-roboto leading-relaxed animate-slide-up opacity-0"
              style={{ animation: "slide-up 0.6s ease-out 0.4s forwards" }}
            >
              {slides[currentSlide]?.description ||
                "Des luminaires élégants pour sublimer vos intérieurs."}
            </p>

            <div
              className="flex flex-col sm:flex-row gap-3 pt-4 animate-slide-up opacity-0"
              style={{ animation: "slide-up 0.6s ease-out 0.5s forwards" }}
            >
              <Link
                to={slides[currentSlide]?.button1_link || "/products"}
                className="inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent/90 text-white px-6 py-3 rounded-lg font-futura font-bold text-sm transition-all duration-300 hover:shadow-lg group active:scale-95"
              >
                {slides[currentSlide]?.button1_text || "Découvrir"}
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
              <Link
                to={slides[currentSlide]?.button2_link || "/about"}
                className="inline-flex items-center justify-center gap-2 border-2 border-white text-white hover:bg-white/10 px-6 py-3 rounded-lg font-futura font-bold text-sm transition-all duration-300 hover:shadow-lg active:scale-95"
              >
                {slides[currentSlide]?.button2_text || "En savoir plus"}
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <button
        onClick={prevSlide}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Diapositif précédent"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>

      <button
        onClick={nextSlide}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-white/20 hover:bg-white/40 text-white p-3 rounded-full transition-all duration-300 hover:scale-110 active:scale-95 opacity-0 group-hover:opacity-100"
        aria-label="Diapositif suivant"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={`h-2 rounded-full transition-all duration-300 ${
              index === currentSlide
                ? "bg-accent w-8"
                : "bg-white/50 hover:bg-white/75 w-2"
            }`}
            aria-label={`Aller à la diapositive ${index + 1}`}
          />
        ))}
      </div>
    </section>
  );
}
