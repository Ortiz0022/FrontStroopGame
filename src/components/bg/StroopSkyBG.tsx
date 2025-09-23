import React, { useMemo } from "react";
import "./stroop-sky.css";

type Props = {
  /** cuánto “movimiento” quieres (1 = suave, 2 = medio, 3 = más) */
  intensity?: 1 | 2 | 3;
  /** z-index negativo por defecto para ir detrás de todo */
  zIndex?: number;
};

export default function StroopSkyBG({ intensity = 1, zIndex = -10 }: Props) {
  // Genera estrellas una sola vez (posición, escala y delay)
  const stars = useMemo(() => {
    const N = 90;
    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    return Array.from({ length: N }, (_, i) => ({
      id: i,
      top: `${rnd(5, 90)}%`,
      left: `${rnd(2, 98)}%`,
      size: rnd(0.8, 1.8),
      delay: `${rnd(0, 5)}s`,
      dur: `${rnd(2.2, 4.5)}s`,
    }));
  }, []);

  return (
    <div className="stroop-sky" style={{ zIndex }}>
      {/* capa 1: gradiente del cielo (muy suave) */}
      <div className={`sky-grad i-${intensity}`} />

      {/* capa 2: rejilla estelar muy sutil */}
      <div className={`sky-grid i-${intensity}`} />

      {/* capa 3: estrellas */}
      <div className="sky-stars">
        {stars.map((s) => (
          <span
            key={s.id}
            className="star"
            style={
              {
                top: s.top,
                left: s.left,
                "--s": s.size,
                "--d": s.delay,
                "--t": s.dur,
              } as React.CSSProperties
            }
          />
        ))}
      </div>

      {/* capa 4: luna */}
      <div className="moon" aria-hidden />

      {/* capa 5: nubes (parallax) */}
      <div className={`cloud c1 i-${intensity}`} />
      <div className={`cloud c2 i-${intensity}`} />
      <div className={`cloud c3 i-${intensity}`} />

      {/* capa 6: skyline al fondo */}
      <div className="skyline" />
    </div>
  );
}