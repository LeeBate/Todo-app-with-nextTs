"use client";

import { useEffect, useState } from "react";
import { Todo } from "@/app/lib/types";
import Loading from "./components/loading";
import { DragDropProvider, useDragDrop } from "./components/drag-drop-context";
import TodoStats from "./components/todo-stats";
import ErrorAlert from "./components/error-alert";
import AddTodo from "./components/add-todo";
import DropZone from "./components/drop-zone";
import DraggableTodoItem from "./components/draggable-todo-item";
import { X } from "lucide-react";

export default function Home() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const {
    setRecentlyDroppedItem,
    recentlyDroppedItem,
    indicatorType,
    setIndicatorType,
  } = useDragDrop();

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await fetch("/api/todos");
      if (!res.ok) {
        setError("พบข้อผิดพลาดจ้าในการแสดงข้อมูลจ้า");
        return;
      }
      const todosInfo = await res.json();
      console.log("todosInfo", todosInfo);
      setTodos(todosInfo);
    } catch (err) {
      // จัดการ Error client เพิ่มเติม
      setError(
        err instanceof Error ? err.message : "ไม่สามารถโหลดข้อมูลได้จ้า"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (title: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const res = await fetch("/api/todos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          completed: false,
          userId: 1,
        }),
      });

      if (!res.ok) {
        setError("พบข้อผิดพลาดในการเพิ่มข้อมูลจ้า");
        return;
      }

      const newTodo = await res.json();
      const todoWithRealId = { ...newTodo, id: Date.now() };
      setTodos((prev) => [todoWithRealId, ...prev]);

      setRecentlyDroppedItem(todoWithRealId.id);
      setIndicatorType("new");
      setTimeout(() => {
        setRecentlyDroppedItem(null);
        setIndicatorType(null);
      }, 30000);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถเพิ่ม Todo ได้จ้า"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleToggleTodo = async (id: number) => {
    try {
      setActionLoading(true);
      setError(null);

      const todo = todos.find((t) => t.id === id);
      if (!todo) return;

      const newCompleted = !todo.completed;

      if (todo.completed && recentlyDroppedItem === id) {
        setRecentlyDroppedItem(null);
        setIndicatorType(null);
      }

      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: newCompleted,
        }),
      });

      if (!res.ok) {
        setError("พบข้อผิดพลาดในการอัพเดทข้อมูลจ้า");
        return;
      }

      setTodos((prev) => {
        const updatedTodos = prev.map((t) =>
          t.id === id ? { ...t, completed: newCompleted } : t
        );

        const completedTodos = updatedTodos.filter((t) => t.completed);
        const pendingTodos = updatedTodos.filter((t) => !t.completed);
        const toggledTodo = updatedTodos.find((t) => t.id === id);

        if (toggledTodo) {
          if (newCompleted) {
            const otherCompletedTodos = completedTodos.filter(
              (t) => t.id !== id
            );
            return [...pendingTodos, toggledTodo, ...otherCompletedTodos];
          } else {
            const otherPendingTodos = pendingTodos.filter((t) => t.id !== id);
            return [toggledTodo, ...otherPendingTodos, ...completedTodos];
          }
        }

        return updatedTodos;
      });

      if (!todo.completed && newCompleted) {
        setRecentlyDroppedItem(id);
        setIndicatorType("completed");
        setTimeout(() => {
          setRecentlyDroppedItem(null);
          setIndicatorType(null);
        }, 30000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถอัพเดท Todo ได้จ้า"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditTodo = async (id: number, title: string) => {
    try {
      setActionLoading(true);
      setError(null);

      const res = await fetch(`/api/todos/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ title }),
      });

      if (!res.ok) {
        setError("พบข้อผิดพลาดในการอัพเดทข้อมูลจ้า");
        return;
      }

      setTodos((prev) => prev.map((t) => (t.id === id ? { ...t, title } : t)));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถอัพเดท Todo ได้จ้า"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteTodo = async (id: number) => {
    try {
      setActionLoading(true);
      setError(null);

      const res = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        setError("พบข้อผิดพลาดในการลบข้อมูลได้จ้า");
        return;
      }

      setTodos((prev) => prev.filter((t) => t.id !== id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "ไม่สามารถลบ Todo ได้");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDrop = async (todoId: number, newCompleted: boolean) => {
    try {
      setActionLoading(true);
      setError(null);

      const draggedTodo = todos.find((t) => t.id === todoId);
      if (!draggedTodo) return;

      if (!newCompleted && recentlyDroppedItem === todoId) {
        setRecentlyDroppedItem(null);
        setIndicatorType(null);
      }
      const res = await fetch(`/api/todos/${todoId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          completed: newCompleted,
        }),
      });

      if (!res.ok) {
        setError("พบข้อผิดพลาดในการอัพเดทข้อมูลจ้า");
        return;
      }

      setTodos((prev) => {
        const updatedTodos = prev.map((t) =>
          t.id === todoId ? { ...t, completed: newCompleted } : t
        );

        // แยก todos ตามสถานะ
        const completedTodos = updatedTodos.filter((t) => t.completed);
        const pendingTodos = updatedTodos.filter((t) => !t.completed);

        // หา todo ที่เพิ่งถูกลาก
        const draggedTodo = updatedTodos.find((t) => t.id === todoId);

        if (draggedTodo) {
          if (newCompleted) {
            // ถ้าลากไป "เสร็จแล้ว" ให้ไปอยู่ด้านบนของ completed todos
            const otherCompletedTodos = completedTodos.filter(
              (t) => t.id !== todoId
            );
            return [...pendingTodos, draggedTodo, ...otherCompletedTodos];
          } else {
            // ถ้าลากไป "ยังไม่เสร็จ" ให้ไปอยู่ด้านบนของ pending todos
            const otherPendingTodos = pendingTodos.filter(
              (t) => t.id !== todoId
            );
            return [draggedTodo, ...otherPendingTodos, ...completedTodos];
          }
        }

        return updatedTodos;
      });

      let newIndicatorType: "new" | "completed" | null = null;

      if (!draggedTodo.completed && newCompleted) {
        newIndicatorType = "completed";
      }

      if (newIndicatorType) {
        setRecentlyDroppedItem(todoId);
        setIndicatorType(newIndicatorType);
        setTimeout(() => {
          setRecentlyDroppedItem(null);
          setIndicatorType(null);
        }, 30000);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "ไม่สามารถอัพเดท Todo ได้จ้า"
      );
    } finally {
      setActionLoading(false);
    }
  };

  const pendingTodos = todos.filter((td) => !td.completed);
  const completedTodos = todos.filter((td) => td.completed);
  const completedCount = completedTodos?.length;
  const totalCount = todos.length;

  if (loading) {
    return <Loading />;
  }
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      {actionLoading && (
        <div className=" absolute right-5 w-6 h-6 loading-spinner"/>
      )}
      <div className=" container mx-auto px-4 max-w-6xl">
        {error && <ErrorAlert message={error} onRetry={fetchTodo} />}
        <div className=" grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TodoStats totalCount={totalCount} completedCount={completedCount} />
          <AddTodo onAdd={handleAddTodo} isLoading={actionLoading} />
        </div>

        <main className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* ยังไม่เสร็จ */}

          <DropZone
            zone="pending"
            title="ยังไม่เสร็จ"
            count={pendingTodos.length}
            onDrop={handleDrop}
          >
            {pendingTodos.length === 0 ? (
              <div className="text-center py-8">
                <div className=" bg-[#99A1AF] w-10 h-10 mx-auto mb-4 rounded-full flex justify-center items-center">
                  <X className="text-white w-8 h-8 " />
                </div>
                <p className="text-gray-500">ไม่มี Todo ที่ยังไม่เสร็จ</p>
              </div>
            ) : (
              <div className="space-y-3">
                {pendingTodos.map((todo) => (
                  <DraggableTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                    isLoading={actionLoading}
                    indicatorType={
                      recentlyDroppedItem === todo.id ? indicatorType : null
                    }
                  />
                ))}
              </div>
            )}
          </DropZone>

          {/* สำเร็จ */}

          <DropZone
            zone="completed"
            title="เสร็จแล้ว"
            count={completedTodos.length}
            onDrop={handleDrop}
          >
            {completedTodos.length === 0 ? (
              <div className="text-center py-8">
                <div className=" bg-[#99A1AF] w-10 h-10 mx-auto mb-4 rounded-full flex justify-center items-center">
                  <X className="text-white w-8 h-8 " />
                </div>

                <p className="text-gray-500">ยังไม่มี Todo ที่เสร็จแล้ว</p>
              </div>
            ) : (
              <div className="space-y-3">
                {completedTodos.map((todo) => (
                  <DraggableTodoItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggleTodo}
                    onDelete={handleDeleteTodo}
                    onEdit={handleEditTodo}
                    isLoading={actionLoading}
                    indicatorType={
                      recentlyDroppedItem === todo.id ? indicatorType : null
                    }
                  />
                ))}
              </div>
            )}
          </DropZone>
        </main>
      </div>
    </div>
  );
}
