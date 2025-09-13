import { useState } from "react";
import { loadAll, saveAll } from "../dataApi.js";
import { dispatchDataChanged } from "./SectionList.jsx";

function AddSectionForm() {
  const [sectionName, setSectionName] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    const title = sectionName.trim();
    if (!title) return;

    const db = await loadAll();
    const next = { ...(db || {}), sections: Array.isArray(db?.sections) ? [...db.sections] : [] };

    const id = title.toLowerCase().replace(/\s+/g, '-');
    next.sections.push({ id, title, commands: [] });

    await saveAll(next);
    setSectionName("");
    dispatchDataChanged();
  }

  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <h1 className="text-xl font-semibold text-gray-100 tracking-wide text-center mb-4">COMMAND NOTEBOOK</h1>
      <form onSubmit={handleSubmit} className="flex items-center gap-3">
        <input
          type="text" 
          placeholder="Section Title"
          value={sectionName}
          onChange={e => setSectionName(e.target.value)}
          className="flex-1 bg-[#1f2329] text-gray-100 placeholder-gray-400 border border-gray-700 focus:border-gray-500 focus:outline-none rounded-md px-3 py-2 shadow-sm"
        />
        <button type="submit" className="rounded-md bg-[#2b313a] text-gray-100 px-4 py-2 border border-gray-700 hover:border-gray-500 hover:cursor-pointer transition">
          Add Section
        </button>
      </form>
    </div>
  )
}

export default AddSectionForm
