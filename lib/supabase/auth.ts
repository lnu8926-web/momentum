import { createClient } from "@/lib/supabase/client";

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();

  // 1. Auth 계정 생성
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Failed to create user");

  // 2. users 테이블에 프로필 생성
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: authData.user.email!,
    name,
  });

  if (profileError) throw profileError;

  // 3. 기본 워크스페이스 생성
  const { error: workspaceError } = await supabase.from("workspaces").insert({
    name: "${name}'s Workspace",
    owner_id: authData.user.id,
  });

  if (workspaceError) throw workspaceError;

  return authData;
}

export async function signIn(email: string, password: string) {
  const supabase = createClient();

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) throw error;

  return data;
}

export async function signOut() {
  const supabase = createClient();

  const { error } = await supabase.auth.signOut();

  if (error) throw error;
}

export async function getCurrentUser() {
  const supabase = createClient();

  const { data, error } = await supabase.auth.getUser();

  if (error) throw error;

  return data;
}
