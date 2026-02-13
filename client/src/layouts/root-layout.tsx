import { Outlet } from 'react-router';

export const RootLayout = () => {
  return (
    <div className='relative w-full h-screen bg-gray-50 overflow-y-auto'>
      <Outlet />
    </div>
  )
}
