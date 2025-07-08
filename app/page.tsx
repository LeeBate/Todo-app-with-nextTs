"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [todos, setTodos] = useState([]);

  useEffect(() => {
    fetchTodo();
  }, []);

  const fetchTodo = async () => {
    try {
      const res = await fetch("/api/todos");
      if (!res.ok) {
        console.log("พบข้อผิดพลาดจ้า");
      }
      const todosInfo = await res.json();
      console.log("todosInfo", todosInfo);

      setTodos(todosInfo)
    } catch (error) {
      // จัดการ Error client เพิ่มเติม
    }
  };
  return <></>;
}
