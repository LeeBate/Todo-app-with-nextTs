"use client";

import React from "react";

import { useDragDrop } from "@/app/components/drag-drop-context";
import { Check, Clock, Grip } from "lucide-react";
import CustomIcon from "./icon-circlr";

interface DropZoneProps {
  zone: "pending" | "completed";
  onDrop: (todoId: number, newStatus: boolean) => void;
  children: React.ReactNode;
  title: string;
  count: number;
}

export default function DropZone({
  zone,
  onDrop,
  children,
  title,
  count,
}: DropZoneProps) {
  const { draggedItem, dropZone, setDropZone } = useDragDrop();

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDropZone(zone);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    // Only clear drop zone if we're leaving the drop zone container
    if (!e.currentTarget.contains(e.relatedTarget as Node)) {
      setDropZone(null);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (draggedItem !== null) {
      const newCompleted = zone === "completed";
      onDrop(draggedItem, newCompleted);
    }
    setDropZone(null);
  };

  const isActive = dropZone === zone && draggedItem !== null;
  const canDrop = draggedItem !== null;

  return (
    <div
      className={`min-h-[200px] rounded-lg border-2 border-dashed transition-all duration-200 ${
        isActive
          ? zone === "completed"
            ? "border-green-400 bg-green-50"
            : "border-yellow-400 bg-yellow-50"
          : canDrop
          ? "border-gray-300 bg-gray-50"
          : "border-transparent bg-transparent"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      {/* Drop Zone Header */}
      <div className="p-4 border-b border-gray-200 bg-white rounded-t-lg">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            {zone === "completed" ? (
              <CustomIcon
                icon={<Check className="w-3 h-3" />}
                bgColor="bg-green-600"
                textColor="text-white"
              />
            ) : (
              <CustomIcon
                icon={<Clock className="w-3 h-3" />}
                bgColor="bg-yellow-600"
                textColor="text-white"
              />
            )}
            {title}
          </h3>
          <span
            className={`px-2 py-1 rounded-full text-sm font-medium ${
              zone === "completed"
                ? "bg-green-100 text-green-800"
                : "bg-yellow-100 text-yellow-800"
            }`}
          >
            {count} รายการ
          </span>
        </div>
      </div>

      {/* Drop Zone Content */}
      <div className="p-4">
        {isActive && (
          <div className="text-center py-8">
            <div
              className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                zone === "completed" ? "bg-green-100" : "bg-yellow-100"
              }`}
            >
              <div
                className={`w-8 h-8 ${
                  zone === "completed" ? "text-green-600" : "text-yellow-600"
                } flex justify-center items-center`}
              >
                <Grip />
              </div>
            </div>
            <p
              className={`text-lg font-medium ${
                zone === "completed" ? "text-green-800" : "text-yellow-800"
              }`}
            >
              วาง Todo ที่นี่
            </p>
            <p
              className={`text-sm ${
                zone === "completed" ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {zone === "completed"
                ? "เพื่อทำเครื่องหมายว่าเสร็จแล้ว"
                : "เพื่อทำเครื่องหมายว่ายังไม่เสร็จ"}
            </p>
          </div>
        )}

        {children}
      </div>
    </div>
  );
}
