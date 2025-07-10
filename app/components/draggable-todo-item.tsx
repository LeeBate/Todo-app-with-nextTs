"use client";

import type React from "react";

import { useState } from "react";
import type { Todo } from "@/app/lib/types";
import { useDragDrop } from "@/app/components/drag-drop-context";
import { Check, FilePenLine, Trash } from "lucide-react";
import RecentlyDroppedIndicator from "./drag-bounce";

interface DraggableTodoItemProps {
  todo: Todo;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
  onEdit: (id: number, title: string) => void;
  isLoading: boolean;
  indicatorType: "new" | "completed" | null;
}

export default function DraggableTodoItem({
  todo,
  onToggle,
  onDelete,
  onEdit,
  isLoading,
  indicatorType,
}: DraggableTodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const { draggedItem, setDraggedItem, recentlyDroppedItem } = useDragDrop();

  const handleEdit = () => {
    if (editTitle?.trim()) {
      onEdit(todo.id, editTitle?.trim());
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setIsEditing(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleEdit();
    } else if (e.key === "Escape") {
      handleCancel();
    }
  };

  const handleDragStart = (e: React.DragEvent) => {
    setDraggedItem(todo.id);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", todo.id.toString());

    // Create custom drag image
    const dragImage = e.currentTarget.cloneNode(true) as HTMLElement;
    dragImage.style.transform = "rotate(5deg)";
    dragImage.style.opacity = "0.8";
    document.body.appendChild(dragImage);
    e.dataTransfer.setDragImage(dragImage, 0, 0);
    setTimeout(() => document.body.removeChild(dragImage), 0);
  };

  const handleDragEnd = () => {
    setDraggedItem(null);
  };

  const isDragging = draggedItem === todo.id;
  const isRecentlyDropped = recentlyDroppedItem === todo.id;

  const getHighlightClasses = () => {
    if (!isRecentlyDropped) return "";

    switch (indicatorType) {
      case "new":
        return "ring-2 ring-blue-400 bg-blue-50 shadow-lg";
      case "completed":
        return "ring-2 ring-green-400 bg-green-50 shadow-lg";
      default:
        return "";
    }
  };

  return (
    <div
      draggable={!isEditing && !isLoading}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      className={`card p-4 mb-3 transition-all duration-200 cursor-move relative ${
        isDragging
          ? "opacity-50 scale-95 rotate-2 shadow-lg"
          : "hover:shadow-lg hover:scale-[1.02]"
      } ${getHighlightClasses()} ${
        !isEditing && !isLoading
          ? "hover:cursor-grab active:cursor-grabbing"
          : "cursor-default"
      }`}
    >
      <RecentlyDroppedIndicator
        isRecentlyDropped={recentlyDroppedItem === todo.id}
        indicatorType={indicatorType}
      />
      <div className="flex items-center gap-3">
        {/* Drag Handle */}
        {!isEditing && (
          <div className="flex flex-col gap-1 text-gray-400 hover:text-gray-600 transition-colors">
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
            <div className="w-1 h-1 bg-current rounded-full"></div>
          </div>
        )}

        {/* Custom Checkbox */}
        <button
          onClick={() => onToggle(todo.id)}
          disabled={isLoading}
          className={`w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 ${
            todo.completed
              ? "bg-green-500 border-green-500 text-white focus:ring-green-500"
              : "border-gray-300 hover:border-green-400 focus:ring-green-500"
          } ${isLoading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {todo.completed && <Check className="w-3 h-3" />}
        </button>

        {isEditing ? (
          <div className="flex-1 flex gap-2">
            <label htmlFor={`edit-todo-${todo.id}`} className="sr-only">
              แก้ไขหัวข้อ Todo
            </label>
            <input
              id={`edit-todo-${todo.id}`}
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              onKeyDown={handleKeyDown}
              className="input-field flex-1"
              autoFocus
              maxLength={100}
            />
            <button
              onClick={handleEdit}
              disabled={!editTitle?.trim()}
              className="btn-success"
            >
              บันทึก
            </button>
            <button onClick={handleCancel} className="btn-secondary">
              ยกเลิก
            </button>
          </div>
        ) : (
          <>
            <span
              className={`flex-1 ${
                todo.completed ? "line-through text-gray-500" : "text-gray-800"
              }`}
              role="text"
            >
              {todo.title}
            </span>

            {/* Status Badge */}
            <span
              className={`px-2 py-1 rounded-full text-xs font-medium ${
                todo.completed
                  ? "bg-green-100 text-green-800"
                  : "bg-yellow-100 text-yellow-800"
              }`}
            >
              {todo.completed ? "เสร็จแล้ว" : "ยังไม่เสร็จ"}
            </span>

            {/* Edit Button */}
            <button
              onClick={() => setIsEditing(true)}
              disabled={isLoading}
              className="p-2 text-blue-600 hover:bg-blue-50 rounded-md transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              <div className="w-4 h-4 flex justify-center items-center">
                <FilePenLine />
              </div>
            </button>

            {/* Delete Button */}
            <button
              onClick={() => onDelete(todo.id)}
              disabled={isLoading}
              className="p-2 text-red-600 hover:bg-red-50 rounded-md transition-colors duration-200 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
            >
              <div className="w-4 h-4 flex justify-center items-center">
                <Trash />
              </div>
            </button>
          </>
        )}
      </div>
    </div>
  );
}
