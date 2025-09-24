// public/js/auth.js - helpers for cookie-based auth
async function authFetch(url, opts){
  opts = opts || {};
  opts.credentials = opts.credentials || 'include';
  opts.headers = opts.headers || {};
  return fetch(url, opts);
}

async function whoami(){
  const res = await fetch('/auth/me', { credentials: 'include' });
  if (!res.ok) return null;
  const j = await res.json();
  return j.user;
}

async function logout(){
  await fetch('/auth/logout', { method: 'POST', credentials: 'include' });
  // optionally redirect
  window.location.href = '/login.html';
}
