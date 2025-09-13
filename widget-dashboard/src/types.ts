export type WidgetType = 'progress' | 'pie' | 'bar' | 'empty' | 'text'
export type Widget = { id: string; name: string; type: WidgetType; data?: any }
export type Category = { id: string; name: string; widgetIds: string[] }
export type DashboardState = { widgets: Record<string, Widget>; categories: Category[] }
