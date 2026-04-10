import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@fortawesome/fontawesome-free/css/all.min.css'
import './index.css'
import App from './App.jsx'

const setFavicon = () => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stop-color="#2575fc"/><stop offset="100%" stop-color="#20c997"/></linearGradient></defs><rect width="64" height="64" rx="14" fill="#0f172a"/><circle cx="32" cy="32" r="22" fill="url(#g)"/><text x="32" y="39" text-anchor="middle" font-family="Segoe UI, Arial, sans-serif" font-size="24" font-weight="700" fill="#f8fbff">A</text></svg>`
  const faviconUrl = `data:image/svg+xml,${encodeURIComponent(svg)}`
  let link = document.querySelector("link[rel~='icon']")
  if (!link) {
    link = document.createElement('link')
    link.rel = 'icon'
    document.head.appendChild(link)
  }
  link.type = 'image/svg+xml'
  link.href = faviconUrl
}

setFavicon()

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
