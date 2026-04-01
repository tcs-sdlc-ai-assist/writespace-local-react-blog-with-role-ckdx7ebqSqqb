const KEYS = {
  USERS: 'ws_users',
  POSTS: 'ws_posts',
  SESSION: 'ws_session',
};

export function getUsers() {
  try {
    const data = localStorage.getItem(KEYS.USERS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setUsers(users) {
  try {
    localStorage.setItem(KEYS.USERS, JSON.stringify(users));
  } catch {
    // silent fail
  }
}

export function getPosts() {
  try {
    const data = localStorage.getItem(KEYS.POSTS);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function setPosts(posts) {
  try {
    localStorage.setItem(KEYS.POSTS, JSON.stringify(posts));
  } catch {
    // silent fail
  }
}

export function getSession() {
  try {
    const data = localStorage.getItem(KEYS.SESSION);
    return data ? JSON.parse(data) : null;
  } catch {
    return null;
  }
}

export function setSession(session) {
  try {
    localStorage.setItem(KEYS.SESSION, JSON.stringify(session));
  } catch {
    // silent fail
  }
}

export function clearSession() {
  try {
    localStorage.removeItem(KEYS.SESSION);
  } catch {
    // silent fail
  }
}