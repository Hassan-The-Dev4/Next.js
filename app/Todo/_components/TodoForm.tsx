"use client";

import Link from "next/link";
import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import {
  ActionState,
  DEFAULT_PRIORITY,
  Priority,
  PRIORITIES,
  Todo,
  TITLE_MAX_LENGTH,
} from "../types/todo";

const PRIORITY_OPTION_STYLES: Record<Priority, string> = {
  low: "has-checked:border-green-500 has-checked:bg-green-50 has-checked:text-green-700",
  medium: "has-checked:border-amber-500 has-checked:bg-amber-50 has-checked:text-amber-700",
  high: "has-checked:border-red-500 has-checked:bg-red-50 has-checked:text-red-700",
};

type TodoFormProps = {
  action: (state: ActionState, formData: FormData) => Promise<ActionState>;
  // Pass a todo to edit it; leave it out to create a new one.
  todo?: Todo;
  submitLabel: string;
  pendingLabel: string;
  // Extra server-rendered content shown above the buttons.
  children?: React.ReactNode;
};

export default function TodoForm({ action, todo, submitLabel, pendingLabel, children }: TodoFormProps) {
  // useActionState (from "react") is React 19's replacement for the deprecated
  // useFormState (from "react-dom"): same API, plus a built-in pending flag.
  const [state, formAction] = useActionState(action, null);

  // React resets the form after every submit. Using the values returned with an
  // error as the defaults means the user's input survives a failed submit.
  const title = state?.values?.title ?? todo?.title ?? "";
  const priority = state?.values?.priority ?? todo?.priority ?? DEFAULT_PRIORITY;

  return (
    <form action={formAction} className="space-y-5">
      {todo && <input type="hidden" name="id" value={todo._id} />}

      <div>
        <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
          Todo Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          defaultValue={title}
          placeholder="Enter your todo..."
          className="w-full px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent aria-invalid:border-red-400"
          required
          maxLength={TITLE_MAX_LENGTH}
          aria-invalid={state?.error ? true : undefined}
          aria-describedby={state?.error ? "form-error" : undefined}
          autoFocus
        />
        <p className="text-xs text-gray-500 mt-1">Maximum {TITLE_MAX_LENGTH} characters</p>
      </div>

      <fieldset>
        <legend className="block text-sm font-medium text-gray-700 mb-2">Priority</legend>
        <div className="flex gap-2">
          {PRIORITIES.map((option) => (
            <label
              key={option}
              className={`flex-1 cursor-pointer rounded-md border border-gray-300 px-3 py-2 text-center text-sm font-medium capitalize text-gray-600 transition-colors hover:bg-gray-50 has-focus-visible:ring-2 has-focus-visible:ring-blue-500 ${PRIORITY_OPTION_STYLES[option]}`}
            >
              <input
                type="radio"
                name="priority"
                value={option}
                defaultChecked={option === priority}
                className="sr-only"
              />
              {option}
            </label>
          ))}
        </div>
      </fieldset>

      {state?.error && (
        <p id="form-error" role="alert" className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-600">
          {state.error}
        </p>
      )}

      {children}

      <div className="flex gap-3">
        <SubmitButton label={submitLabel} pendingLabel={pendingLabel} />
        <Link
          href="/Todo"
          className="px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </Link>
      </div>
    </form>
  );
}

// useFormStatus reads the pending state of the <form> this button is rendered in,
// so the button can disable itself without the form passing props down.
function SubmitButton({ label, pendingLabel }: { label: string; pendingLabel: string }) {
  const { pending } = useFormStatus();

  return (
    <button
      type="submit"
      disabled={pending}
      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
    >
      {pending ? pendingLabel : label}
    </button>
  );
}
