import React from 'react'
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts'
import { useAppDispatch } from '../store'
import { removeWidgetFromCategory } from '../store'

export default function WidgetCard({ widget, categoryId }:{ widget:any; categoryId?:string }){
  const dispatch = useAppDispatch()
  const { type, name, data, id } = widget

  const onEdit = () => {
    window.dispatchEvent(new CustomEvent('cnapp:edit-widget', { detail: id }))
  }

  return (
    <div className="card">
      <div className="title-row">
        <div className="title">{name}</div>
        <div style={{display:'flex',gap:8}}>
          <button className="btn" onClick={onEdit}>...</button>
          {categoryId && <button className="btn" onClick={()=>dispatch(removeWidgetFromCategory({ categoryId, widgetId: id }))}>×</button>}
        </div>
      </div>

      <div style={{flex:1}}>
        {type === 'progress' && data && (
          <div style={{position:'relative',height:130}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" startAngle={90} endAngle={-270} innerRadius={40} outerRadius={60} paddingAngle={2}>
                  {data.map((entry:any, idx:number)=>(<Cell key={idx} fill={entry.color}/>))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-center">
              <div style={{fontSize:18}}>
                {Array.isArray(data) ? data.reduce((s:any,i:any)=>s+i.value,0) : 0}
              </div>
              <div style={{fontSize:12,color:'var(--muted)'}}>Total</div>
            </div>
          </div>
        )}

        {type === 'pie' && data && (
          <div style={{height:140}}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={data} dataKey="value" innerRadius={30} outerRadius={50} paddingAngle={3}>
                  {data.map((entry:any, idx:number)=>(<Cell key={idx} fill={entry.color}/>))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
        )}

        {type === 'bar' && data && (
          <div style={{height:120}}>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart layout="vertical" data={data} margin={{left:20,right:20}}>
                <XAxis type="number" hide />
                <YAxis dataKey="label" type="category" width={120} />
                <Tooltip />
                <Bar dataKey="value" radius={[6,6,6,6]}>
                  {data.map((entry:any, idx:number)=>(<Cell key={idx} fill={entry.color}/>))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        )}

        {type === 'empty' && (
          <div className="empty">
            <div style={{fontSize:16,marginBottom:8}}>No Graph data available!</div>
            <div style={{fontSize:12,color:'var(--muted)'}}>Add data or choose a template.</div>
          </div>
        )}
      </div>
    </div>
  )
}
