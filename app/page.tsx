'use client';

import dynamic from 'next/dynamic';

const EditorLayout = dynamic(() => import('@/components/editor/editor-layout').then(mod => mod.EditorLayout), {
  ssr: false,
  loading: () => <div className="flex items-center justify-center h-screen">Loading Editor...</div>
});

export default function Page() {
  return <EditorLayout />;
}