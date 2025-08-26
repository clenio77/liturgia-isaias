'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { LiturgicalDemo } from '@/components/demo/LiturgicalDemo';

export default function DemoPage() {
  return (
    <AppLayout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 py-8">
        <LiturgicalDemo />
      </div>
    </AppLayout>
  );
}
