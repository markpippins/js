import { CreatePost } from '@/components/posts/create-post';
import { PostList } from '@/components/posts/post-list';
import { Suspense } from 'react';
import { Skeleton } from '@/components/ui/skeleton';

export default function HomePage() {
  return (
    <div className="container mx-auto max-w-2xl px-4 py-8">
      <div className="space-y-8">
        <CreatePost />
        <Suspense fallback={<PostListSkeleton />}>
          <PostList />
        </Suspense>
      </div>
    </div>
  );
}

function PostListSkeleton() {
  return (
    <div className="space-y-6">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="rounded-lg border bg-card p-6">
          <div className="flex items-start gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="flex-1 space-y-2">
              <div className="flex items-center gap-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
