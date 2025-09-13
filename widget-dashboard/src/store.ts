import { configureStore, createSlice, PayloadAction } from '@reduxjs/toolkit'
import { useDispatch, useSelector } from 'react-redux'
import type { Category, Widget, DashboardState } from './types'
import initial from './data/initialData.json'

const STORAGE_KEY = 'cnapp_dashboard_v1'
const genId = () => Math.random().toString(36).slice(2, 9)

const loadState = (): DashboardState => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return { widgets: initial.widgets as any, categories: initial.categories as any }
    return JSON.parse(raw)
  } catch (e) {
    return { widgets: initial.widgets as any, categories: initial.categories as any }
  }
}

const saveState = (state: DashboardState) => {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)) } catch (e) {}
}

const initialState: DashboardState = loadState()

const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    addWidgetToCategory: (state, action: PayloadAction<{ categoryId: string; widget: Omit<Widget, 'id'> }>) => {
      const id = genId()
      const newWidget: Widget = { id, ...action.payload.widget }
      state.widgets[id] = newWidget
      const cat = state.categories.find(c => c.id === action.payload.categoryId)
      if (cat) cat.widgetIds.push(id)
    },
    updateWidget: (state, action: PayloadAction<{ widgetId: string; widget: Partial<Widget> }>) => {
      const w = state.widgets[action.payload.widgetId]
      if (!w) return
      state.widgets[action.payload.widgetId] = { ...w, ...action.payload.widget }
    },
    removeWidgetFromCategory: (state, action: PayloadAction<{ categoryId: string; widgetId: string }>) => {
      const cat = state.categories.find(c => c.id === action.payload.categoryId)
      if (cat) cat.widgetIds = cat.widgetIds.filter(id => id !== action.payload.widgetId)
    },
    setWidgetInCategory: (state, action: PayloadAction<{ categoryId: string; widgetId: string; checked: boolean }>) => {
      const cat = state.categories.find(c => c.id === action.payload.categoryId)
      if (!cat) return
      const { widgetId, checked } = action.payload
      const has = cat.widgetIds.includes(widgetId)
      if (checked && !has) cat.widgetIds.push(widgetId)
      if (!checked && has) cat.widgetIds = cat.widgetIds.filter(id => id !== widgetId)
    },

    resetDashboard: (state) => {
      state.widgets = initial.widgets as any
      state.categories = initial.categories as any
    }
  }
})

export const { addWidgetToCategory, removeWidgetFromCategory, setWidgetInCategory, updateWidget, resetDashboard } = dashboardSlice.actions

export const store = configureStore({ reducer: { dashboard: dashboardSlice.reducer } })

store.subscribe(() => {
  try { const state = (store.getState() as any).dashboard as DashboardState; saveState(state) } catch (e) {}
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector = <T>(fn: (state: RootState) => T): T => useSelector(fn)
export const selectCategories = (state: RootState) => state.dashboard.categories
export const selectWidgets = (state: RootState) => state.dashboard.widgets
export const selectWidgetsForCategory = (id: string) => (state: RootState) => {
  const cat = state.dashboard.categories.find(c => c.id === id)
  if (!cat) return []
  return cat.widgetIds.map(wid => state.dashboard.widgets[wid]).filter(Boolean)
}
export const searchWidgets = (query: string) => (state: RootState) => {
  const q = query.trim().toLowerCase()
  const all = Object.values(state.dashboard.widgets)
  if (!q) return all
  return all.filter(w => w.name.toLowerCase().includes(q) || (w.data && JSON.stringify(w.data).toLowerCase().includes(q)))
}
