import { httpClient } from '../utils/httpClient';

const USER_ID = 4110;

export function getUserTodos(userId = USER_ID) {
  return httpClient.get(`/todos?userId=${userId}`);
}

export function createTodo({ title, userId = USER_ID, completed = false }) {
  return httpClient.post('/todos', { title, userId, completed });
}

export function deleteTodo(todoId) {
  return httpClient.delete(`/todos/${todoId}`);
}

export function updateTodo({ id, title, completed }) {
  return httpClient.patch(`/todos/${id}`, { title, completed });
}
