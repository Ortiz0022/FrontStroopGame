import React, { useMemo } from "react";
import "./stroop-sky.css";

type Props = {
  intensity?: 1 | 2 | 3;
  zIndex?: number;
};

export default function StroopSkyBG({ intensity = 1, zIndex = -10 }: Props) {
  const stars = useMemo(() => {
    const N = 90;
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    return Array.from({ length: N }, (_, i) => ({
      id: i,
      top: rnd(5, 90) + "%",
      left: rnd(2, 98) + "%",
      size: rnd(0.8, 1.8),
      delay: rnd(0, 5) + "s",
      dur: rnd(2.2, 4.5) + "s",
    }));
  }, []);

  return (
    <div className={`stroop-sky i-${intensity}`} style={{ zIndex }}>
      {/* Capa 1: gradiente del cielo */}
      <div className={`sky-grad i-${intensity}`} />

      {/* Capa 2: rejilla estelar */}
      <div className={`sky-grid i-${intensity}`} />

      {/* Capa 3: estrellas */}
      <div className="sky-stars">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={{
              top: s.top,
              left: s.left,
              "--s": s.size,
              "--d": s.delay,
              "--t": s.dur,
            } as React.CSSProperties}
          />
        ))}
      </div>

      {/* Capa 4: luna y rocas flotantes */}
      <div className="moon" />
      <div className="floating-rock rock-1" />
      <div className="floating-rock rock-2" />
      <div className="floating-rock rock-3" />
      <div className="floating-rock rock-4" />
      <div className="floating-rock rock-5" />

      {/* Capa 5: nubes */}
      <div className={`cloud c1 i-${intensity}`} />
      <div className={`cloud c2 i-${intensity}`} />
      <div className={`cloud c3 i-${intensity}`} />

      {/* Capa 6: skyline */}
      <div className="skyline" />

      {/* Capa 7: castillo mágico */}
      <div className="magical-castle">
        <div className="castle-main">
          <div className="castle-flag" />
        </div>
        <div className="castle-tower-left">
          <div className="castle-flag" />
        </div>
        <div className="castle-tower-right">
          <div className="castle-flag" />
        </div>
      </div>
    </div>
  );
}