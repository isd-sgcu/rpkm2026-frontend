import { useForm } from "react-hook-form";
import { Button } from "@components/ui/button";

type LoginFormValues = {
  email: string;
  password: string;
};

export function LoginPanel() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>();

  const onSubmit = handleSubmit(async (data) => {
    alert(JSON.stringify(data));
  });

  return (
    <section className="grid gap-6 rounded-lg bg-white p-6">
      <h1 className="text-4xl font-bold">Sample Login</h1>
      <form onSubmit={onSubmit} className="flex flex-col gap-4" noValidate>
        <label className="flex flex-col gap-1">
          Email
          <input
            className="rounded-xl border px-3 py-2"
            type="email"
            {...register("email", {
              required: "Email is required",
              pattern: {
                value: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
                message: "Enter a valid email",
              },
            })}
          />
          {errors.email && (
            <span className="text-sm text-red-600">{errors.email.message}</span>
          )}
        </label>
        <label className="flex flex-col gap-1">
          Password
          <input
            type="password"
            className="rounded-xl border px-3 py-2"
            {...register("password", {
              required: "Password is required",
            })}
          />
          {errors.password && (
            <span className="text-sm text-red-600">
              {errors.password.message}
            </span>
          )}
        </label>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Logging in…" : "Login"}
        </Button>
      </form>
    </section>
  );
}
