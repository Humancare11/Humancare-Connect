import { useEffect, useRef } from "react";
import Lenis from "lenis";

export default function useLenis() {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const lenis = new Lenis({
      lerp: 0.07, // slightly higher to remove lag
      smoothWheel: true,
      smoothTouch: false, // 🔥 important: avoid lag on desktop
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    lenisRef.current = lenis;

    return () => {
      lenis.destroy();
    };
  }, []);
}
