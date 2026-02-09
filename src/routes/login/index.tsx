import { createFileRoute } from "@tanstack/react-router";
import logo from "@/assets/arkray.png";
import { LoginForm } from "@/features/auth/login-form";
import { ModeToggle } from "@/components/toggle";

export const Route = createFileRoute("/login/")({
  component: LoginPage,
});
export default function LoginPage() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <div className="flex flex-col gap-4 p-6 md:p-10">
        <div className="flex justify-center gap-2 md:justify-start">
          <a href="#" className="flex items-center gap-2 font-medium">
            <img
              className="h-10 w-auto object-contain"
              src={logo}
              alt="Arkray Logo"
            />
          </a>
        </div>
        <div className="flex flex-1 items-center justify-center">
          <div className="w-full max-w-xs">
            <LoginForm />
          </div>
        </div>
      </div>
      <div className="bg-muted relative hidden lg:flex items-center justify-center">
        {/* ThemeSwitch positioned top-right */}
        <div className="absolute top-2 right-2">
          <ModeToggle />
        </div>

        {/* Centered logo */}
        <img className="h-40 w-110 object-cover" src={logo} alt="Image" />
      </div>
    </div>
  );
}
