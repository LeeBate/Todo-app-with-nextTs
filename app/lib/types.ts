export interface Todo {
  id: number
  title?: string
  completed?: boolean
  userId?: number
}

export interface CreateTodoRequest {
  title?: string
  completed?: boolean
  userId?: number
}

export interface UpdateTodoRequest {
  title?: string
  completed?: boolean
}
