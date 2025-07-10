interface TodoStatsProps {
  totalCount: number;
  completedCount: number;
}

export default function TodoStats({
  totalCount,
  completedCount,
}: TodoStatsProps) {
  const pendingCount = totalCount - completedCount;

  return (
    <header className="card p-6 mb-6 w-full">
      <h1 className="text-3xl font-bold text-center text-gray-800 mb-4">
        TT Todo List
      </h1>
      <div className="flex justify-center gap-6 text-sm">
        <div className="text-center">
          <div className="text-2xl font-bold text-blue-600">{totalCount}</div>
          <div className="text-gray-600">ทั้งหมด</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {pendingCount}
          </div>
          <div className="text-gray-600">ยังไม่เสร็จ</div>
        </div>
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">
            {completedCount}
          </div>
          <div className="text-gray-600">เสร็จแล้ว</div>
        </div>
      </div>
    </header>
  );
}
