import { Outlet } from 'react-router';

export const RootLayout = () => {
  return (
    <div className='relative z-10 w-full h-screen bg-gray-50 overflow-y-auto'>
      <Outlet />
    </div>
  )
}
