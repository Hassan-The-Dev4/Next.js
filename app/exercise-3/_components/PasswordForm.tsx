"use client";

import { useActionState } from "react";
import { submitPassword, type FormState } from "../actions";

const initialState: FormState = {};

export default function PasswordForm() {
  const [state, formAction, isPending] = useActionState(submitPassword, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col gap-1">
        Password
        <input
          type="password"
          name="password"
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
      {state.error && <p className="text-red-600">{state.error}</p>}
      {state.message && <p className="text-green-600">{state.message}</p>}
    </form>
  );
}
