/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
import { useEffect, useState } from "react";
import Section from "./Section.jsx";
import { loadAll, saveAll } from "../dataApi.js";
import { DndContext, closestCenter, DragOverlay } from "@dnd-kit/core";
import { arrayMove, SortableContext, useSortable, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

export function dispatchDataChanged() {
  window.dispatchEvent(new CustomEvent('data:changed'))
}

function SortableSection({ id, section, index }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, data: { index } });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0 : 1,
  };
  return (
    <div ref={setNodeRef} style={style} className={["rounded-md", isDragging ? "ring-2 ring-blue-400/60 shadow-lg" : ""].join(" ")}> 
      <Section {...section} index={index} dragHandleProps={{ ...attributes, ...listeners }} />
    </div>
  );
}

function SectionList() {
  const [sections, setSections] = useState([]);
  const [activeId, setActiveId] = useState(null);

  async function refresh() {
    const data = await loadAll();
    setSections(data?.sections ?? []);
  }

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener('data:changed', handler);
    return () => window.removeEventListener('data:changed', handler);
  }, []);

  async function persist(next) {
    const db = await loadAll();
    await saveAll({ ...(db || {}), sections: next });
    dispatchDataChanged();
  }

  function handleDragStart(event) {
    setActiveId(event.active?.id ?? null);
  }

  function handleDragEnd(event) {
    const { active, over } = event;
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const from = sections.findIndex((_, i) => `section-${i}` === active.id);
    const to = sections.findIndex((_, i) => `section-${i}` === over.id);
    if (from === -1 || to === -1) return;
    const next = arrayMove(sections, from, to);
    setSections(next);
    persist(next);
  }

  const activeIndex = activeId ? sections.findIndex((_, i) => `section-${i}` === activeId) : -1;
  const activeSection = activeIndex >= 0 ? sections[activeIndex] : null;

  return (
    <DndContext collisionDetection={closestCenter} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <SortableContext items={sections.map((_, i) => `section-${i}`)} strategy={verticalListSortingStrategy}>
        <div className="w-full space-y-8">
          {sections.map((section, i) => (
            <SortableSection key={`section-${i}`} id={`section-${i}`} section={section} index={i} />
          ))}
        </div>
      </SortableContext>
      <DragOverlay>
        {activeSection ? (
          <div className="w-full pointer-events-none">
            <Section {...activeSection} index={activeIndex} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}

export default SectionList
