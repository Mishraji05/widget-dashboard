import React, { useState } from 'react'
import { useAppDispatch } from '../store'
import { addWidgetToCategory } from '../store'

const templates = [
  { id: 'tpl-cloud', 
    name: 'Cloud Accounts (Donut)', 
    type: 'progress', 
    data: 
    [{
      name:'Connected',
      value:2,
      color:'#2563eb'
    },
    {
      name:'Not Connected',
      value:2,
      color:'#bfdbfe'
    }] 
  },
  { id: 'tpl-risk', 
    name: 'Cloud Risk (Pie)', 
    type: 'pie', 
    data: 
    [{
      name:'Failed',
      value:1689,
      color:'#ef4444'
    },
    {
      name:'Warning',
      value:681,
      color:'#f59e0b'
    },
    {
      name:'Passed',
      value:7253,
      color:'#10b981'
    }] 
  },
  { id: 'tpl-image', 
    name: 'Image Risk (Bar)',
    type: 'bar', 
    data: 
    [{
      label:'Critical',
      value:9,
      color:'#b91c1c'
    },
    {label:'High',
      value:150,
      color:'#f97316'
    }] 
  },
  { id: 'tpl-empty', 
    name: 'Empty', 
    type: 'empty', 
    data: null 
  }
]

export default function AddWidgetModal({ open, onClose, categoryId }:{ open:boolean; onClose:()=>void; categoryId:string | null }){
  const dispatch = useAppDispatch()
  const [mode, setMode] = useState<'templates'|'custom'>('templates')
  const [name, setName] = useState('')
  const [type, setType] = useState<'progress'|'pie'|'bar'|'empty'>('progress')
  const [kv, setKv] = useState([{k:'A',v:'1',c:'#2563eb'}])

  if(!open || !categoryId) return null

  const addTemplate = (tpl:any) => {
    dispatch(addWidgetToCategory({ categoryId, widget: { name: tpl.name, type: tpl.type as any, data: tpl.data } }))
    onClose()
  }

  const addCustom = () => {
    let data = undefined
    if(type === 'empty') data = undefined
    else if(type === 'bar') data = kv.map(x=>({label:x.k,value:Number(x.v||0),color:x.c}))
    else data = kv.map(x=>({name:x.k,value:Number(x.v||0),color:x.c}))
    dispatch(addWidgetToCategory({ categoryId, widget: { name: name || 'Custom Widget', type: type as any, data } }))
    onClose()
  }

  return (
    <div className="modal-backdrop">
      <div className="modal">
        <div style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
          <div style={{fontWeight:700}}>Add Widget</div>
          <button className="btn" onClick={onClose}>Close</button>
        </div>

        <div style={{marginTop:12}}>
          <div style={{display:'flex',gap:8,marginBottom:12}}>
            <button className={'btn ' + (mode==='templates'?'primary':'')} onClick={()=>setMode('templates')}>Templates</button>
            <button className={'btn ' + (mode==='custom'?'primary':'')} onClick={()=>setMode('custom')}>Custom</button>
          </div>

          {mode === 'templates' ? (
            <div className="template-list">
              {templates.map(t=>(
                <div key={t.id} className="template-card" onClick={()=>addTemplate(t)}>
                  <div style={{fontWeight:700}}>{t.name}</div>
                  <div style={{fontSize:12,color:'var(--muted)'}}>{t.type}</div>
                </div>
              ))}
            </div>
          ) : (
            <div>
              <div className="form-row">
                <input placeholder="Widget name" value={name} onChange={e=>setName(e.target.value)} />
              </div>
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
                  <div style={{fontWeight:600,marginBottom:6}}>Data points</div>
                  {kv.map((r,idx)=>(
                    <div key={idx} className="kv-row">
                      <input value={r.k} onChange={e=>{ const copy = [...kv]; copy[idx].k = e.target.value; setKv(copy); }} placeholder="label" />
                      <input value={r.v} onChange={e=>{ const copy = [...kv]; copy[idx].v = e.target.value; setKv(copy); }} placeholder="value" />
                      <input value={r.c} onChange={e=>{ const copy = [...kv]; copy[idx].c = e.target.value; setKv(copy); }} placeholder="color" />
                      <button className="btn" onClick={()=>{ const copy = [...kv]; copy.splice(idx,1); setKv(copy); }}>x</button>
                    </div>
                  ))}
                  <div style={{marginTop:8}}>
                    <button className="btn" onClick={()=>setKv([...kv, {k:'New',v:'1',c:'#2563eb'}])}>Add row</button>
                  </div>
                </div>
              )}

              <div style={{display:'flex',justifyContent:'flex-end',gap:8,marginTop:12}}>
                <button className="btn" onClick={onClose}>Cancel</button>
                <button className="btn primary" onClick={addCustom}>Add</button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
