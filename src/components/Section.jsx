import AddCommandForm from "./AddCommandForm.jsx";
import CommandList from "./CommandList.jsx";
import { loadAll, saveAll } from "../dataApi.js";
import { dispatchDataChanged } from "./SectionList.jsx";

function Section({id, title, commands, dragHandleProps}) {
  async function removeSection() {
    const db = await loadAll();
    const next = { ...(db || {}) };
    next.sections = Array.isArray(next.sections) ? next.sections.filter((s) => String(s.id) !== String(id)) : [];
    await saveAll(next);
    dispatchDataChanged();
  }

  return (
    <div className="w-full max-w-3xl mx-auto mb-10">
      <div className="flex items-center justify-between mb-3">
        <h2 id={id} className="text-lg font-semibold text-gray-100" {...(dragHandleProps || {})}>{title}</h2>
        <button onClick={removeSection} className="text-sm text-gray-400 hover:text-red-400 hover:cursor-pointer border border-gray-700 rounded px-2 py-1">
          Delete section
        </button>
      </div>
      <div className="mb-4">
        <AddCommandForm sectionId={id} />
      </div>
      <CommandList sectionId={id} commands={commands} />
    </div>
  )
}

export default Section
