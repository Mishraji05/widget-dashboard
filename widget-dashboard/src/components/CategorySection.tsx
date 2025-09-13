import React from 'react'
import { useAppSelector, selectWidgetsForCategory, searchWidgets } from '../store'
import WidgetCard from './WidgetCard'

export default function CategorySection({ id, onAdd, query }: { id:string; onAdd?:()=>void; query?:string }){
  const widgets = useAppSelector(selectWidgetsForCategory(id))
  
  const filtered = useAppSelector(searchWidgets(query || "")) as any[]
  const visibleWidgets = query 
    ? widgets.filter(w => filtered.some(f => f.id === w.id))
    : widgets

  return (
    <>
      {visibleWidgets.map((w:any)=>( <WidgetCard key={w.id} widget={w} categoryId={id} /> ))}
      <div className="card" style={{display:'flex',alignItems:'center',justifyContent:'center'}}>
        <button className="btn primary" onClick={onAdd}>+ Add Widget</button>
      </div>
    </>
  )
}
