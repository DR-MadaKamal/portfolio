import {
  DndContext, PointerSensor, TouchSensor, useSensor, useSensors,
} from '@dnd-kit/core'
import { SortableContext, useSortable, arrayMove } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

export function SortableList({ items, onReorder, getId, children }) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(TouchSensor, { activationConstraint: { delay: 200, tolerance: 6 } })
  )

  const handleDragEnd = (event) => {
    const { active, over } = event
    if (!over || active.id === over.id) return
    const oldIndex = items.findIndex(item => getId(item) === active.id)
    const newIndex = items.findIndex(item => getId(item) === over.id)
    if (oldIndex === -1 || newIndex === -1) return
    onReorder(arrayMove(items, oldIndex, newIndex))
  }

  const itemIds = items.map(getId)

  return (
    <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
      <SortableContext items={itemIds}>
        {children}
      </SortableContext>
    </DndContext>
  )
}

export function SortableItem({ id, children }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.4 : 1,
    position: 'relative',
    zIndex: isDragging ? 1 : 'auto',
  }

  return (
    <div ref={setNodeRef} style={style} {...attributes}>
      {children(listeners)}
    </div>
  )
}
