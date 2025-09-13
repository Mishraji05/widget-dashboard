import React, { useMemo } from 'react'
import { useAppDispatch, useAppSelector, selectCategories, selectWidgets, setWidgetInCategory } from '../store'

export default function ManageWidgetsPanel({ open, onClose }:{ open:boolean; onClose:()=>void }){
  const dispatch = useAppDispatch()
  const categories = useAppSelector(selectCategories)
  const widgets = useAppSelector(selectWidgets)
  const allWidgets = useMemo(()=>Object.values(widgets), [widgets])
  if(!open) return null
  return (
    <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.3)',display:'grid',placeItems:'center',zIndex:60}}>
      <div style={{width:760,maxHeight:'80vh',overflow:'auto'}} className="card">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Manage Widgets</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>
        <div style={{marginTop:12,display:'grid',gap:12}}>
          {categories.map((cat:any)=>(
            <div key={cat.id} className="card" style={{background:'transparent',boxShadow:'none',border:'1px solid var(--border)'}}>
              <div style={{display:'flex',justifyContent:'space-between'}}>
                <strong>{cat.name}</strong>
                <span className="small-pill">{cat.widgetIds.length} widgets</span>
              </div>
              <div style={{marginTop:8,display:'flex',flexDirection:'column',gap:8}}>
                {allWidgets.map((w:any)=>{
                  const checked = cat.widgetIds.includes(w.id)
                  return (
                    <label key={w.id} style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
                      <div>
                        <div style={{fontWeight:600}}>{w.name}
                        </div>
                        <div style={{fontSize:12,color:'var(--muted)'}}>{w.type}</div>
                      </div>
                      <input type="checkbox" checked={checked} onChange={e=>dispatch(setWidgetInCategory({categoryId:cat.id,widgetId:w.id,checked:e.target.checked}))} />
                    </label>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
