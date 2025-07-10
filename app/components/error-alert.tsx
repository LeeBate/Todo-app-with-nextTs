"use client";

import { X } from "lucide-react";
import CustomIcon from "./icon-circlr";

interface ErrorAlertProps {
  message: string;
  onRetry: () => void;
}

export default function ErrorAlert({ message, onRetry }: ErrorAlertProps) {
  return (
    <div
      className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
      role="alert"
    >
      <div className="flex items-center gap-3">
        <CustomIcon
          icon={<X className="w-3 h-3" />}
          bgColor="bg-red-600"
          textColor="text-white"
        />

        <div className="flex-1">
          <p className="text-red-800 font-medium">เกิดข้อผิดพลาด</p>
          <p className="text-red-700">{message}</p>
        </div>
        <button
          onClick={onRetry}
          className="px-3 py-1 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors duration-200 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          ลองใหม่
        </button>
      </div>
    </div>
  );
}
