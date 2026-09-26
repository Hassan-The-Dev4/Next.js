"use client";

import { useActionState } from "react";
import { submitEmail, type FormState } from "../actions";

const initialState: FormState = {};

export default function EmailForm() {
  const [state, formAction, isPending] = useActionState(submitEmail, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col gap-1">
        Email
        <input
          type="email"
          name="email"
          required
          className="border rounded px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Submit"}
      </button>
      {state.message && <p className="text-green-600">{state.message}</p>}
    </form>
  );
}
