"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/trpc/react";
import { Button } from "@/components/ui/button";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const register = api.auth.register.useMutation({
    onSuccess: () => router.push("/login"),
    onError: (e) => setError(e.message),
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    register.mutate({ username, password });
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
      <form
        onSubmit={handleSubmit}
        className="flex w-full max-w-xs flex-col gap-4 rounded bg-white/10 p-6"
      >
        <h2 className="mb-2 text-2xl font-bold">회원가입</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="rounded px-3 py-2 text-black"
          required
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="rounded px-3 py-2 text-black"
          required
        />
        {error && <div className="text-sm text-red-400">{error}</div>}
        <Button type="submit" disabled={register.isPending}>
          {register.isPending ? "가입 중..." : "회원가입"}
        </Button>
      </form>
    </main>
  );
}
