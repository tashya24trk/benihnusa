import React, { useMemo } from 'react';

interface QrCodeSvgProps {
  value: string;
  size?: number;
}

/**
 * Deterministic vector QR-style matrix generated from a seed batch code
 * so every batch displays a crisp, unique, scannable-looking traceability label.
 */
export const QrCodeSvg: React.FC<QrCodeSvgProps> = ({ value, size = 112 }) => {
  const cells = useMemo(() => {
    const grid = 21;
    const matrix: boolean[][] = Array.from({ length: grid }, () => Array(grid).fill(false));

    const drawFinder = (startR: number, startC: number) => {
      for (let r = 0; r < 7; r++) {
        for (let c = 0; c < 7; c++) {
          const isBorder = r === 0 || r === 6 || c === 0 || c === 6;
          const isInner = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          matrix[startR + r][startC + c] = isBorder || isInner;
        }
      }
    };

    drawFinder(0, 0);
    drawFinder(0, grid - 7);
    drawFinder(grid - 7, 0);

    let hash = 2166136261;
    for (let i = 0; i < value.length; i++) {
      hash ^= value.charCodeAt(i);
      hash = Math.imul(hash, 16777619);
    }

    for (let r = 0; r < grid; r++) {
      for (let c = 0; c < grid; c++) {
        const inTopLeft = r < 8 && c < 8;
        const inTopRight = r < 8 && c >= grid - 8;
        const inBottomLeft = r >= grid - 8 && c < 8;
        if (inTopLeft || inTopRight || inBottomLeft) continue;

        if (r === 6 || c === 6) {
          matrix[r][c] = (r + c) % 2 === 0;
          continue;
        }

        hash ^= (r * 31 + c * 17) & 0xff;
        hash = Math.imul(hash, 16777619);
        matrix[r][c] = ((hash >>> 0) % 100) < 48;
      }
    }

    return matrix;
  }, [value]);

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 21 21"
      className="bg-white p-1.5 rounded-lg border border-[#E2E8F0] shrink-0"
      role="img"
      aria-label={`Kode QR Ketertelusuran ${value}`}
    >
      <rect width="21" height="21" fill="#FFFFFF" />
      {cells.map((row, rIdx) =>
        row.map((filled, cIdx) =>
          filled ? (
            <rect
              key={`${rIdx}-${cIdx}`}
              x={cIdx}
              y={rIdx}
              width="1"
              height="1"
              fill="#111827"
            />
          ) : null
        )
      )}
    </svg>
  );
};
