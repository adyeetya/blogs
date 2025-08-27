/* eslint-disable @typescript-eslint/no-explicit-any */
// components/AdminLogin.tsx
import { Button } from "../../../components/ui/button";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(1, "Password is required"),
});

export function AdminLogin({ onLogin }: { onLogin: (data: any) => void }) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(schema),
  });
  const [error, setError] = useState<string | null>(null);

  const submit = async (data: any) => {
    setError(null);
    try {
      // Call your /admin/login API (adjust as needed)
      // await axios.post("/api/admin/login", data);
      onLogin(data);
    } catch (e: any) {
      setError(e?.response?.data?.message || "Login failed");
    }
  };

  return (
    <Card className="max-w-md mx-auto mt-20">
      <CardHeader>Admin Login</CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(submit)} className="space-y-4">
          <Input type="email" {...register("email")} />
          {errors.email && (
            <div className="text-destructive">{errors.email.message}</div>
          )}
          <Input type="password" {...register("password")} />
          {error && <div className="text-destructive">{error}</div>}
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-500 text-white"
          >
            Login
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
