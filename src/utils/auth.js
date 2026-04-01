import { getUsers, setUsers, getSession, setSession, clearSession } from './storage.js';

const ADMIN_USERNAME = 'admin';
const ADMIN_PASSWORD = 'admin';

function validateUsername(username) {
  if (!username || typeof username !== 'string') return false;
  if (username.length < 3 || username.length > 20) return false;
  return /^[a-zA-Z0-9]+$/.test(username);
}

function validatePassword(password) {
  if (!password || typeof password !== 'string') return false;
  if (password.length < 6 || password.length > 32) return false;
  return true;
}

function ensureAdminExists() {
  const users = getUsers();
  const adminExists = users.find((u) => u.username === ADMIN_USERNAME);
  if (!adminExists) {
    users.push({
      username: ADMIN_USERNAME,
      password: ADMIN_PASSWORD,
      role: 'admin',
      createdAt: new Date().toISOString(),
    });
    setUsers(users);
  }
}

ensureAdminExists();

export function login(username, password) {
  if (!username || !password) {
    return { success: false, error: 'Username and password are required.' };
  }

  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    setSession({ username: ADMIN_USERNAME, role: 'admin', loginAt: new Date().toISOString() });
    return { success: true };
  }

  const users = getUsers();
  const user = users.find((u) => u.username === username);
  if (!user || user.password !== password) {
    return { success: false, error: 'Invalid credentials.' };
  }

  setSession({ username: user.username, role: user.role, loginAt: new Date().toISOString() });
  return { success: true };
}

export function register(username, password, confirmPassword) {
  if (username === ADMIN_USERNAME) {
    return { success: false, error: 'Cannot register as admin.' };
  }

  if (!validateUsername(username)) {
    return { success: false, error: 'Username must be 3-20 alphanumeric characters.' };
  }

  if (!validatePassword(password)) {
    return { success: false, error: 'Password must be 6-32 characters.' };
  }

  if (password !== confirmPassword) {
    return { success: false, error: 'Passwords do not match.' };
  }

  const users = getUsers();
  if (users.find((u) => u.username === username)) {
    return { success: false, error: 'Username already exists.' };
  }

  const user = {
    username,
    password,
    role: 'viewer',
    createdAt: new Date().toISOString(),
  };
  users.push(user);
  setUsers(users);

  setSession({ username, role: 'viewer', loginAt: new Date().toISOString() });
  return { success: true };
}

export function logout() {
  clearSession();
}

export function getCurrentSession() {
  return getSession();
}

export function getCurrentUser() {
  const session = getSession();
  if (!session) return null;
  const users = getUsers();
  return users.find((u) => u.username === session.username) || null;
}

export function isAdmin() {
  const session = getSession();
  return session ? session.role === 'admin' : false;
}

export function isViewer() {
  const session = getSession();
  return session ? session.role === 'viewer' : false;
}

export function getAllUsers() {
  return getUsers();
}

export function addUser(user) {
  if (!user || !user.username || !user.password || !user.role) {
    return { success: false, error: 'Username, password, and role are required.' };
  }

  if (!validateUsername(user.username)) {
    return { success: false, error: 'Username must be 3-20 alphanumeric characters.' };
  }

  if (!validatePassword(user.password)) {
    return { success: false, error: 'Password must be 6-32 characters.' };
  }

  const users = getUsers();
  if (users.find((u) => u.username === user.username)) {
    return { success: false, error: 'Username already exists.' };
  }

  users.push({
    username: user.username,
    password: user.password,
    role: user.role,
    createdAt: new Date().toISOString(),
  });
  setUsers(users);
  return { success: true };
}

export function deleteUser(username) {
  if (!username) {
    return { success: false, error: 'Username is required.' };
  }

  if (username === ADMIN_USERNAME) {
    return { success: false, error: 'Cannot delete admin user.' };
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.username === username);
  if (index === -1) {
    return { success: false, error: 'User not found.' };
  }

  users.splice(index, 1);
  setUsers(users);
  return { success: true };
}

export function updateUser(user) {
  if (!user || !user.username) {
    return { success: false, error: 'Username is required.' };
  }

  const users = getUsers();
  const index = users.findIndex((u) => u.username === user.username);
  if (index === -1) {
    return { success: false, error: 'User not found.' };
  }

  if (user.password !== undefined && !validatePassword(user.password)) {
    return { success: false, error: 'Password must be 6-32 characters.' };
  }

  users[index] = { ...users[index], ...user };
  setUsers(users);
  return { success: true };
}