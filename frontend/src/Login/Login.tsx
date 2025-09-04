import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card"

import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

export default function Login() {
  return (
    <div className="min-h-screen flex items-center justify-center dark:bg-slate-950 p-4">
      <Card className="w-full max-w-md shadow-lg">
        <CardHeader className="space-y-2 text-center">
          <CardTitle className="text-3xl font-bold">Login</CardTitle>
          <CardDescription className="text-base">
            Enter your username and password:
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input id="username" type="text" required className="h-11 text-lg" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input id="password" type="password" required className="h-11 text-lg" />
            </div>
            <Button type="submit" className="w-full h-11 text-lg">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
