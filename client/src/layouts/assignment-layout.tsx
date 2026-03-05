import { Outlet } from "react-router";
import { Header } from "@/components/site/header";

export const AssignmentLayout = () => {
  return (
    <div className="flex flex-col min-h-screen w-full bg-neutral-950">
      <Header variant="sticky" theme="dark" />

      <main className="w-full max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
