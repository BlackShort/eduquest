import { Header } from "@/components/site/header";
import { Outlet } from "react-router";

export const ContestLayout = () => {
    return (
        <div className='flex flex-col min-h-screen w-full bg-neutral-950'>
            <Header variant="sticky" theme="dark" />
            <div className="fixed top-12 inset-0 z-0 
                    bg-[linear-gradient(to_right,var(--color-neutral-900)_1px,transparent_1px),linear-gradient(to_bottom,var(--color-neutral-900)_1px,transparent_1px)] bg-size-[20px_20px] bg-position-[0_0,0_0] 
                    mask-[repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] 
                    [-webkit-mask-image:repeating-linear-gradient(to_right,black_0px,black_3px,transparent_3px,transparent_8px),repeating-linear-gradient(to_bottom,black_0px,black_3px,transparent_3px,transparent_8px)] mask-intersect [-webkit-mask-composite:source-in]"
            />
            <Outlet />
        </div>
    )
}
