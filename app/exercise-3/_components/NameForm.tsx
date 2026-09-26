"use client";

import { useActionState } from "react";
import { submitName, type FormState } from "../actions";

const initialState: FormState = {};

export default function NameForm() {
  const [state, formAction, isPending] = useActionState(submitName, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4 max-w-sm">
      <label className="flex flex-col gap-1">
        First name
        <input
          type="text"
          name="firstName"
          required
          className="border rounded px-3 py-2"
        />
      </label>
      <label className="flex flex-col gap-1">
        Last name
        <input
          type="text"
          name="lastName"
          required
          className="border rounded px-3 py-2"
        />
      </label>
      <button
        type="submit"
        disabled={isPending}
        className="px-4 py-2 rounded bg-blue-600 text-white disabled:opacity-50"
      >
        {isPending ? "Submitting..." : "Greet me"}
      </button>
      {state.message && <p className="text-xl font-semibold">{state.message}</p>}
    </form>
  );
}
