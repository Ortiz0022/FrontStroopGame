export default function RoundsControl({
    value,
    onChange,
    onStart,
    disabled,
    isOwner,
  }: {
    value: number;
    onChange: (n: number) => void;
    onStart: () => void;
    disabled: boolean;
    isOwner: boolean;
  }) {
    return (
      <div className="card" style={{ display: "flex", gap: 12, alignItems: "center" }}>
        <label>
          Rondas por jugador:
          <input
            type="number"
            min={1}
            max={10}
            value={value}
            onChange={(e) => onChange(parseInt(e.target.value || "4", 10))}
            style={{ width: 70 }}
          />
        </label>
        <button onClick={onStart} disabled={disabled || !isOwner}>
          Iniciar juego (owner)
        </button>
        {!isOwner && <span className="pill">Esperando al owner…</span>}
      </div>
    );
  }
  