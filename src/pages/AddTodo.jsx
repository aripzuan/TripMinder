// AddTodo.jsx - Page for adding new todos and managing todos in a selected category

import { Container, Form, Button, ListGroup, InputGroup } from "react-bootstrap";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { addTodo, toggleTodo, deleteTodo } from "../store/todoSlice";

export default function AddTodo() {
  // Redux hooks for accessing and updating global state
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos);
  const categories = useSelector((state) => state.todo.categories);
  // Local state for new todo input and selected category
  const [newTodo, setNewTodo] = useState("");
  const [category, setCategory] = useState(categories[0].name);
  const navigate = useNavigate();

  // Handle adding a new todo (dispatches to Redux)
  const handleAddTodo = (e) => {
    e.preventDefault();
    if (newTodo.trim()) { // if the new todo is not empty, add it to the list
      const todo = {
        id: Date.now(),
        title: newTodo,
        category,
        done: false,
      };
      dispatch(addTodo(todo)); // dispatch the addTodo action to the Redux store
      setNewTodo(""); // clear the input field
    }
  };

  // Filter todos by selected category
  const filteredTodos = todos.filter(todo => todo.category === category);

  return (
    <Container className="py-4">
      {/* Header with page title and back button */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Add New Todo</h2>
        <Button variant="secondary" onClick={() => navigate('/')}>Back to Home</Button>
      </div>

      {/* Form to add a new todo */}
      <Form onSubmit={handleAddTodo} className="mb-4">
        <InputGroup>
          <Form.Control
            type="text"
            placeholder="Enter new todo"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
          />
          <Form.Select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            style={{ maxWidth: '200px' }}
          >
            {categories.map((cat) => (
              <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
            ))} {/* map over the categories and create an option for each category*/}
          </Form.Select>
          <Button type="submit" variant="primary">
            Add Todo
          </Button>
        </InputGroup>
      </Form>

      {/* List of todos in the selected category */}
      <h3 className="mb-3">Current {category} Todos</h3>
      <ListGroup>
        {filteredTodos.map((todo) => (
          <ListGroup.Item
            key={todo.id}
            className={`d-flex justify-content-between align-items-center ${
              todo.done ? 'bg-success bg-opacity-10' : ''
            }`}
          >
            <div className="d-flex align-items-center">
              <input
                type="checkbox"
                className="form-check-input me-2"
                checked={todo.done}
                onChange={() => dispatch(toggleTodo(todo.id))}
              />
              <span className={todo.done ? 'text-muted text-decoration-line-through' : ''}> 
                {/*if the todo is done, it will be strikethrough*/}
                {todo.title}
              </span>
            </div>
            <div>
              <Button
                variant="outline-primary"
                size="sm"
                className="me-2"
                onClick={() => navigate(`/todo/${todo.id}`)}
              >
                Edit
              </Button>
              <Button
                variant="outline-danger"
                size="sm"
                onClick={() => dispatch(deleteTodo(todo.id))}
              >
                Delete
              </Button>
            </div>
          </ListGroup.Item>
        ))}
        {filteredTodos.length === 0 && (
          <ListGroup.Item className="text-center text-muted"> 
            {/*if there are no todos in the category, it will show this message*/}
            No todos in this category
          </ListGroup.Item>
        )}
      </ListGroup>
    </Container>
  );
}