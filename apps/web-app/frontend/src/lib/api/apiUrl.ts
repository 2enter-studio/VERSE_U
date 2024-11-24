const baseUrl = window.location.origin

export const apiUrl = (...endpoints) => {
  const end = endpoints.join('/')
  return `${baseUrl}/api/${end}/`
}
