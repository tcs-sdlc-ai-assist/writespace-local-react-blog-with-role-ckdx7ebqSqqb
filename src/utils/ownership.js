import { isAdmin, getCurrentSession } from './auth.js';

export function canEditPost(post, session) {
  if (!post || !session || !session.username) return false;
  if (session.role === 'admin') return true;
  return post.author === session.username;
}

export function canDeletePost(post, session) {
  if (!post || !session || !session.username) return false;
  if (session.role === 'admin') return true;
  return post.author === session.username;
}