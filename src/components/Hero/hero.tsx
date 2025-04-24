'use client';

import React, { useEffect, useRef, useState, MouseEvent, ReactNode } from 'react';
import { motion, AnimatePresence, useAnimate } from 'framer-motion';
import { twMerge } from 'tailwind-merge';
import { FiMousePointer } from 'react-icons/fi';

const API_KEY = 'p69sf3H2cEkDl0znNhFe4zkv7Pe4sPEfw6IhoOWC4gLPEhsrq5ppLD1Q';

type PexelsPhoto = {
  src: {
    landscape: string;
  };
};

const Hero: React.FC = () => {
  const [imageUrl, setImageUrl] = useState<string>('');
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [imageList, setImageList] = useState<string[]>([]);
  const [trailImages, setTrailImages] = useState<string[]>([]);

  const fetchImages = async () => {
    setRefreshing(true);
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=aesthetic&per_page=10`, {
        headers: { Authorization: API_KEY },
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        const random: PexelsPhoto = data.photos[Math.floor(Math.random() * data.photos.length)];
        setImageUrl(random.src.landscape);
        setImageList(data.photos.map((photo: PexelsPhoto) => photo.src.landscape));
      }
    } catch (error) {
      console.error('Error fetching images from Pexels:', error);
    } finally {
      setTimeout(() => setRefreshing(false), 300);
    }
  };

  const fetchTrailImages = async () => {
    try {
      const res = await fetch(`https://api.pexels.com/v1/search?query=interactive&per_page=16`, {
        headers: { Authorization: API_KEY },
      });
      const data = await res.json();
      if (data.photos && data.photos.length > 0) {
        const trailImageUrls = data.photos.map((photo: PexelsPhoto) => photo.src.landscape);
        setTrailImages(trailImageUrls);
      }
    } catch (error) {
      console.error('Error fetching trail images from Pexels:', error);
    }
  };

  useEffect(() => {
    fetchImages();
    fetchTrailImages();
  }, []);

  return (
    <div className="overflow-x-hidden scroll-smooth">
      <section
        id="home"
        className="min-h-screen bg-black text-white flex flex-col gap-4 items-center justify-center px-6 relative overflow-hidden pt-0"
      >
        <SlideTabs />

        <AnimatePresence mode="wait">
          {imageUrl && !refreshing && (
            <motion.div
              key={imageUrl}
              initial={{ opacity: 0, scale: 1.05 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              transition={{ duration: 0.8 }}
              className="absolute inset-0 bg-cover bg-center z-0"
              style={{ backgroundImage: `url(${imageUrl})`, filter: 'brightness(60%)' }}
            />
          )}
        </AnimatePresence>

        <div className="z-10 max-w-7xl w-full grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
          <motion.div initial={{ opacity: 0, y: 80 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1 }}>
            <h1 className="text-5xl md:text-6xl font-bold mb-6 leading-tight">
              Discover <span className="text-cyan-400">Aesthetic</span> Beauty
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-6">
              Handpicked visuals from creative minds across the globe — randomized every time. Made By Shreepaada M C
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={fetchImages}
              className="bg-cyan-500 hover:bg-cyan-600 text-white px-6 py-3 rounded-xl text-lg font-medium shadow-lg"
            >
              change background
            </motion.button>
          </motion.div>

          {imageUrl && (
            <div className="rounded-2xl overflow-hidden shadow-2xl w-full h-[400px] z-10 cursor-pointer" onClick={fetchImages}>
              <AnimatePresence mode="wait">
                {!refreshing && (
                  <motion.img
                    key={imageUrl + '-card'}
                    src={imageUrl}
                    alt="Aesthetic Random"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.5 }}
                    className="w-full h-full object-cover"
                  />
                )}
              </AnimatePresence>
            </div>
          )}
        </div>
      </section>

      <section id="shuffle" className="relative grid min-h-screen w-full place-content-center overflow-hidden bg-neutral-950">
        <h2 className="relative z-0 text-[15vw] font-black text-neutral-800 md:text-[200px] text-center">
          goooooo <span className="text-indigo-500">Shuffle</span>
        </h2>
        <Cards imageList={imageList} />
      </section>

      <MouseImageTrailSection trailImages={trailImages} />
    </div>
  );
};

const SlideTabs: React.FC = () => {
  const [position, setPosition] = useState({ left: 0, width: 0, opacity: 0 });

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  const tabs = ['Home', 'shuffle'];

  return (
    <ul
      onMouseLeave={() => setPosition((pv) => ({ ...pv, opacity: 0 }))}
      className="z-50 flex w-fit rounded-full border-2 border-white bg-black p-1"
    >
      {tabs.map((tab) => (
        <li
          key={tab}
          className="relative z-10 block cursor-pointer px-3 py-1.5 text-xs uppercase text-white mix-blend-difference md:px-5 md:py-3 md:text-base"
          onMouseEnter={(e) => {
            const { offsetLeft, offsetWidth } = e.currentTarget;
            setPosition({ left: offsetLeft, width: offsetWidth, opacity: 1 });
          }}
          onClick={() => scrollToSection(tab.toLowerCase())}
        >
          {tab}
        </li>
      ))}
      <motion.li animate={{ ...position }} className="absolute z-0 h-7 rounded-full bg-white md:h-12" />
    </ul>
  );
};

