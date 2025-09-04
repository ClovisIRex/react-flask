import { FormEvent } from "react";
import { Loader2 } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

type Props = {
  username: string;
  password: string;
  loading: boolean;
  onUsername: (v: string) => void;
  onPassword: (v: string) => void;
  onSubmit: (e: FormEvent) => void;
  canSubmit: boolean;
};

export function LoginForm({
  username,
  password,
  loading,
  onUsername,
  onPassword,
  onSubmit,
  canSubmit,
}: Props) {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-base">
            Enter your credentials to access the Notes App.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6" onSubmit={onSubmit}>
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => onUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
                className="h-11 text-lg"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => onPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
                className="h-11 text-lg"
              />
            </div>
            <Button type="submit" className="w-full h-11 text-lg" disabled={!canSubmit}>
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <Loader2 className="animate-spin size-5" />
                  Signing in...
                </span>
              ) : (
                "Login"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
