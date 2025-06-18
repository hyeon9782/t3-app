"use client";

import { useState } from "react";
import { api } from "@/trpc/react";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";

type Todo = {
  id: number;
  content: string;
  isDone: boolean;
};

export function TodoList() {
  const [todos, { refetch }]: [Todo[], any] =
    api.todo.getAll.useSuspenseQuery();
  const utils = api.useUtils();
  const [input, setInput] = useState("");

  const createTodo = api.todo.create.useMutation({
    onSuccess: async () => {
      await utils.todo.invalidate();
      setInput("");
    },
  });
  const toggleDone = api.todo.toggleDone.useMutation({
    onSuccess: () => utils.todo.invalidate(),
  });
  const deleteTodo = api.todo.delete.useMutation({
    onSuccess: () => utils.todo.invalidate(),
  });

  return (
    <div className="w-full max-w-xs">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          createTodo.mutate({ content: input });
        }}
        className="mb-4 flex flex-col gap-2"
      >
        <input
          type="text"
          placeholder="할 일을 입력하세요"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="w-full rounded-full bg-white/10 px-4 py-2 text-white"
        />
        <Button type="submit" disabled={createTodo.isPending}>
          {createTodo.isPending ? "추가 중..." : "추가"}
        </Button>
      </form>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id} className="mb-2 flex items-center gap-2">
            <Checkbox
              checked={todo.isDone}
              onCheckedChange={(v) =>
                toggleDone.mutate({ id: todo.id, isDone: !!v })
              }
            />
            <span className={todo.isDone ? "text-gray-400 line-through" : ""}>
              {todo.content}
            </span>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => deleteTodo.mutate({ id: todo.id })}
            >
              🗑️
            </Button>
          </li>
        ))}
      </ul>
    </div>
  );
}
