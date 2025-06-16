// CategoryCard.jsx - Component for displaying a category and its todos
import { Card } from "react-bootstrap";
import TodoCard from "./TodoCard";

export default function CategoryCard({ category, todos, onDeleteTodo, onToggleTodo }) {
  return (
    <div className="col-md-6 col-lg-3 mb-4">
      <Card>
        <Card.Header className="d-flex align-items-center">
          {category.icon} {category.name}
          <span className="ms-2 badge bg-secondary">
            {todos.length} {/* displays the number of todos in the category*/}
          </span>
        </Card.Header>
        <Card.Body className="p-2">
          {todos.length === 0 ? (
            <div className="text-center text-muted">No todos in this category</div> /* if there are no todos in the category, it will show this message*/
          ) : (
            todos.map((todo) => (
              <TodoCard
                key={todo.id}
                todo={todo}
                onDelete={onDeleteTodo}
                onToggle={onToggleTodo}
              />
            )) // map over the todos and create a card for each todo
          )}
        </Card.Body>
      </Card>
    </div>
  );
} 