const Cards: React.FC<{ imageList: string[] }> = ({ imageList }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  return (
    <div className="absolute inset-0 z-10" ref={containerRef}>
      {imageList.slice(0, 6).map((img, index) => (
        <Card
          key={img}
          containerRef={containerRef}
          src={img}
          alt={`Random image ${index}`}
          rotate={`${(index - 2) * 6}deg`}
          top={`${15 + index * 5}%`}
          left={`${20 + index * 7}%`}
          className="w-36 md:w-56"
        />
      ))}
    </div>
  );
};

const Card: React.FC<{
  containerRef: React.RefObject<HTMLDivElement>;
  src: string;
  alt: string;
  top: string;
  left: string;
  rotate: string;
  className?: string;
}> = ({ containerRef, src, alt, top, left, rotate, className }) => {
  const [zIndex, setZIndex] = useState<number>(0);

  const updateZIndex = () => {
    const els = document.querySelectorAll('.drag-elements');
    let maxZ = -Infinity;
    els.forEach((el) => {
      const z = parseInt(window.getComputedStyle(el).getPropertyValue('z-index'));
      if (!isNaN(z) && z > maxZ) maxZ = z;
    });
    setZIndex(maxZ + 1);
  };

  return (
    <motion.img
      onMouseDown={updateZIndex}
      style={{ top, left, rotate, zIndex }}
      className={twMerge('drag-elements absolute w-48 bg-neutral-200 p-1 pb-4', className)}
      src={src}
      alt={alt}
      drag
      dragConstraints={containerRef}
      dragElastic={0.65}
    />
  );
};

const MouseImageTrailSection: React.FC<{ trailImages: string[] }> = ({ trailImages }) => {
  return (
    <MouseImageTrail renderImageBuffer={50} rotationRange={25} images={trailImages}>
      <section className="grid h-screen w-full place-content-center bg-white">
        <p className="flex items-center gap-2 text-3xl font-bold uppercase text-black">
          <FiMousePointer /> <span>Hover me</span>
        </p>
      </section>
    </MouseImageTrail>
  );
};

const MouseImageTrail: React.FC<{
  children: ReactNode;
  images: string[];
  renderImageBuffer: number;
  rotationRange: number;
}> = ({ children, images, renderImageBuffer, rotationRange }) => {
  const [scope, animate] = useAnimate();
  const lastRenderPosition = useRef({ x: 0, y: 0 });
  const imageRenderCount = useRef(0);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY } = e;
    const distance = calculateDistance(clientX, clientY, lastRenderPosition.current.x, lastRenderPosition.current.y);
    if (distance >= renderImageBuffer) {
      lastRenderPosition.current.x = clientX;
      lastRenderPosition.current.y = clientY;
      renderNextImage();
    }
  };

  const calculateDistance = (x1: number, y1: number, x2: number, y2: number): number => {
    const deltaX = x2 - x1;
    const deltaY = y2 - y1;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  };

  const renderNextImage = () => {
    const imageIndex = imageRenderCount.current % images.length;
    const selector = `[data-mouse-move-index="${imageIndex}"]`;
    const el = document.querySelector(selector) as HTMLImageElement | null;
    if (el) {
      el.style.top = `${lastRenderPosition.current.y}px`;
      el.style.left = `${lastRenderPosition.current.x}px`;
      el.style.zIndex = imageRenderCount.current.toString();
      const rotation = Math.random() * rotationRange;
      animate(
        selector,
        {
          opacity: [0, 1],
          transform: [
            `translate(-50%, -25%) scale(0.5) rotate(${imageIndex % 2 === 0 ? '-' : ''}${rotation}deg)`,
            `translate(-50%, -50%) scale(1) rotate(${imageIndex % 2 !== 0 ? '-' : ''}${rotation}deg)`,
          ],
        },
        { type: 'spring', damping: 15, stiffness: 200 }
      );
      animate(selector, { opacity: [1, 0] }, { ease: 'linear', duration: 0.5, delay: 5 });
      imageRenderCount.current++;
    }
  };

  return (
    <div ref={scope} className="relative overflow-hidden" onMouseMove={handleMouseMove}>
      {children}
      {images.map((img, index) => (
        <img
          key={index}
          className="pointer-events-none absolute left-0 top-0 h-48 w-auto rounded-xl border-2 border-black bg-neutral-900 object-cover opacity-0"
          src={img}
          alt={`Mouse move image ${index}`}
          data-mouse-move-index={index}
        />
      ))}
    </div>
  );
};

export default Hero;
