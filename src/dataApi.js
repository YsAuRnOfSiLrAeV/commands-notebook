const hasElectron = typeof window !== 'undefined' && window.dataApi;

export async function loadAll() {
  if (hasElectron) return window.dataApi.loadAll();
  const res = await fetch('/data.json', { cache: 'no-store' })
  return await res.json()
}

export async function saveAll(nextJson) {
  if (hasElectron) return window.dataApi.saveAll(nextJson);
  await fetch('/api/save', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(nextJson),
  })
}
