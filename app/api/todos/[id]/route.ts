import { UpdateTodoRequest } from "@/app/lib/types";
import { NextRequest, NextResponse } from "next/server";

const EXTERNAL_API_URL = process.env.API_BASE_URL;

export async function GET(context: any) {
  try {
    const { id } = await context.params;
    if (!EXTERNAL_API_URL) {
      throw new Error("หา API_BASE_URL ไม่เจอจ้า");
    }
    const res = await fetch(`${EXTERNAL_API_URL}/${id}`);

    if (!res.ok) {
      throw new Error("พบข้อผิดพลาดในการดึงข้อมูลจาก API");
    }

    const todo = await res.json();
    return NextResponse.json(todo, { status: 200 });
  } catch {
    return NextResponse.json(
      {
        error: "พบข้อผิดพลาด Catch",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;
    const body = await req.json();

    if (!EXTERNAL_API_URL) {
      throw new Error("หา API_BASE_URL ไม่เจอจ้า");
    }

    const updateInfo: UpdateTodoRequest = {};
    if (body.title && body.completed !== undefined) {
      updateInfo.title = body?.title?.trim();
      updateInfo.completed = body?.completed;
    }

    console.log("updateInfo@@", updateInfo);
    const res = await fetch(`${EXTERNAL_API_URL}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(updateInfo),
    });

    if (!res.ok) {
      throw new Error("พบข้อผิดพลาดของการแก้ไขข้อมูล");
    }

    const updateTodo = await res.json();
    return NextResponse.json(updateTodo, {
      status: 200,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "พบข้อผิดพลาดของการแก้ไขข้อมูล Catch",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(req: NextRequest, context: any) {
  try {
    const { id } = await context.params;

    const res = await fetch(`${EXTERNAL_API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      throw new Error("พบข้อผิดพลาดของการลบข้อมูล");
    }

    return NextResponse.json({ message: "ลบข้อมูลสำเร็จจ้า" }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: "พบข้อผิดพลาดของการลบข้อมูล" },
      { status: 500 }
    );
  }
}
