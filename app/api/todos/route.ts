import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_URL = process.env.API_BASE_URL;

export async function GET() {
  try {
    if (!EXTERNAL_API_URL) {
      throw new Error("หา API_BASE_URL ไม่เจอจ้า");
    }
    const res = await fetch(EXTERNAL_API_URL, {
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      throw new Error("พบข้อผิดพลาดในการดึงข้อมูลจาก API");
    }

    const todos = await res.json();
    return NextResponse.json(todos, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "พบข้อผิดพลาด Catch",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!EXTERNAL_API_URL) {
      throw new Error("หา API_BASE_URL ไม่เจอจ้า");
    }

    const todoInfo = {
      title: body.title.trim(),
      completed: body.completed || false,
      userId: body.userId || 1,
    };

    const res = await fetch(EXTERNAL_API_URL, {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(todoInfo),
    });

    if (!res.ok) {
      throw new Error("พบข้อผิดพลาดของการเพิ่มข้อมูล");
    }

    const newTodo = await res.json();
    return NextResponse.json(newTodo, {
      status: 201,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "พบข้อผิดพลาดของการเพิ่มข้อมูล Catch",
      },
      { status: 500 }
    );
  }
}
