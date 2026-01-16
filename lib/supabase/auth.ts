import { createClient } from "@/lib/supabase/client";

export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();

  // 1. Auth 계정 생성 (메타데이터에 name 포함)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Failed to create user");

  // users 테이블은 트리거가 자동으로 생성함

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
