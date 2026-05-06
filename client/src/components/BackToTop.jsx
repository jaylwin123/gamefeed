import { useState, useEffect } from "react";

export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    function onScroll() { setShow(window.scrollY > 450); }
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!show) return null;

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Volver arriba"
      title="Volver arriba"
      className="fixed bottom-6 right-6 z-50 w-10 h-10 rounded-full bg-accent-purple text-white flex items-center justify-center border border-accent-purple/50 hover:bg-accent-purple/80 hover:scale-110 transition-all duration-200"
      style={{ boxShadow: "0 0 20px rgba(124,58,237,0.5)" }}
    >
      &#8593;
    </button>
  );
}
