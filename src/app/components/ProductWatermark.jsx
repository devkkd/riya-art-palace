"use client";

import Image from "next/image";

export default function ProductWatermark({
  size = "default",
  position = "bottom-right",
  className = "",
  style = {},
}) {
  const configs = {
    sm: {
      boxSize: 28,
      offset: 7,
    },
    default: {
      boxSize: 34,
      offset: 8,
    },
    lg: {
      boxSize: 44,
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
    // borderRadius: "50%",
    pointerEvents: "none",
    userSelect: "none",
    WebkitUserSelect: "none",
    display: "inline-flex",
    alignItems: "center",
    justifyContent: "center",
    // background: "rgba(255, 255, 255, 0.55)",
    backdropFilter: "blur(3px)",
    WebkitBackdropFilter: "blur(3px)",
    border: "1px solid rgba(255, 255, 255, 0.65)",
    boxShadow: "0 1px 5px rgba(0, 0, 0, 0.1)",
    overflow: "hidden",
    flexShrink: 0,
    opacity: 0.9,
    ...style,
  };

  return (
    <div
      className={`rap-watermark rap-watermark-${size} rap-watermark-${position} ${className}`}
      style={containerStyle}
      title="Riya Art Palace"
      aria-label="Riya Art Palace Watermark"
    >
      <Image
        src="/watermark.png"
        alt="Riya Art Palace"
        width={cfg.boxSize}
        height={cfg.boxSize}
        style={{ objectFit: "contain", borderRadius: "50%" }}
        draggable={false}
      />
    </div>
  );
}
