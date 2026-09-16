"use client";

import { Copyright } from "lucide-react";

export default function ProductWatermark({
  size = "default",
  position = "bottom-right",
  className = "",
  style = {},
}) {
  const configs = {
    sm: {
      boxSize: 20,
      iconSize: 11,
      offset: 7,
    },
    default: {
      boxSize: 22,
      iconSize: 12,
      offset: 8,
    },
    lg: {
      boxSize: 28,
      iconSize: 16,
      offset: 12,
    },
  };

  const cfg = configs[size] || configs.default;

  const positionStyles = {
    "bottom-right": { bottom: cfg.offset, right: cfg.offset },
    "bottom-left": { bottom: cfg.offset, left: cfg.offset },
    "top-right": { top: cfg.offset, right: cfg.offset },
    "top-left": { top: cfg.offset, left: cfg.offset },
  };

  const containerStyle = {
    position: "absolute",
    ...(positionStyles[position] || positionStyles["bottom-right"]),
    zIndex: 10,
    width: `${cfg.boxSize}px`,
    height: `${cfg.boxSize}px`,
    borderRadius: "50%",
    pointerEvents: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    background: "rgba(255, 255, 255, 0.75)",
    backdropFilter: "blur(4px)",
    WebkitBackdropFilter: "blur(4px)",
    border: "1px solid rgba(255, 255, 255, 0.85)",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.12)",
    color: "#2D241E",
    lineHeight: 1,
    flexShrink: 0,
    ...style,
  };

  return (
    <div
      className={`rap-watermark rap-watermark-${size} rap-watermark-${position} ${className}`}
      style={containerStyle}
      title="Riya Art Palace"
      aria-label="Watermark"
    >
      <Copyright size={cfg.iconSize} strokeWidth={2.4} />
    </div>
  );
}
