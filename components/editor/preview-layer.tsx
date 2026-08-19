'use client';

import { useEditorStore, PDFElement } from "@/lib/store";
import { TEXT_LINE_HEIGHT, TEXT_PADDING_X, TEXT_PADDING_Y } from "@/lib/text-metrics";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface PreviewLayerProps {
  pageIndex: number;
  scale: number;
  pageWidth: number;
  pageHeight: number;
}

export function PreviewLayer({ pageIndex, scale, pageWidth, pageHeight }: PreviewLayerProps) {
  const { layers } = useEditorStore();
  const elements = layers[pageIndex] || [];
  const containerRef = useRef<HTMLDivElement>(null);

  if (elements.length === 0) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 pointer-events-none"
      style={{
        width: pageWidth,
        height: pageHeight,
      }}
    >
      {elements.map((el) => (
        <PreviewElement key={el.id} element={el} scale={scale} />
      ))}
    </div>
  );
}

function PreviewElement({ element, scale }: { element: PDFElement; scale: number }) {
  const { type, x, y, width, height, rotation, content, style } = element;

  const baseStyle: React.CSSProperties = {
    position: "absolute",
    left: x * scale,
    top: y * scale,
    width: width * scale,
    height: height * scale,
    transform: `rotate(${rotation || 0}deg)`,
    transformOrigin: "center center",
    opacity: style.opacity ?? 1,
    pointerEvents: "none",
  };

  switch (type) {
    case "text":
      return (
        <div
          style={{
            ...baseStyle,
            color: style.color || "#000000",
            fontSize: (style.fontSize || 16) * scale,
            fontFamily: style.fontFamily || "inherit",
            fontWeight: style.fontWeight || "normal",
            fontStyle: style.fontStyle || "normal",
            textDecoration: style.textDecoration || "none",
            textAlign: style.textAlign || "left",
            backgroundColor: style.backgroundColor || "transparent",
            padding: `${TEXT_PADDING_Y * scale}px ${TEXT_PADDING_X * scale}px`,
            lineHeight: TEXT_LINE_HEIGHT,
            wordBreak: "break-word",
            overflow: "hidden",
          }}
        >
          {content}
        </div>
      );

    case "image":
      if (!content) return null;
      return (
        <img
          src={content}
          alt=""
          style={{
            ...baseStyle,
            objectFit: "contain",
          }}
        />
      );

    case "rect":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: style.backgroundColor || "transparent",
            border: style.borderWidth
              ? `${style.borderWidth * scale}px ${style.strokeStyle || "solid"} ${style.borderColor || "#000000"}`
              : "none",
            borderRadius: style.borderRadius ? style.borderRadius * scale : 0,
            borderTopLeftRadius: style.borderTopLeftRadius ? style.borderTopLeftRadius * scale : undefined,
            borderTopRightRadius: style.borderTopRightRadius ? style.borderTopRightRadius * scale : undefined,
            borderBottomLeftRadius: style.borderBottomLeftRadius ? style.borderBottomLeftRadius * scale : undefined,
            borderBottomRightRadius: style.borderBottomRightRadius ? style.borderBottomRightRadius * scale : undefined,
          }}
        />
      );

    case "circle":
      return (
        <div
          style={{
            ...baseStyle,
            backgroundColor: style.backgroundColor || "transparent",
            border: style.borderWidth
              ? `${style.borderWidth * scale}px ${style.strokeStyle || "solid"} ${style.borderColor || "#000000"}`
              : "none",
            borderRadius: "50%",
          }}
        />
      );

    case "line":
    case "arrow":
      return <PreviewLine element={element} scale={scale} />;

    case "signature":
      if (!content) return null;
      return (
        <img
          src={content}
          alt="element"
          style={{
            ...baseStyle,
            objectFit: "contain",
          }}
        />
      );

    default:
      return null;
  }
}

function PreviewLine({ element, scale }: { element: PDFElement; scale: number }) {
  const { id, x, y, width, height, style, type } = element;
  const isArrow = type === "arrow";

  const startPt = style.start ?? { x, y: y + height / 2 };
  const endPt = style.end ?? { x: x + width, y: y + height / 2 };
  const borderWidth = style.borderWidth ?? 1;

  const startLocalX = (startPt.x - x) * scale;
  const startLocalY = (startPt.y - y) * scale;
  const endLocalX = (endPt.x - x) * scale;
  const endLocalY = (endPt.y - y) * scale;

  const sl = style.sloppiness ?? 0;
  const dx = endPt.x - startPt.x;
  const dy = endPt.y - startPt.y;
  const len = Math.hypot(dx, dy) || 1;
  const nx = -dy / len;
  const ny = dx / len;

  const midX = (startPt.x + endPt.x) / 2;
  const midY = (startPt.y + endPt.y) / 2;
  const controlX = midX + nx * sl;
  const controlY = midY + ny * sl;
  const controlLocalX = (controlX - x) * scale;
  const controlLocalY = (controlY - y) * scale;

  const strokeColor = style.backgroundColor || "#000000";
  const strokeWidth = borderWidth * scale;

  const dasharray =
    style.strokeStyle === "dashed"
      ? "10, 5"
      : style.strokeStyle === "dotted"
      ? "2, 5"
      : "none";

  const rawMarker = Math.round(Math.max(8, Math.min(24, strokeWidth * 2)));
  const maxByLen = Math.max(8, Math.min(24, Math.round(len * scale * 0.25)));
  const markerLen = Math.min(rawMarker, maxByLen);
  const markerHalf = markerLen / 2;

  return (
    <svg
      width={width * scale}
      height={height * scale}
      style={{
        position: "absolute",
        left: x * scale,
        top: y * scale,
        overflow: "visible",
        pointerEvents: "none",
      }}
    >
      {isArrow && (
        <defs>
          {style.arrowStart && (
            <marker
              id={`preview-arrow-start-${id}`}
              markerUnits="userSpaceOnUse"
              markerWidth={markerLen}
              markerHeight={markerLen}
              refX={0}
              refY={markerHalf}
              orient="auto"
            >
              <polygon
                points={`${markerLen} 0, 0 ${markerHalf}, ${markerLen} ${markerLen}`}
                fill={strokeColor}
              />
            </marker>
          )}
          {style.arrowEnd && (
            <marker
              id={`preview-arrow-end-${id}`}
              markerUnits="userSpaceOnUse"
              markerWidth={markerLen}
              markerHeight={markerLen}
              refX={markerLen}
              refY={markerHalf}
              orient="auto"
            >
              <polygon
                points={`0 0, ${markerLen} ${markerHalf}, 0 ${markerLen}`}
                fill={strokeColor}
              />
            </marker>
          )}
        </defs>
      )}
      {sl !== 0 ? (
        <path
          d={`M ${startLocalX} ${startLocalY} Q ${controlLocalX} ${controlLocalY} ${endLocalX} ${endLocalY}`}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dasharray}
          fill="none"
          markerStart={isArrow && style.arrowStart ? `url(#preview-arrow-start-${id})` : undefined}
          markerEnd={isArrow && style.arrowEnd ? `url(#preview-arrow-end-${id})` : undefined}
        />
      ) : (
        <line
          x1={startLocalX}
          y1={startLocalY}
          x2={endLocalX}
          y2={endLocalY}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray={dasharray}
          markerStart={isArrow && style.arrowStart ? `url(#preview-arrow-start-${id})` : undefined}
          markerEnd={isArrow && style.arrowEnd ? `url(#preview-arrow-end-${id})` : undefined}
        />
      )}
    </svg>
  );
}
