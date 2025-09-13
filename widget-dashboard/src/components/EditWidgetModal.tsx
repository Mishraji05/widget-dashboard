import React, { useState, useEffect } from 'react'
import { useAppSelector, useAppDispatch, selectWidgets, updateWidget } from '../store'

export default function EditWidgetModal({ widgetId, open, onClose }:{ widgetId:string | null; open:boolean; onClose:()=>void }){
  const widgets = useAppSelector(selectWidgets)
  const dispatch = useAppDispatch()
  const widget = widgetId ? widgets[widgetId] : null

  const [name, setName] = useState('')
  const [type, setType] = useState<'progress'|'pie'|'bar'|'empty'>('pie')
  const [kv, setKv] = useState<{k:string,v:string,c:string}[]>([])

  useEffect(()=>{
    if(!widget){ setName(''); setType('pie'); setKv([]); return }
    setName(widget.name)
    setType(widget.type as any)
    if(widget.data && Array.isArray(widget.data)){
      const arr = widget.data.map((d:any) => d.name ? {k:d.name, v:String(d.value), c:d.color||'#2563eb'} : {k:d.label, v:String(d.value), c:d.color||'#2563eb'})
      setKv(arr)
    } else {
      setKv([])
    }
  }, [widgetId])

  if(!open || !widget) return null

  const save = () => {
    let data = undefined
    if(type !== 'empty'){
      if(type === 'bar') data = kv.map(x=>({label:x.k, value:Number(x.v||0), color:x.c}))
      else data = kv.map(x=>({name:x.k, value:Number(x.v||0), color:x.c}))
    }
    dispatch(updateWidget({ widgetId: widget.id, widget: { name, type, data } }))
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Edit Widget</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div style={{marginTop:12}}>
          <div className="form-row"><input value={name} onChange={e=>setName(e.target.value)} /></div>
          <div className="form-row">
            <select value={type} onChange={e=>setType(e.target.value as any)}>
              <option value="progress">Donut (progress)</option>
              <option value="pie">Pie</option>
              <option value="bar">Bar</option>
              <option value="empty">Empty</option>
            </select>
          </div>

          {type !== 'empty' && (
            <div style={{marginTop:8}}>
              {kv.map((r,idx)=>(
                <div key={idx} className="kv-row">
                  <input value={r.k} onChange={e=>{ const copy = [...kv]; copy[idx].k = e.target.value; setKv(copy); }} />
                  <input value={r.v} onChange={e=>{ const copy = [...kv]; copy[idx].v = e.target.value; setKv(copy); }} />
                  <input value={r.c} onChange={e=>{ const copy = [...kv]; copy[idx].c = e.target.value; setKv(copy); }} />
                  <button className="btn" onClick={()=>{ const copy = [...kv]; copy.splice(idx,1); setKv(copy); }}>x</button>
                </div>
              ))}
              <div style={{marginTop:8}}>
                <button className="btn" onClick={()=>setKv([...kv, {k:'New', v:'1', c:'#2563eb'}])}>Add row</button>
              </div>
            </div>
          )}

          <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
            <button className="btn" onClick={onClose}>Cancel</button>
            <button className="btn primary" onClick={save}>Save</button>
          </div>
        </div>
      </div>
    </div>
  )
}
