import Link from "next/link";

import { TodoList } from "@/app/_components/post";
import { auth } from "@/server/auth";
import { HydrateClient } from "@/trpc/server";

export default async function Home() {
  const session = await auth();

  console.log(session);

  return (
    <HydrateClient>
      <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {session?.user && <TodoList />}
      </main>
    </HydrateClient>
  );
}
