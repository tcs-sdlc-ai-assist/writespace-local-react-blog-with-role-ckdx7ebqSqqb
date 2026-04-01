import { getPosts, setPosts } from './storage.js';

function generateId() {
  return Date.now().toString(36) + Math.random().toString(36).substring(2, 9);
}

export function getAllPosts() {
  try {
    return getPosts();
  } catch {
    return [];
  }
}

export function getPostById(postId) {
  try {
    const posts = getPosts();
    return posts.find((p) => p.id === postId) || null;
  } catch {
    return null;
  }
}

export function createPost(post, user) {
  if (!user || !user.username) {
    return { status: 'error', message: 'User not authenticated.' };
  }

  if (!post || !post.title || typeof post.title !== 'string' || !post.title.trim()) {
    return { status: 'error', message: 'Title is required.' };
  }

  if (!post.content || typeof post.content !== 'string' || !post.content.trim()) {
    return { status: 'error', message: 'Content is required.' };
  }

  if (post.title.length > 100) {
    return { status: 'error', message: 'Title must be at most 100 characters.' };
  }

  if (post.content.length > 1000) {
    return { status: 'error', message: 'Content must be at most 1000 characters.' };
  }

  try {
    const now = new Date().toISOString();
    const newPost = {
      id: generateId(),
      title: post.title.trim(),
      content: post.content.trim(),
      author: user.username,
      createdAt: now,
      updatedAt: now,
    };

    const posts = getPosts();
    posts.push(newPost);
    setPosts(posts);

    return { status: 'success', post: newPost };
  } catch {
    return { status: 'error', message: 'Failed to create post.' };
  }
}

export function updatePost(postId, updates, user) {
  if (!user || !user.username) {
    return { status: 'error', message: 'User not authenticated.' };
  }

  if (!postId) {
    return { status: 'error', message: 'Post ID is required.' };
  }

  if (updates.title !== undefined) {
    if (typeof updates.title !== 'string' || !updates.title.trim()) {
      return { status: 'error', message: 'Title is required.' };
    }
    if (updates.title.length > 100) {
      return { status: 'error', message: 'Title must be at most 100 characters.' };
    }
  }

  if (updates.content !== undefined) {
    if (typeof updates.content !== 'string' || !updates.content.trim()) {
      return { status: 'error', message: 'Content is required.' };
    }
    if (updates.content.length > 1000) {
      return { status: 'error', message: 'Content must be at most 1000 characters.' };
    }
  }

  try {
    const posts = getPosts();
    const index = posts.findIndex((p) => p.id === postId);

    if (index === -1) {
      return { status: 'error', message: 'Post not found.' };
    }

    const post = posts[index];

    if (user.role !== 'admin' && post.author !== user.username) {
      return { status: 'error', message: 'Unauthorized.' };
    }

    if (updates.title !== undefined) {
      post.title = updates.title.trim();
    }
    if (updates.content !== undefined) {
      post.content = updates.content.trim();
    }
    post.updatedAt = new Date().toISOString();

    posts[index] = post;
    setPosts(posts);

    return { status: 'success', post };
  } catch {
    return { status: 'error', message: 'Failed to update post.' };
  }
}

export function deletePost(postId, user) {
  if (!user || !user.username) {
    return { status: 'error', message: 'User not authenticated.' };
  }

  if (!postId) {
    return { status: 'error', message: 'Post ID is required.' };
  }

  try {
    const posts = getPosts();
    const post = posts.find((p) => p.id === postId);

    if (!post) {
      return { status: 'error', message: 'Post not found.' };
    }

    if (user.role !== 'admin' && post.author !== user.username) {
      return { status: 'error', message: 'Unauthorized.' };
    }

    const filtered = posts.filter((p) => p.id !== postId);
    setPosts(filtered);

    return { status: 'success' };
  } catch {
    return { status: 'error', message: 'Failed to delete post.' };
  }
}

export function getLatestPosts(count) {
  try {
    const posts = getPosts();
    const sorted = posts.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    return sorted.slice(0, count);
  } catch {
    return [];
  }
}