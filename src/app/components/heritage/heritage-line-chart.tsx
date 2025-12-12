'use client';

import type React from 'react';
import { useEffect, useState, useRef } from 'react';
import { FinanceCard, FinanceCardHeader, FinanceCardTitle, FinanceCardContent } from '@/app/components/ui/finance-card';
import {HeritageRaw} from "@/lib/application/dtos/dtos";
import {CurrencyFormatter} from "@/lib/domain/services/currency-formatter";

interface HeritageLineChartProps {
  data: HeritageRaw[];
}

export function HeritageLineChart({ data }: HeritageLineChartProps): React.ReactNode {
  const [isAnimating, setIsAnimating] = useState<boolean>(true);
  const [progress, setProgress] = useState<number>(0);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; data: HeritageRaw } | null>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const padding = { top: 40, right: 30, bottom: 50, left: 70 };
  const width = 800;
  const height = 400;
  const chartWidth = width - padding.left - padding.right;
  const chartHeight = height - padding.top - padding.bottom;

  // Validate and filter data - ensure all values are valid numbers
  const validData = data.filter((d): d is HeritageRaw =>
    Number.isFinite(d.total) && Number.isFinite(d.saving) && Number.isFinite(d.investment)
  );

  // Handle empty data case
  if (validData.length === 0) {
    return (
      <FinanceCard className="animate-fade-in-up delay-200">
        <FinanceCardHeader>
          <FinanceCardTitle>Evolución del Patrimonio</FinanceCardTitle>
        </FinanceCardHeader>
        <FinanceCardContent>
          <div className="h-[400px] flex items-center justify-center text-muted-foreground">
            No hay datos disponibles para mostrar
          </div>
        </FinanceCardContent>
      </FinanceCard>
    );
  }

  const maxValue = Math.max(...validData.map((d) => d.total)) * 1.1;
  const minValue = Math.min(...validData.map((d) => d.total)) * 0.9;

  // Animate line drawing
  useEffect(() => {
    let animationFrame: number;
    const duration = 1500;
    const startTime = Date.now();

    const animate = (): void => {
      const elapsed = Date.now() - startTime;
      const newProgress = Math.min(elapsed / duration, 1);

      // Easing function
      const eased = 1 - Math.pow(1 - newProgress, 3);
      setProgress(eased);

      if (newProgress < 1) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setIsAnimating(false);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, []);

  // Calculate points
  const points = validData.map((d, i): { x: number; y: number; data: HeritageRaw } => {
    // Handle edge case: single data point should be centered horizontally
    const xPosition = validData.length === 1
      ? padding.left + chartWidth / 2
      : padding.left + (i / (validData.length - 1)) * chartWidth;

    // Prevent NaN in y calculation if max equals min (all same values)
    const yRange = maxValue - minValue;
    const yPosition = padding.top + chartHeight - ((d.total - minValue) / (yRange === 0 ? 1 : yRange)) * chartHeight;

    return {
      x: xPosition,
      y: yPosition,
      data: d,
    };
  });

  // Create smooth curve path
  const createSmoothPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length < 2) return '';

    let path = `M ${pts[0].x} ${pts[0].y}`;

    for (let i = 0; i < pts.length - 1; i++) {
      const curr = pts[i];
      const next = pts[i + 1];
      const midX = (curr.x + next.x) / 2;

      path += ` C ${midX} ${curr.y}, ${midX} ${next.y}, ${next.x} ${next.y}`;
    }

    return path;
  };

  // Create area path
  const createAreaPath = (pts: { x: number; y: number }[]): string => {
    if (pts.length < 2) return '';

    const linePath = createSmoothPath(pts);
    const lastPoint = pts[pts.length - 1];
    const firstPoint = pts[0];
    const bottomY = padding.top + chartHeight;

    return `${linePath} L ${lastPoint.x} ${bottomY} L ${firstPoint.x} ${bottomY} Z`;
  };

  const linePath = createSmoothPath(points);
  const areaPath = createAreaPath(points);

  // Calculate visible portion of path based on progress
  const visiblePoints = points.slice(0, Math.ceil(points.length * progress) || 1);
  const visibleLinePath = createSmoothPath(visiblePoints);
  const visibleAreaPath = createAreaPath(visiblePoints);

  // Y-axis ticks
  const yTicks = 5;
  const yTickValues = Array.from({ length: yTicks + 1 }, (_, i) =>
    minValue + ((maxValue - minValue) * i) / yTicks
  );

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>): void => {
    if (!svgRef.current || isAnimating) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;

    // Find closest point
    let closestPoint = points[0];
    let closestDistance = Number.POSITIVE_INFINITY;

    for (const point of points) {
      const distance = Math.abs(point.x - x);
      if (distance < closestDistance) {
        closestDistance = distance;
        closestPoint = point;
      }
    }

    if (closestDistance < 50) {
      setTooltip({ x: closestPoint.x, y: closestPoint.y, data: closestPoint.data });
    } else {
      setTooltip(null);
    }
  };

  return (
    <FinanceCard className="animate-fade-in-up delay-200">
      <FinanceCardHeader>
        <FinanceCardTitle>Evolución del Patrimonio</FinanceCardTitle>
      </FinanceCardHeader>
      <FinanceCardContent>
        <div className="w-full overflow-x-auto">
          <svg
            ref={svgRef}
            viewBox={`0 0 ${width} ${height}`}
            className="w-full min-w-[600px]"
            onMouseMove={handleMouseMove}
            onMouseLeave={() => setTooltip(null)}
          >
            {/* Gradient definition */}
            <defs>
              <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.4" />
                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0.05" />
              </linearGradient>
              <linearGradient id="lineGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#7C3AED" />
                <stop offset="100%" stopColor="#A78BFA" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            {yTickValues.map((tick, i) => {
              const y = padding.top + chartHeight - ((tick - minValue) / (maxValue - minValue)) * chartHeight;
              return (
                <g key={i}>
                  <line
                    x1={padding.left}
                    y1={y}
                    x2={width - padding.right}
                    y2={y}
                    stroke="#E5E7EB"
                    strokeDasharray="4 4"
                  />
                  <text x={padding.left - 10} y={y + 4} textAnchor="end" className="fill-muted-foreground text-xs">
                    {CurrencyFormatter.toEur(tick)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels */}
            {points.map((point, i) => (
              <text key={i} x={point.x} y={height - 15} textAnchor="middle" className="fill-muted-foreground text-xs">
                {point.data.month}
              </text>
            ))}

            {/* Area fill with animation */}
            <path d={visibleAreaPath} fill="url(#areaGradient)" className="transition-all duration-100" />

            {/* Line with animation */}
            <path
              d={visibleLinePath}
              fill="none"
              stroke="url(#lineGradient)"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-100"
            />

            {/* Data points */}
            {!isAnimating &&
              points.map((point, i) => (
                <g key={i}>
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="6"
                    fill="#8B5CF6"
                    className="opacity-0 animate-[fade-in_0.3s_ease-out_forwards]"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                  <circle
                    cx={point.x}
                    cy={point.y}
                    r="3"
                    fill="white"
                    className="opacity-0 animate-[fade-in_0.3s_ease-out_forwards]"
                    style={{ animationDelay: `${i * 50}ms` }}
                  />
                </g>
              ))}

            {/* Hover indicator line */}
            {tooltip && (
              <line
                x1={tooltip.x}
                y1={padding.top}
                x2={tooltip.x}
                y2={padding.top + chartHeight}
                stroke="#8B5CF6"
                strokeWidth="1"
                strokeDasharray="4 4"
                className="opacity-50"
              />
            )}
          </svg>

          {/* Tooltip */}
          {tooltip && (
            <div
              className="absolute pointer-events-none z-10 bg-card border border-border rounded-lg shadow-lg p-3 min-w-[180px] animate-fade-in-up"
              style={{
                left: `${Math.min(tooltip.x, width - 200)}px`,
                top: `${tooltip.y - 120}px`,
              }}
            >
              <p className="font-semibold text-foreground mb-2">{tooltip.data.month}</p>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Total:</span>
                  <span className="font-medium text-[#8B5CF6]">{CurrencyFormatter.toEur(tooltip.data.total)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Hucha:</span>
                  <span className="font-medium text-[#10B981]">{CurrencyFormatter.toEur(tooltip.data.saving)}</span>
                </div>
                <div className="flex justify-between gap-4">
                  <span className="text-muted-foreground">Invertido:</span>
                  <span className="font-medium text-[#3B82F6]">{CurrencyFormatter.toEur(tooltip.data.investment)}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </FinanceCardContent>
    </FinanceCard>
  );
}
