import { useEffect, useRef, useState } from "react";
import "./AnimatedPaw.css";

const DEFAULT_MAX_PAWS = 20;
const DEFAULT_SPAWN_INTERVAL = 1000;

export default function AnimatedPaw({
  maxPaws = DEFAULT_MAX_PAWS,
  spawnInterval = DEFAULT_SPAWN_INTERVAL,
  useEmoji = true,
  pawSrc = "/assets/paw-print.png",
}) {
  const [paws, setPaws] = useState([]);
  const idRef = useRef(0);
  const intervalRef = useRef(null);

  const prefersReducedMotion =
    typeof window !== "undefined" &&
    window.matchMedia &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  useEffect(() => {
    if (prefersReducedMotion) {
      spawnPaw(true);
      return;
    }

    intervalRef.current = setInterval(() => {
      spawnPaw(false);
    }, spawnInterval);

    return () => clearInterval(intervalRef.current);
  }, [spawnInterval, prefersReducedMotion]);

  function spawnPaw(reduced) {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const margin = 64;

    const x = Math.random() * (vw - margin * 2) + margin;
    const y = Math.random() * (vh - margin * 2) + margin;
    const rot = Math.floor(Math.random() * 360);
    const scale = 0.6 + Math.random() * 0.8;
    const duration = 3000 + Math.random() * 1500;
    const driftX = (Math.random() - 0.5) * 100;
    const driftY = (Math.random() - 0.5) * 100;

    const id = idRef.current++;
    const pawObj = { id, x, y, rot, scale, duration, driftX, driftY };
    setPaws((prev) => {
      const updated = prev.length >= maxPaws ? prev.slice(1) : prev;
      return [...updated, pawObj];
    });
  }

  function handleAnimEnd(id) {
    setPaws((prev) => prev.filter((p) => p.id !== id));
  }

  return (
    <>
      {paws.map((paw) => (
        <span
          key={paw.id}
          className="random-paw-print"
          style={{
            top: `${paw.y}px`,
            left: `${paw.x}px`,
            transform: `rotate(${paw.rot}deg) scale(${paw.scale})`,
            animationDuration: `${paw.duration}ms`,
            "--drift-x": `${paw.driftX}px`,
            "--drift-y": `${paw.driftY}px`,
          }}
          onAnimationEnd={() => handleAnimEnd(paw.id)}
          aria-hidden="true"
        >
          {useEmoji ? "🐾" : <img src={pawSrc} alt="paw" />}
        </span>
      ))}
    </>
  );
}