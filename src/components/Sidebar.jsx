import { useEffect, useState } from "react";
import { loadAll } from "../dataApi.js";

function Sidebar() {
  const [sections, setSections] = useState([]);

  async function refresh() {
    const data = await loadAll();
    setSections(data.sections ?? []);
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('data:changed', handler);
    return () => window.removeEventListener('data:changed', handler);
  }, []);

  function scrollToSection(id) {
    const el = document.getElementById(String(id));
    if (!el) return;
    el.scrollIntoView({ behavior: 'smooth', block: 'start', inline: 'nearest' });
  }

  return (
    <>
      <ul className="flex flex-col gap-3 w-2/3">
        {sections.map((section, index) => (
          <li key={index} className="text-center">
            <button
              type="button"
              onClick={() => scrollToSection(section.id)}
              className="w-full hover:bg-gray-700 rounded-md py-1 cursor-pointer"
            >
              {section.title}
            </button>
          </li>
        ))}
      </ul>
    </>
  )
}

export default Sidebar
