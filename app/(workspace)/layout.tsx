import { createClient } from "@/lib/supabase/server";
import { WorkspaceShell } from "@/components/layout/WorkspaceShell";

export default async function WorkspaceLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  // 사용자 정보 가져오기 (미들웨어에서 이미 인증 체크함)
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // 사용자 프로필 조회
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user?.id)
    .single();

  return (
    <WorkspaceShell
      user={
        profile
          ? {
              name: profile.name,
              email: profile.email,
            }
          : null
      }
    >
      {children}
    </WorkspaceShell>
  );
}
