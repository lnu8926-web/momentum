import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // const supabase = createClient();

  // // 인증 확인
  // const {
  //   data: { user },
  // } = await (await supabase).auth.getUser();

  // if (!user) {
  //   redirect("/login");
  // }

  // // 사용자 프로필 조회
  // const { data: profile } = await (await supabase)
  //   .from("users")
  //   .select("*")
  //   .eq("id", user.id)
  //   .single();

  return (
    <div className="flex h-screen flex-col">
      <Header
        user={{
          name: "Test User",
          email: "test@example.com",
        }}
      />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
