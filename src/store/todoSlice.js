// todoSlice.js - Redux slice for todos and categories
// Handles all actions related to todos and categories

import { createSlice } from '@reduxjs/toolkit';

// Default categories for the app
const defaultCategories = [
  { name: 'Packing', icon: '🧳' },
  { name: 'Trip Planner', icon: '📅' },
  { name: 'Documents', icon: '📂' },
  { name: 'Bucket List', icon: '🌍' },
];

// Load initial state from localStorage or use defaults
const loadState = () => {
  const savedTodos = localStorage.getItem('tripMateTodos');
  const savedCategories = localStorage.getItem('tripMateCategories');
  
  return {
    todos: savedTodos ? savedTodos.split(',').map(todo => {
      const [id, title, category, done] = todo.split('|');
      return { id: Number(id), title, category, done: done === 'true' };
    }) : [],
    categories: savedCategories ? savedCategories.split(',').map(cat => {
      const [name, icon] = cat.split('|');
      return { name, icon };
    }) : defaultCategories,
  };
};

// Save state to localStorage
const saveState = (state) => {
  // Save todos
  const todosString = state.todos.map(todo => 
    `${todo.id}|${todo.title}|${todo.category}|${todo.done}`
  ).join(',');
  localStorage.setItem('tripMateTodos', todosString);

  // Save categories
  const categoriesString = state.categories.map(cat => 
    `${cat.name}|${cat.icon}`
  ).join(',');
  localStorage.setItem('tripMateCategories', categoriesString);
};

// Create the todo slice with reducers for all actions
const todoSlice = createSlice({
  name: 'todo',
  initialState: loadState(),
  reducers: {
    // Add a new todo
    addTodo: (state, action) => {
      state.todos.push(action.payload);
      saveState(state);
    },
    // Update an existing todo
    updateTodo: (state, action) => {
      const { id, updatedTodo } = action.payload;
      const idx = state.todos.findIndex(t => t.id === id);
      if (idx !== -1) {
        state.todos[idx] = { ...state.todos[idx], ...updatedTodo };
        saveState(state);
      }
    },
    // Delete a todo by id
    deleteTodo: (state, action) => {
      state.todos = state.todos.filter(t => t.id !== action.payload);
      saveState(state);
    },
    // Toggle completion status of a todo
    toggleTodo: (state, action) => {
      const todo = state.todos.find(t => t.id === action.payload);
      if (todo) {
        todo.done = !todo.done;
        saveState(state);
      }
    },
    // Add a new category
    addCategory: (state, action) => {
      state.categories.push(action.payload);
      saveState(state);
    },
    // Update a category name (and update todos in that category)
    updateCategory: (state, action) => {
      const { oldName, newName } = action.payload;
      const cat = state.categories.find(c => c.name === oldName);
      if (cat) {
        cat.name = newName;
        state.todos.forEach(t => {
          if (t.category === oldName) t.category = newName;
        });
        saveState(state);
      }
    },
    // Delete a category (and remove todos in that category)
    deleteCategory: (state, action) => {
      state.categories = state.categories.filter(c => c.name !== action.payload);
      state.todos = state.todos.filter(t => t.category !== action.payload);
      saveState(state);
    },
  },
});

// Export actions for use in components
export const {
  addTodo,
  updateTodo,
  deleteTodo,
  toggleTodo,
  addCategory,
  updateCategory,
  deleteCategory,
} = todoSlice.actions;

// Export the reducer for the store
export default todoSlice.reducer; 