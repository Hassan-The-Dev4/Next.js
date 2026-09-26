"use server";

export type FormState = {
  message?: string;
  error?: string;
};

// 1. Basic Form: log the email on the server
export async function submitEmail(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const email = String(formData.get("email") ?? "");
  console.log("Submitted email:", email);
  return { message: "Thanks for submitting!" };
}

// 2. Required Field: password must be at least 6 characters
export async function submitPassword(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const password = String(formData.get("password") ?? "");
  if (password.length < 6) {
    return { error: "Password must be at least 6 characters long." };
  }
  return { message: "Password accepted!" };
}

// 3. Full Name Greeting
export async function submitName(
  _prevState: FormState,
  formData: FormData
): Promise<FormState> {
  const firstName = String(formData.get("firstName") ?? "").trim();
  const lastName = String(formData.get("lastName") ?? "").trim();
  return { message: `Hello, ${firstName} ${lastName}!` };
}
