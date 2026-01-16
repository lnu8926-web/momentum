"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { Home, Search, FileText, Kanban, Settings, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SidebarProps {
  className?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Search", href: "/search", icon: Search },
  { name: "All Pages", href: "/pages", icon: FileText },
  { name: "All Issues", href: "/issues", icon: Kanban },
];

export function Sidebar({ className, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();

  return (
    <>
      {/* 모바일 오버레이 */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={onClose}
        />
      )}
      
      <aside
        className={cn(
          "fixed left-0 top-14 z-50 flex h-[calc(100vh-3.5rem)] w-64 flex-col border-r bg-background transition-transform duration-200 ease-in-out md:static md:translate-x-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          className
        )}
      >
        {/* 모바일 닫기 버튼 */}
        <div className="flex items-center justify-between border-b p-3 md:hidden">
          <span className="font-semibold">메뉴</span>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* 네비게이션 */}
        <div className="flex-1 space-y-1 overflow-y-auto p-3">
          <div className="space-y-1">
            {navigation.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link key={item.name} href={item.href} onClick={onClose}>
                  <Button
                    variant={isActive ? "secondary" : "ghost"}
                    className="w-full justify-start"
                  >
                    <item.icon className="mr-2 h-4 w-4" />
                    {item.name}
                  </Button>
                </Link>
              );
            })}
          </div>

          {/* Pages 섹션 */}
          <div className="pt-4">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-muted-foreground">
                PAGES
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {/* 임시 페이지 목록 */}
              <Button variant="ghost" className="w-full justify-start">
                <FileText className="mr-2 h-4 w-4" />
                예시 페이지
              </Button>
            </div>
          </div>

          {/* Boards 섹션 */}
          <div className="pt-4">
            <div className="mb-2 flex items-center justify-between px-2">
              <span className="text-xs font-medium text-muted-foreground">
                BOARDS
              </span>
              <Button variant="ghost" size="icon" className="h-6 w-6">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <div className="space-y-1">
              {/* 임시 보드 목록 */}
              <Button variant="ghost" className="w-full justify-start">
                <Kanban className="mr-2 h-4 w-4" />
                예시 보드
              </Button>
            </div>
          </div>
        </div>

      {/* 하단: Settings */}
      <div className="border-t p-3">
        <Link href="/settings" onClick={onClose}>
          <Button variant="ghost" className="w-full justify-start">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Button>
        </Link>
      </div>
    </aside>
    </>
  );
}
