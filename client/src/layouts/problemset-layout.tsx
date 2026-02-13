import { Header } from "@/components/site/header";
import { Outlet } from "react-router";

export const ProblemSetLayout = () => {
  return (
    <div className='flex flex-col min-h-screen w-full bg-neutral-950'>
      <Header variant="sticky" theme="dark" />
      <Outlet />
    </div>
  )
}
