import { Outlet } from "react-router";
import { Header } from "@/components/site/header";

export const AssignmentLayout = () => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <div className="sticky top-0 z-50">
        <Header />
      </div>

      <main className="w-full max-w-4xl mx-auto p-6">
        <Outlet />
      </main>
    </div>
  );
}
