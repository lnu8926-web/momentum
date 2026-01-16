"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, Search } from "lucide-react";

interface HeaderProps {
  onMenuClick?: () => void;
  user?: {
    name: string | null;
    email: string;
  } | null;
}

export function Header({ onMenuClick, user }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
      <div className="flex h-14 items-center px-4">
        {/* 왼쪽: 메뉴 + 로고 */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onMenuClick}
          >
            <Menu className="h-5 w-5" />
          </Button>

          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-lg font-bold">M</span>
            </div>
            <span className="hidden font-bold sm:inline-block">Momentum</span>
          </Link>
        </div>

        {/* 중앙: 검색 (나중에 구현) */}
        <div className="flex flex-1 items-center justify-center px-4">
          <div className="relative w-full max-w-md">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              placeholder="검색... (Cmd+K)"
              className="h-9 w-full rounded-md border border-input bg-background pl-9 pr-3 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring"
              readOnly
            />
          </div>
        </div>

        {/* 오른쪽: 사용자 */}
        <div className="flex items-center gap-2">
          {user ? (
            <div className="flex items-center gap-2">
              <div className="hidden flex-col items-end sm:flex">
                <span className="text-sm font-medium">
                  {user.name || "이름 없음"}
                </span>
                <span className="text-xs text-muted-foreground">
                  {user.email}
                </span>
              </div>
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <span className="text-sm font-medium">
                  {user.name?.charAt(0) || user.email.charAt(0).toUpperCase()}
                </span>
              </div>
            </div>
          ) : (
            <Link href="/login">
              <Button variant="ghost">로그인</Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
