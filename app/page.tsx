'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import { Skeleton } from '@/components/ui/skeleton';

const EditorSkeleton: React.FC = () => (
  <div role="status" aria-label="Loading the editor" className="h-screen w-screen flex flex-col bg-background text-foreground">
    <span className="sr-only">Loading editor...</span>

    <header className="flex items-center justify-between p-4 border-b border-muted">
      <div className="flex items-center gap-3">
        <Skeleton className="h-8 w-40 rounded-none" />
        <Skeleton className="h-6 w-24 rounded-none" />
      </div>

      <div className="flex gap-2">
        <Skeleton className="h-8 w-24 rounded-none" />
        <Skeleton className="h-8 w-24 rounded-none" />
        <Skeleton className="h-8 w-8 rounded-none" />
      </div>
    </header>

    <div className="flex flex-1">
      <aside className="w-64 border-r border-muted p-4 space-y-4">
        <Skeleton className="h-6 w-28 rounded-none" />
        <div className="space-y-3">
          <Skeleton className="h-10 w-full rounded-none" />
          <Skeleton className="h-10 w-full rounded-none" />
          <Skeleton className="h-10 w-3/4 rounded-none" />
        </div>
      </aside>

      <main className="flex-1 p-6 flex flex-col gap-4">
        <div className="flex-1 rounded-none border border-muted flex items-center justify-center">
          <Skeleton className="w-full h-full rounded-none" />
        </div>

        <div className="h-20 flex items-center gap-4">
          <Skeleton className="h-12 w-36 rounded-none" />
          <Skeleton className="h-12 w-36 rounded-none" />
          <Skeleton className="h-12 w-36 rounded-none" />
        </div>
      </main>

      <aside className="w-80 p-4 border-l border-muted">
        <Skeleton className="h-6 w-36 rounded-none mb-4" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-full rounded-none" />
          <Skeleton className="h-4 w-3/4 rounded-none" />
        </div>

        <div className="mt-6 flex gap-2">
          <Skeleton className="h-8 w-20 rounded-none" />
          <Skeleton className="h-8 w-20 rounded-none" />
        </div>
      </aside>
    </div>
  </div>
)

const EditorLayout = dynamic(() => import('@/components/editor/editor-layout').then(mod => mod.EditorLayout), {
  ssr: false,
  loading: () => <EditorSkeleton />
});

export default function Page() {
  return <EditorLayout />;
}