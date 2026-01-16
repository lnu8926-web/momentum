# 회원가입 401 에러 트러블슈팅

## 문제

회원가입 시 다음과 같은 401 에러 발생:

```
POST https://xxx.supabase.co/rest/v1/users 401 (Unauthorized)
```

## 원인 분석

### 1. 환경 변수 공백 문제

`.env.local` 파일에서 `=` 뒤에 공백이 있으면 값에 공백이 포함됩니다.

**❌ 잘못된 설정:**
```env
NEXT_PUBLIC_SUPABASE_URL= https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY= eyJhbGci...
```

**✅ 올바른 설정:**
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

> ⚠️ 환경 변수 수정 후 **서버 재시작** 필요

---

### 2. RLS (Row Level Security) 정책 미설정

Supabase 테이블은 기본적으로 RLS가 활성화되어 있어서, **정책(Policy)이 없으면 모든 접근이 차단**됩니다.

#### 회원가입 흐름에서의 문제:

```
1. supabase.auth.signUp()     → ✅ 성공 (Auth는 RLS 영향 없음)
2. users 테이블에 INSERT      → ❌ 401 에러 (RLS 정책 없음)
3. workspaces 테이블에 INSERT → ❌ 401 에러 (RLS 정책 없음)
```

#### 왜 RLS 정책만 추가해도 안 될까?

`signUp()` 직후에는 **세션이 아직 완전히 설정되지 않아서** `auth.uid()`가 바로 작동하지 않습니다.

따라서 클라이언트에서 직접 `users` 테이블에 INSERT 하는 것은 타이밍 이슈가 있습니다.

---

## 해결 방법

### 최종 해결책: 데이터베이스 트리거 사용

Auth 계정 생성 시 자동으로 `users` 테이블에 프로필을 생성하는 트리거를 사용합니다.

#### 1. Supabase SQL Editor에서 트리거 생성

```sql
-- 트리거 함수 생성
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

-- 트리거 생성 (이미 있으면 삭제 후 생성)
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```

#### 2. 클라이언트 코드 수정

**수정 전:**
```typescript
export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();

  // 1. Auth 계정 생성
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Failed to create user");

  // 2. users 테이블에 프로필 생성 - ❌ 401 에러 발생
  const { error: profileError } = await supabase.from("users").insert({
    id: authData.user.id,
    email: authData.user.email!,
    name,
  });

  if (profileError) throw profileError;

  return authData;
}
```

**수정 후:**
```typescript
export async function signUp(email: string, password: string, name: string) {
  const supabase = createClient();

  // Auth 계정 생성 (메타데이터에 name 포함)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,  // 트리거에서 raw_user_meta_data->>'name'으로 접근
      },
    },
  });

  if (authError) throw authError;
  if (!authData.user) throw new Error("Failed to create user");

  // users 테이블은 트리거가 자동으로 생성함

  return authData;
}
```

---

## 핵심 포인트

| 방식 | 장점 | 단점 |
|------|------|------|
| 클라이언트에서 직접 INSERT | 코드가 명시적 | RLS 타이밍 이슈, 401 에러 발생 |
| **트리거 사용 (권장)** | 안정적, 타이밍 이슈 없음 | SQL 설정 필요 |

---

## 체크리스트

- [ ] `.env.local` 환경 변수에 공백 없는지 확인
- [ ] 환경 변수 수정 후 서버 재시작
- [ ] Supabase에서 트리거 함수 생성
- [ ] `signUp()` 함수에서 `options.data`로 메타데이터 전달
- [ ] 클라이언트에서 `users` 테이블 직접 INSERT 코드 제거

---

## 참고 자료

- [Supabase Auth - Managing User Data](https://supabase.com/docs/guides/auth/managing-user-data)
- [Supabase RLS - Row Level Security](https://supabase.com/docs/guides/auth/row-level-security)

---

## 추가 이슈: 트리거 함수 search_path 문제

### 문제

트리거가 생성되고 활성화되어 있는데도 (`tgenabled = 'O'`) `users` 테이블에 데이터가 안 쌓임.

### 원인

트리거 함수에 `SET search_path = ''`가 있으면 `public.users` 테이블을 못 찾음.

**❌ 잘못된 코드:**
```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''  -- 이게 문제!
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  ...
END;
$$;
```

### 해결

`SET search_path = ''` 제거:

```sql
DROP FUNCTION IF EXISTS public.handle_new_user() CASCADE;

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.users (id, email, name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'name', 'User')
  );
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
```
