export default function HomePage() {
  return (
    <div className="container px-4 py-6 md:px-6 md:py-10">
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold md:text-3xl">Welcome to Momentum</h1>
          <p className="text-sm text-muted-foreground md:text-base">
            Your all-in-one collaboration workspace
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {/* 임시 카드들 */}
          <div className="rounded-lg border p-4 md:p-6">
            <h3 className="font-semibold">Quick Start</h3>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              새 페이지를 만들어 시작해보세요
            </p>
          </div>

          <div className="rounded-lg border p-4 md:p-6">
            <h3 className="font-semibold">Recent Pages</h3>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              최근 작업한 페이지가 여기 표시됩니다
            </p>
          </div>

          <div className="rounded-lg border p-4 md:p-6">
            <h3 className="font-semibold">My Issues</h3>
            <p className="mt-2 text-xs text-muted-foreground md:text-sm">
              내게 할당된 이슈가 여기 표시됩니다
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
