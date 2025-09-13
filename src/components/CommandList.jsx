import { useEffect, useState } from "react";
import Command from "./Command.jsx";
import { deleteIcon, editIcon, saveIcon, cancelIcon } from "../assets/index.js";
import { dispatchDataChanged } from "./SectionList.jsx";
import { loadAll, saveAll } from "../dataApi.js";
import { DndContext, closestCenter } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

function SortableRow({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };
  const handleProps = { ...attributes, ...listeners };
  return (
    <div ref={setNodeRef} style={style} className={["rounded", isDragging ? "ring-2 ring-blue-400/60" : ""].join(" ")}> 
      {typeof children === 'function' ? children(handleProps, isDragging) : children}
    </div>
  );
}

function CommandList({sectionId, commands}) {
  const [items, setItems] = useState(commands ?? []);
  const [editingIndex, setEditingIndex] = useState(null);
  const [draft, setDraft] = useState({ title: "", body: "" });

  useEffect(() => {
    setItems(commands ?? []);
  }, [commands]);

  function startEdit(index) {
    const current = items[index] ?? { title: "", body: "" };
    setEditingIndex(index);
    setDraft({ title: current.title ?? "", body: current.body ?? "" });
  }

  async function saveEdit() {
    if (editingIndex === null || sectionId == null) return;
    const idx = editingIndex;
    const updated = { ...items[idx], title: draft.title, body: draft.body };
    setEditingIndex(null);

    const nextItems = [...items];
    nextItems[idx] = updated;
    setItems(nextItems);

    const db = await loadAll();
    const next = { ...(db || {}) };
    const section = (next.sections || []).find((s) => String(s.id) === String(sectionId));
    if (!section) return;
    section.commands[idx] = { title: updated.title, body: updated.body };
    await saveAll(next);
    dispatchDataChanged();
  }

  function cancelEdit() {
    setEditingIndex(null);
  }

  async function remove(index) {
    if (sectionId == null) return;
    setItems((prev) => prev.filter((_, i) => i !== index));

    const db = await loadAll();
    const next = { ...(db || {}) };
    const section = (next.sections || []).find((s) => String(s.id) === String(sectionId));
    if (!section) return;
    section.commands.splice(index, 1);
    await saveAll(next);
    dispatchDataChanged();
  }

  async function persist(nextItems) {
    if (sectionId == null) return;
    const db = await loadAll();
    const updated = { ...(db || {}) };
    const section = (updated.sections || []).find((s) => String(s.id) === String(sectionId));
    if (!section) return;
    section.commands = nextItems;
    await saveAll(updated);
    dispatchDataChanged();
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const from = items.findIndex((_, i) => `cmd-${i}` === active.id);
    const to = items.findIndex((_, i) => `cmd-${i}` === over.id);
    if (from === -1 || to === -1) return;
    const next = arrayMove(items, from, to);
    setItems(next);
    persist(next);
  }

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <SortableContext items={items.map((_, i) => `cmd-${i}`)} strategy={verticalListSortingStrategy}>
        <div className="space-y-2">
          {items.map((command, index) => (
            <SortableRow key={`cmd-${index}`} id={`cmd-${index}`}>
              {(handleProps) => (
                <div className="flex flex-row gap-2 items-center rounded transition">
                  <button title="Drag" className="shrink-0 cursor-grab text-gray-400 px-1" {...handleProps}>⋮⋮</button>

                  <button title="Delete" className="shrink-0" onClick={() => remove(index)}>
                    <img src={deleteIcon} alt="Delete" className="w-5 h-5 hover:cursor-pointer hover:opacity-70" />
                  </button>

                  {editingIndex === index ? (
                    <>
                      <button onClick={saveEdit} title="Save" className="shrink-0">
                        <img src={saveIcon} alt="Save" className="w-5 h-5 hover:cursor-pointer hover:opacity-70" />
                      </button>
                      <button onClick={cancelEdit} title="Cancel" className="shrink-0">
                        <img src={cancelIcon} alt="Cancel" className="w-5 h-5 hover:cursor-pointer hover:opacity-70" />
                      </button>

                      <div className="flex-1 flex items-center gap-3">
                        <div className="flex-1 px-3 py-2 bg-[#1f2329] text-gray-100 rounded border border-gray-700 overflow-x-auto whitespace-pre">
                          <textarea
                            value={draft.body}
                            onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))}
                            className="w-full h-full min-h-[40px] resize-none bg-transparent outline-none font-mono text-gray-100"
                          />
                        </div>
                        <input
                          type="text"
                          value={draft.title}
                          onChange={(e) => setDraft((d) => ({ ...d, title: e.target.value }))}
                          placeholder="Title / Description"
                          className="px-2 py-2 bg-transparent text-gray-300 border-b border-gray-700 focus:border-gray-500 focus:outline-none"
                        />
                      </div>
                    </>
                  ) : (
                    <>
                      <button onClick={() => startEdit(index)} title="Edit" className="shrink-0">
                        <img src={editIcon} alt="Edit" className="w-5 h-5 hover:cursor-pointer hover:opacity-70" />
                      </button>
                      <Command {...command} />
                    </>
                  )}
                </div>
              )}
            </SortableRow>
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}

export default CommandList
