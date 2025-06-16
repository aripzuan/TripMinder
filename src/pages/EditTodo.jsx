// EditTodo.jsx - Page for editing an existing todo's title and category

import { Container, Form, Button, Card } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";
import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { updateTodo } from "../store/todoSlice";

export default function EditTodo() {
  // Redux hooks for accessing and updating global state
  const dispatch = useDispatch(); // Redux dispatch function.
  const todos = useSelector((state) => state.todo.todos); //access all todos in your app
  const categories = useSelector((state) => state.todo.categories); //access all categories in your app
  const navigate = useNavigate(); // navigation function from React Router.
  const { id } = useParams(); // get the id of the todo to edit
  
  // Find the todo to edit
  const todo = todos.find(t => t.id === parseInt(id));
  // Local state for editing fields
  const [title, setTitle] = useState(todo.title);
  const [category, setCategory] = useState(todo.category);

  // Handle saving changes to the todo (dispatches to Redux)
  const handleSubmit = (e) => {
    e.preventDefault();
    if (title.trim()) {
      dispatch(updateTodo({ id: parseInt(id), updatedTodo: { title, category } }));
      navigate('/');
    }
  };

  // If the todo is not found, show a not found message
  if (!todo) {
    return (
      <Container className="py-4">
        <Card>
          <Card.Body>
            <h2>Todo not found</h2>
            <Button variant="primary" onClick={() => navigate('/')}>Back to Home</Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4">
      <Card>
        <Card.Body>
          <h2>Edit Todo</h2>
          {/* Form to edit the todo */}
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter todo title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                {categories.map((cat) => (
                  <option key={cat.name} value={cat.name}>{cat.icon} {cat.name}</option>
                ))} {/* map over the categories and create an option for each category*/}
              </Form.Select>
            </Form.Group>

            <Button variant="primary" type="submit" className="me-2">Save Changes</Button>
            <Button variant="secondary" onClick={() => navigate('/')}>Cancel</Button>
          </Form>
        </Card.Body>
      </Card>
    </Container>
  );
}

