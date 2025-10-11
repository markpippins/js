'use server';

import { suggestPostTags } from '@/ai/flows/suggest-post-tags';
import { revalidatePath } from 'next/cache';

// Mock function to "save" a post
async function savePost(post: { content: string; tags: string[] }) {
  console.log('Saving post:', post);
  // In a real app, you'd save this to a database and the mock data would be updated.
  // For now, we just simulate a delay.
  await new Promise(resolve => setTimeout(resolve, 500));
  return { success: true };
}

export async function createPostAction(prevState: any, formData: FormData) {
  const content = formData.get('content') as string;
  const tags = formData.getAll('tags') as string[];

  if (!content || content.trim().length === 0) {
    return { message: 'Content cannot be empty.', type: 'error' };
  }

  try {
    await savePost({ content, tags });
    revalidatePath('/');
    return { message: 'Post created successfully!', type: 'success' };
  } catch (error) {
    return { message: 'Failed to create post.', type: 'error' };
  }
}

export async function suggestTagsAction(postContent: string) {
  if (!postContent) {
    return { suggestedTags: [], error: null };
  }
  try {
    const result = await suggestPostTags({ postContent });
    return { suggestedTags: result.suggestedTags, error: null };
  } catch (error) {
    console.error('Error suggesting tags:', error);
    return { suggestedTags: [], error: 'Could not suggest tags.' };
  }
}
