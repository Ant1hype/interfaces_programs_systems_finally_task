// Простой API-клиент для псевдо-бэкенда (json-server).
// Запуск бэкенда: npm run mock (см. package.json) -> http://localhost:3001
const BASE_URL = 'http://localhost:3001';

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`);
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
