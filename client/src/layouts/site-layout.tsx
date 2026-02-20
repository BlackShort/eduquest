import { Header } from '@/components/site/header';
import { Outlet } from 'react-router';

export const SiteLayout = () => {
    return (
        <div className='relative flex flex-col min-h-screen w-full'>
            <Header variant='sticky' theme="dark" />
            <Outlet />
        </div>
    )
}
