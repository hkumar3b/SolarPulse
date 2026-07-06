import { useState, useEffect, useRef } from "react";
export function ThresholdSlider({ threshold, onChange }: Props) {
  const [localValue, setLocalValue] = useState(threshold);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleSlide = (value: number) => {
    setLocalValue(value); // updates the displayed number instantly
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      onChange(value); // only fires the actual fetch after 300ms of no movement
    }, 1000);
  };
  useEffect(() => {
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, []);
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: "10px",
        margin: "12px 0",
      }}
    >
      <label
        htmlFor="threshold-slider"
        style={{ fontSize: "14px", color: "#444" }}
      >
        ⚙ Alert Threshold:
      </label>
      <input
        id="threshold-slider"
        type="range"
        min={0.5}
        max={1.0}
        step={0.05}
        value={threshold}
        onChange={(e) => onChange(parseFloat(e.target.value))}
        style={{ width: "160px" }}
      />
      <span style={{ fontWeight: "bold", minWidth: "48px" }}>
        {(threshold * 100).toFixed(0)}%
      </span>
    </div>
  );
}

interface Props {
  threshold: number;
  onChange: (value: number) => void;
}
