import * as Storage from './storage';
export type Account = { id: string; name: string; email: string; password: string; createdAt: string };
const USERS_KEY = 'expenseTrackerUsers';
export async function getUsers(): Promise<Account[]> {
  const raw = await Storage.getItem(USERS_KEY);
  if (!raw) return [];
  try { const parsed = JSON.parse(raw); return Array.isArray(parsed) ? parsed : []; } catch { return []; }
}
export async function registerAccount(data: { name: string; email: string; password: string }) {
  const users = await getUsers();
  const email = data.email.trim().toLowerCase();
  if (users.some(user => user.email.toLowerCase() === email)) throw new Error('An account with this email already exists.');
  const account: Account = { id: `${Date.now()}`, name: data.name.trim(), email, password: data.password, createdAt: new Date().toISOString() };
  users.push(account);
  await Storage.setItem(USERS_KEY, JSON.stringify(users));
  await Storage.setItem('userInfo', JSON.stringify({ name: account.name, email: account.email }));
  await Storage.setItem('authSession', JSON.stringify({ id: account.id, email: account.email }));
}
export async function loginAccount(emailInput: string, password: string) {
  const email = emailInput.trim().toLowerCase();
  const users = await getUsers();
  const account = users.find(user => user.email.toLowerCase() === email && user.password === password);
  if (!account) throw new Error('Incorrect email or password.');
  await Storage.setItem('userInfo', JSON.stringify({ name: account.name, email: account.email }));
  await Storage.setItem('authSession', JSON.stringify({ id: account.id, email: account.email }));
}
export async function logoutAccount() { await Storage.removeItem('authSession'); await Storage.removeItem('userInfo'); }
export async function getCurrentUser(): Promise<{ id: string; email: string } | null> {
  const raw = await Storage.getItem('authSession');
  if (!raw) return null;
  try { return JSON.parse(raw); } catch { return null; }
}