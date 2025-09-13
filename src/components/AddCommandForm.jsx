import { useState } from "react";
import { dispatchDataChanged } from "./SectionList.jsx";
import { loadAll, saveAll } from "../dataApi.js";

function AddCommandForm({ sectionId }) {
  const [commandName, setCommandName] = useState("");
  const [commandDescription, setCommandDescription] = useState("");
  const [isAdding, setisAdding] = useState(false);
  
  async function handleSubmit(e) {
    e.preventDefault();
    if (!sectionId) return;

    const db = await loadAll();
    const next = { ...(db || {}) };
    next.sections = Array.isArray(next.sections) ? next.sections : [];
    const section = next.sections.find((s) => String(s.id) === String(sectionId));
    if (!section) return;
    section.commands = Array.isArray(section.commands) ? section.commands : [];
    section.commands.push({ title: commandDescription, body: commandName });

    await saveAll(next);
    setCommandName("");
    setCommandDescription("");
    setisAdding(false);
    dispatchDataChanged();
  }
  
  return (
    <div>
      <button onClick={() => setisAdding(!isAdding)} className="hover:cursor-pointer hover:text-[#bcbbe0]">{isAdding ? "Close" : "Add Command"}</button>
      {isAdding && (
        <>
          <form onSubmit={handleSubmit} className="flex items-center gap-3 mt-4">
            <input
              type="text" 
              placeholder="Command Name"
              value={commandName}
              onChange={e => setCommandName(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <input
              type="text" 
              placeholder="Command Description"
              value={commandDescription}
              onChange={e => setCommandDescription(e.target.value)}
              className="border p-2 rounded mr-2"
            />
            <button type="submit" className="hover:cursor-pointer hover:text-[#bcbbe0]">Add Command</button>
          </form>
        </>
      )}
    </div>
  )
}

export default AddCommandForm
