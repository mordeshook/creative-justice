// app/brand-logo/page.jsx
'use client';

import { Suspense } from 'react';
import BrandLogoGenerator from '@/components/BrandLogoGenerator';
import { useSearchParams } from 'next/navigation';

function BrandLogoPageContent() {
  const searchParams = useSearchParams();
  const draftId = searchParams.get('draftId');

  if (!draftId) {
    return <div className="p-4 text-center">Please provide a draftId in the URL.</div>;
  }

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center">
      <h1 className="text-2xl font-semibold mb-4">Dynamic Brand Logos</h1>
      <BrandLogoGenerator draftId={draftId} />
    </div>
  );
}

export default function BrandLogoPage() {
  return (
    <Suspense fallback={<div className="p-4 text-center">Loading...</div>}>
      <BrandLogoPageContent />
    </Suspense>
  );
}
