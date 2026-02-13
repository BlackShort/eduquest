import { Header } from "@/components/site/header";
import { Outlet } from "react-router";

export const ProblemListLayout = () => {
  return (
    <div className='flex flex-col min-h-screen w-full'>
      <Header variant="sticky" />
      <Outlet />
    </div>
  )
}
