export async function api<T = Record<string, unknown>>(
  url: string,
  opts?: RequestInit & { json?: unknown }
): Promise<T> {
  const { json, ...rest } = opts ?? {}
  const res = await fetch(url, {
    ...rest,
    headers: {
      ...(json ? { "Content-Type": "application/json" } : {}),
      ...(rest.headers ?? {}),
    },
    body: json !== undefined ? JSON.stringify(json) : rest.body,
    cache: "no-store",
  })
  const data = (await res.json().catch(() => ({}))) as T & { error?: string }
  if (!res.ok) throw new Error(data?.error || `Request failed (${res.status})`)
  return data
}
