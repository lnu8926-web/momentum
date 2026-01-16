export default function HomePage() {
  return (
    <div className="container py-10">
      <div className="space-y-4">
        <div className="space-y-2 ml-5">
          <h1 className="text-3xl font-bold">Welcome to Momentum</h1>
          <p className="text-muted-foreground">
            Your all-in-one collaboration workspace
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 ml-5">
          {/* 임시 카드들 */}
          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Quick Start</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              새 페이지를 만들어 시작해보세요
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">Recent Pages</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              최근 작업한 페이지가 여기 표시됩니다
            </p>
          </div>

          <div className="rounded-lg border p-6">
            <h3 className="font-semibold">My Issues</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              내게 할당된 이슈가 여기 표시됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
