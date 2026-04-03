export const at = <T, K>(path: T, callbacks: K[]) =>
  callbacks.flat().map((callback) => ({ path, callback }))

export const sub = <T, K extends { path: string }>(path: T, items: K[]) =>
  items.flat().map((item) => ({ ...item, path: `${path}/${item.path}` }))
