import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch, selectCategories, resetDashboard } from './store'
import CategorySection from './components/CategorySection'
import AddWidgetModal from './components/AddWidgetModal'
import EditWidgetModal from './components/EditWidgetModal'
import ManageWidgetsPanel from './components/ManageWidgetsPanel'

export default function App(){
  const categories = useAppSelector(selectCategories)
  const dispatch = useAppDispatch()

  const [addTarget, setAddTarget] = useState<string | null>(null)
  const [editId, setEditId] = useState<string | null>(null)
  const [query, setQuery] = useState("")
  const [range, setRange] = useState("last2days")

  useEffect(()=>{
    const handler = (e: any) => setEditId(e.detail)
    window.addEventListener('cnapp:edit-widget', handler)
    return () => window.removeEventListener('cnapp:edit-widget', handler)
  },[])

  const refresh = () => {
    dispatch(resetDashboard())
  }

  return (
    <div className="container">
      <div className="header">
        <div style={{minWidth:120}} className="breadcrumb">Home › <strong>Dashboard V2</strong></div>
        <div className="search">
          <input 
            placeholder="Search anything..." 
            value={query}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
          />
        </div>

        <div className="actions toolbar-right">
          <button className="btn" onClick={()=>setAddTarget(categories[0]?.id ?? null)}>Add Widget</button>
          <button className="btn" onClick={refresh}>⟳</button>
          <select 
            className="btn small-pill" 
            value={range} 
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setRange(e.target.value)}
          >
            <option value="last2days">Last 2 days</option>
            <option value="last7days">Last 7 days</option>
            <option value="last30days">Last 30 days</option>
          </select>
        </div>
      </div>

      <div style={{marginBottom:12}}>
        <div style={{fontSize:18,fontWeight:700}}>CNAPP Dashboard</div>
      </div>

      <div style={{display:'grid',gap:18}}>
        {categories.map(cat => (
          <div key={cat.id}>
            <div className="section-title">{cat.name}</div>
            <div className="widget-grid" style={{marginBottom:12}}>
              <CategorySection id={cat.id} query={query} onAdd={()=>setAddTarget(cat.id)} />
            </div>
          </div>
        ))}
      </div>

      <ManageWidgetsPanel open={false} onClose={()=>{}} />
      <AddWidgetModal open={!!addTarget} categoryId={addTarget} onClose={()=>setAddTarget(null)} />
      <EditWidgetModal widgetId={editId} open={!!editId} onClose={()=>setEditId(null)} />
    </div>
  )
}
