function Command({ title, body }) {
  const copy = (cmd) => {
    try {
      if (typeof window !== 'undefined' && window.electronClipboard) {
        window.electronClipboard.writeText(cmd)
        return
      }
    } catch {}

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(cmd).catch(() => fallbackCopy(cmd))
    } else {
      fallbackCopy(cmd)
    }
  };

  function fallbackCopy(text) {
    try {
      const el = document.createElement('textarea')
      el.value = String(text ?? '')
      el.setAttribute('readonly', '')
      el.style.position = 'absolute'
      el.style.left = '-9999px'
      document.body.appendChild(el)
      el.select()
      document.execCommand('copy')
      document.body.removeChild(el)
    } catch {}
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <code className="flex-1 px-3 py-2 bg-[#1f2329] text-gray-100 rounded border border-gray-700 overflow-x-auto whitespace-pre">{body}</code>
      <button onClick={() => copy(body)} className="px-3 py-2 rounded border border-gray-700 text-gray-200 bg-[#2b313a] hover:border-gray-500 hover:cursor-pointer transition">
        Copy
      </button>
      <span className="ml-2 text-gray-400 text-sm">{title}</span>
    </div>
  );
}

export default Command
