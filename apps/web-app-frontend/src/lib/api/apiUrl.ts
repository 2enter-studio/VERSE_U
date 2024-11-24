const baseUrl = import.meta.env.VITE_BASE_URL || 'http://localhost:5179';
console.log('baseUrl', baseUrl);

export const apiUrl = (...endpoints) => {
  const end = endpoints.join('/')
  return `${baseUrl}/api/${end}/`
}
