import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'
import fs from 'fs'
import path from 'path'

function saveApiPlugin() {
  return {
    name: 'save-api',
    configureServer(server) {
      const dataPath = path.resolve(process.cwd(), 'public', 'data.json')

      server.middlewares.use(async (req, res, next) => {
        if (!req.url || req.method !== 'POST' || req.url !== '/api/save') return next()

        let body = ''
        req.on('data', (c) => (body += c))
        req.on('end', () => {
          try {
            const json = body ? JSON.parse(body) : {}
            fs.writeFileSync(dataPath, JSON.stringify(json, null, 2), 'utf-8')
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ ok: true }))
          } catch (e: any) {
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ error: e?.message || String(e) }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ command }) => ({
  base: command === 'build' ? './' : '/',
  plugins: [react(), tailwind(), ...(command === 'serve' ? [saveApiPlugin()] : [])],
}))
