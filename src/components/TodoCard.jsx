// TodoCard.jsx - Component for displaying a single todo item as a card with actions

import { Button, Card } from "react-bootstrap";
import { Link } from "react-router-dom";

export default function TodoCard({ todo, onDelete, onToggle }) {
  // Determine card border and completion status
  const completed = todo.done;
  const border = completed ? "success" : "primary";

  return (
    <Card border={border} className="todo-item mb-2">
      <Card.Body className="p-3">
        {/* Todo title with checkbox to toggle completion */}
        <div className="d-flex align-items-center mb-2">
          <input
            type="checkbox"
            className="form-check-input me-3"
            checked={todo.done}
            onChange={() => onToggle(todo.id)}
            style={{ width: '1.2rem', height: '1.2rem' }}
          />
          <Card.Title className={`mb-0 ${todo.done ? 'text-muted text-decoration-line-through' : ''}`}>
            {todo.title}
          </Card.Title>
        </div>
        {/* Action buttons: Edit and Delete */}
        <div className="d-flex gap-2">
          <Link to={`/todo/${todo.id}`} className="btn btn-outline-primary btn-sm">
            <i className="bi bi-pencil me-1"></i> Edit
          </Link>
          <Button 
            variant="outline-danger" 
            size="sm" 
            onClick={() => onDelete(todo.id)}
            className="d-flex align-items-center"
          >
            <i className="bi bi-trash me-1"></i> Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
}