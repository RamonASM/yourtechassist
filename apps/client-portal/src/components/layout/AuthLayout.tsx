import { Outlet, Link } from 'react-router-dom';

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-primary-100 flex flex-col">
      <header className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
            <span className="text-white font-bold">YT</span>
          </div>
          <span className="font-semibold text-xl text-gray-900">
            YourTechAssist
          </span>
        </Link>
      </header>

      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </main>

      <footer className="p-6 text-center text-sm text-gray-500">
        &copy; {new Date().getFullYear()} YourTechAssist. All rights reserved.
      </footer>
    </div>
  );
}
