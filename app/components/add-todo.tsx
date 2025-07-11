"use client";

import { Plus } from "lucide-react";
import React from "react";

import { useState } from "react";

interface AddTodoProps {
  onAdd: (title: string) => void;
  isLoading: boolean;
}

export default function AddTodo({ onAdd, isLoading }: AddTodoProps) {
  const [title, setTitle] = useState<string>("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onAdd(title.trim());
      setTitle("");
    }
  };

  return (
    <div className="card p-6 mb-6 flex flex-col justify-center">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
        <Plus className="w-4 h-4 mr-2" />
        เพิ่ม Todo ใหม่
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-3">
        <label className="sr-only">หัวข้อ Todo</label>
        <input
          id="todo-input"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="ใส่หัวข้อ Todo..."
          className="input-field flex-1"
          disabled={isLoading}
          maxLength={100}
          required
        />
        <button
          type="submit"
          disabled={!title.trim() || isLoading}
          className="btn-primary flex items-center gap-2"
        >
          <Plus className="w-4 h-4 mr-2" />
          เพิ่ม
        </button>
      </form>
    </div>
  );
}
