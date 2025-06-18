import { z } from "zod";
import bcrypt from "bcryptjs";
import { createTRPCRouter, publicProcedure } from "@/server/api/trpc";

export const authRouter = createTRPCRouter({
  register: publicProcedure
    .input(
      z.object({ username: z.string().min(3), password: z.string().min(6) }),
    )
    .mutation(async ({ ctx, input }) => {
      const hashed = await bcrypt.hash(input.password, 10);
      const user = await ctx.db.user.create({
        data: { username: input.username, password: hashed },
      });

      return { id: user.id, username: user.username };
    }),
  login: publicProcedure
    .input(z.object({ username: z.string(), password: z.string() }))
    .mutation(async ({ ctx, input }) => {
      const user = await ctx.db.user.findUnique({
        where: { username: input.username },
      });
      if (!user || !user.password) throw new Error("존재하지 않는 계정입니다.");
      const valid = await bcrypt.compare(input.password, user.password);
      if (!valid) throw new Error("비밀번호가 일치하지 않습니다.");
      // 세션/토큰 발급 로직 필요 (NextAuth 연동)
      return { id: user.id, username: user.username };
    }),
});
