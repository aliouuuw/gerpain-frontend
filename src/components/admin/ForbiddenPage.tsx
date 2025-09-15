import { ShieldX } from 'lucide-react';

interface ForbiddenPageProps {
  message?: string;
}

export function ForbiddenPage({ message = "You don't have permission to access this page." }: ForbiddenPageProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <ShieldX className="w-16 h-16 text-red-500 mx-auto mb-6" />
        <h1 className="text-2xl font-light text-gray-900 mb-2">Access Forbidden</h1>
        <p className="text-gray-600 font-light mb-6">{message}</p>
        <a
          href="/dashboard"
          className="inline-block bg-black hover:bg-gray-800 text-white px-6 py-3 rounded-lg text-sm font-light transition-colors"
        >
          Return to Dashboard
        </a>
      </div>
    </div>
  );
}

