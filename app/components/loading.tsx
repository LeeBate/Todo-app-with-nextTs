import React from "react";

function Loading() {
  return (
    <div className="min-h-screen bg-gray-50 py-8 flex justify-center items-center">
      <div className="text-center">
        <div className="w-8 h-8 loading-spinner mx-auto" />
        <p className="mt-4 text-gray-600">กำลังโหลดข้อมูล...</p>
      </div>
    </div>
  );
}

export default Loading;
