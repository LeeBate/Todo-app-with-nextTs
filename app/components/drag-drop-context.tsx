"use client"

import React from "react"
import { createContext, useContext, useState } from "react"

interface DragDropContextType {
  draggedItem: number | null
  setDraggedItem: (id: number | null) => void
  dropZone: "pending" | "completed" | null
  setDropZone: (zone: "pending" | "completed" | null) => void
}

const DragDropContext = createContext<DragDropContextType | undefined>(undefined)

export function DragDropProvider({ children }: { children: React.ReactNode }) {
  const [draggedItem, setDraggedItem] = useState<number | null>(null)
  const [dropZone, setDropZone] = useState<"pending" | "completed" | null>(null)

  return (
    <DragDropContext.Provider
      value={{
        draggedItem,
        setDraggedItem,
        dropZone,
        setDropZone,
      }}
    >
      {children}
    </DragDropContext.Provider>
  )
}

export function useDragDrop() {
  const context = useContext(DragDropContext)
  if (context === undefined) {
    throw new Error("useDragDrop must be used within a DragDropProvider")
  }
  return context
}
