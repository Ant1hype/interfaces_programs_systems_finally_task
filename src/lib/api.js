// Простой API-клиент для псевдо-бэкенда (json-server).
// Запуск бэкенда: npm run mock (см. package.json) -> http://localhost:3001
const BASE_URL = 'http://localhost:3001';

function trimStrings(data) {
  if (data === null || data === undefined) return data;
  if (typeof data === 'string') return data.trim();
  if (Array.isArray(data)) return data.map(trimStrings);
  if (typeof data === 'object') {
    const result = {};
    for (const [key, value] of Object.entries(data)) {
      result[key] = trimStrings(value);
    }
    return result;
  }
  return data;
}

async function request(path, options = {}) {
  const response = await fetch(`${BASE_URL}${path}`, options);
  if (!response.ok) {
    throw new Error(`Ошибка запроса ${path}: ${response.status} ${response.statusText}`);
  }
  return response.json();
}

/**
 * Получить список всех товаров.
 * @returns {Promise<Array>}
 */
export function getProducts() {
  return request('/products');
}

/**
 * Получить один товар по id.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export function getProduct(id) {
  return request(`/products/${id}`);
}

/**
 * Получить список категорий.
 * @returns {Promise<Array>}
 */
export function getCategories() {
  return request('/categories');
}

/**
 * Получить список всех пользователей.
 * @returns {Promise<Array>}
 */
export function getUsers() {
  return request('/users');
}

/**
 * Получить пользователя по id.
 * @param {number|string} id
 * @returns {Promise<Object>}
 */
export function getUser(id) {
  return request(`/users/${id}`);
}

export function getUserById(id) {
  return request(`/users/${id}`);
}

/**
 * Найти пользователя по email.
 * @param {string} email
 * @returns {Promise<Object|null>}
 */
export async function getUserByEmail(email) {
  const trimmed = typeof email === 'string' ? email.trim() : '';
  const users = await request(`/users?email=${encodeURIComponent(trimmed)}`);
  return Array.isArray(users) && users.length > 0 ? users[0] : null;
}

/**
 * Создать пользователя.
 * @param {Object} user
 * @returns {Promise<Object>}
 */
export function createUser(user) {
  const trimmed = trimStrings(user);
  return request('/users', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trimmed),
  });
}

/**
 * Обновить данные пользователя.
 * @param {number|string} id
 * @param {Object} patch
 * @returns {Promise<Object>}
 */
export function patchUser(id, patch) {
  const trimmed = trimStrings(patch);
  return request(`/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trimmed),
  });
}
/**
 * Обновить данные товара.
 * @param {number|string} id
 * @param {Object} patch
 * @returns {Promise<Object>}
 */
export function patchProduct(id, patch) {
  const trimmed = trimStrings(patch);
  return request(`/products/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(trimmed),
  });
}


