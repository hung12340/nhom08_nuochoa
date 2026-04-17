'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AuthPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/login');
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 via-white to-amber-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-amber-600 text-lg font-semibold">Chuyển hướng...</div>
      </div>
    </div>
  );
}
