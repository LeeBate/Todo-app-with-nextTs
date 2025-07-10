"use client";

import { BadgeCheck, Plus } from "lucide-react";
import { useEffect, useState } from "react";

interface RecentlyDroppedIndicatorProps {
  isRecentlyDropped: boolean;
  indicatorType: "new" | "completed" | null;
}

export default function RecentlyDroppedIndicator({
  isRecentlyDropped,
  indicatorType,
}: RecentlyDroppedIndicatorProps) {
  const [showIndicator, setShowIndicator] = useState(false);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (isRecentlyDropped && indicatorType) {
      setShowIndicator(true);
      setProgress(100);

      // Progress bar animation
      const progressInterval = setInterval(() => {
        setProgress((prev) => {
          if (prev <= 0) {
            clearInterval(progressInterval);
            return 0;
          }
          return prev - 100 / 300; // ลดลง 100/300 ทุก 100ms เพื่อให้ครบ 30 วินาที
        });
      }, 100);

      // Hide indicator after 30 seconds
      const timer = setTimeout(() => {
        setShowIndicator(false);
        setProgress(100);
      }, 30000);

      return () => {
        clearTimeout(timer);
        clearInterval(progressInterval);
      };
    }
  }, [isRecentlyDropped, indicatorType]);

  if (!showIndicator || !indicatorType) return null;

  const getIndicatorConfig = () => {
    switch (indicatorType) {
      case "new":
        return {
          bgColor: "bg-blue-500",
          textColor: "text-white",
          icon: <Plus className="w-3 h-3 inline mr-1" />,
          text: "ใหม่!",
          animation: "animate-pulse",
        };
      case "completed":
        return {
          bgColor: "bg-green-500",
          textColor: "text-white",
          icon: <BadgeCheck className="w-3 h-3 inline mr-1" />,
          text: "เสร็จแล้ว!",
          animation: "animate-bounce",
        };
      default:
        return null;
    }
  };

  const config = getIndicatorConfig();
  if (!config) return null;

  return (
    <div className="absolute -top-2 -right-2 z-10">
      <div
        className={`${config.bgColor} ${config.textColor} text-xs px-2 py-1 rounded-full shadow-lg ${config.animation} relative overflow-hidden`}
      >
        {/* Progress bar background */}
        <div
          className="absolute bottom-0 left-0 h-0.5 bg-white bg-opacity-30 transition-all duration-100 ease-linear"
          style={{ width: `${progress}%` }}
        />
        {config.icon}
        {config.text}
      </div>
    </div>
  );
}
