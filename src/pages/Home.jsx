// Home.jsx - Main page for the Travel Todo App
// Shows the navbar, trip countdown, category management, and all todos by category

import { Container, Card, Button, Form, InputGroup, Modal, Navbar, Nav } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import TodoCard from "../components/TodoCard";
import {
  toggleTodo,
  deleteTodo,
  addCategory,
  updateCategory,
  deleteCategory,
} from "../store/todoSlice";
import { setTargetDate, clearTargetDate } from "../store/timerSlice";
import CategoryCard from "../components/CategoryCard";
import LoginModal from "../components/LoginModal";
import { logout } from "../store/authSlice";

export default function Home() {
  // Redux hooks for accessing and updating global state
  const dispatch = useDispatch();
  const todos = useSelector((state) => state.todo.todos); // get the todos from the Redux store
  const categories = useSelector((state) => state.todo.categories); // get the categories from the Redux store
  const targetDate = useSelector((state) => state.timer.targetDate); // get the target date from the Redux store
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const defaultCategories = [
    { name: 'Packing', icon: '🧳' },
    { name: 'Trip Planner', icon: '📅' },
    { name: 'Documents', icon: '📂' },
    { name: 'Bucket List', icon: '🌍' },
  ];

  // Local state for UI controls and modal
  const [selectedCategories, setSelectedCategories] = useState(categories.map(c => c.name)); // get the selected categories from the Redux store
  const [newCategory, setNewCategory] = useState("");
  const [editingCategory, setEditingCategory] = useState(null); 
  const [editingValue, setEditingValue] = useState(""); 
  const [showModal, setShowModal] = useState(false);
  const [tripDate, setTripDate] = useState("");
  const [daysLeft, setDaysLeft] = useState(null); 
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [editError, setEditError] = useState(""); // error message for editing category

  // Effect: Calculate days left until trip, update every minute
  useEffect(() => {
    if (!targetDate) {
      setDaysLeft(null);
      return;
    }
    const updateCountdown = () => {
      const now = new Date();
      const target = new Date(targetDate);
      const diff = target - now;
      const days = Math.ceil(diff / (1000 * 60 * 60 * 24)); // calculates the number of days between two dates
      //math.ceil ensures that if there are any remaining hours/minutes in the day, it counts as a full day left until your trip.
      setDaysLeft(days);
    };
    updateCountdown();
    const interval = setInterval(updateCountdown, 1000 * 60); // update every minute
    return () => clearInterval(interval);
  }, [targetDate]);

  // Function to check authentication before performing actions
  const checkAuth = () => {
    if (!isAuthenticated) {
      setShowLoginModal(true);
      return false;
    }
    return true;
  };

  // Handle setting the trip date (dispatches to Redux)
  const handleSetTripDate = (e) => {
    e.preventDefault();
    if (!checkAuth()) return;
    if (tripDate) {
      dispatch(setTargetDate(tripDate));
    }
  };

  // Handle clearing the trip date
  const handleClearTripDate = () => {
    if (!checkAuth()) return;
    dispatch(clearTargetDate()); //clearTargetDate is an action that clears the target date from timerSlice.js
    setTripDate("");
  };

  // Handle category filter selection (multi-select)
  const handleCategoryChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (let i = 0; i < options.length; i++) {
      if (options[i].selected) {
        selected.push(options[i].value);
      }
    }
    setSelectedCategories(selected.length ? selected : categories.map(c => c.name));
  }; // handle the category filter selection (multi-select)

  // Add a new category (dispatches to Redux)
  const handleAddCategory = (e) => {
    e.preventDefault();
    if (!checkAuth()) return;
    const name = newCategory.trim();
    if (!name || categories.some(c => c.name.toLowerCase() === name.toLowerCase())) return;
    dispatch(addCategory({ name, icon: '📁' }));
    setSelectedCategories([...selectedCategories, name]);
    setNewCategory("");
  };

  // Start editing a category
  const handleEditCategory = (name) => {
    setEditingCategory(name);
    setEditingValue(name);
    setEditError(""); // clear error when starting to edit
  };

  // Update a category name (dispatches to Redux)
  const handleUpdateCategory = (oldName) => {
    if (!checkAuth()) return;
    const newName = editingValue.trim();
    if (!newName) {
      setEditError("Category name cannot be empty.");
      return;
    }
    if (categories.some(c => c.name.toLowerCase() === newName.toLowerCase())) {
      setEditError("Category name already exists.");
      return;
    }
    dispatch(updateCategory({ oldName, newName }));
    setSelectedCategories(selectedCategories.map(cat => cat === oldName ? newName : cat));
    setEditingCategory(null);
    setEditingValue("");
    setEditError(""); // clear error on success
  };

  // Delete a category (dispatches to Redux)
  const handleDeleteCategory = (name) => {
    if (!checkAuth()) return;
    dispatch(deleteCategory(name));
    setSelectedCategories(selectedCategories.filter(cat => cat !== name));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <>
      <Navbar bg="light" expand="md" className="mb-4 shadow-sm">
        <Container fluid>
          <Navbar.Brand className="fw-bold"> TripMinder <i className="bi bi-airplane"></i></Navbar.Brand>
          <Navbar.Toggle aria-controls="main-navbar" />
          <Navbar.Collapse id="main-navbar">
            {/* Trip Date/Countdown (center) */}
            <Nav className="mx-auto my-2 my-md-0">
              <div className="d-flex flex-column flex-md-row align-items-center gap-2">
                {targetDate && daysLeft !== null ? (
                  daysLeft > 0 ? (
                    <span className="fw-semibold text-primary">⏰ {daysLeft} day{daysLeft !== 1 ? 's' : ''} until your trip!</span>
                  ) : (
                    <span className="fw-semibold text-success">🎉 Your trip is today or has passed!</span>
                  )
                ) : (
                  <Form onSubmit={handleSetTripDate} className="d-flex flex-column flex-md-row align-items-center gap-2">
                    <Form.Label className="mb-0">Trip date:</Form.Label>
                    <Form.Control
                      type="date"
                      value={tripDate}
                      onChange={e => setTripDate(e.target.value)}
                      style={{ maxWidth: 150 }}
                      required
                    />
                    <Button type="submit" variant="primary" size="sm">Set</Button>
                  </Form>
                )}
                {targetDate && (
                  <Button variant="link" size="sm" onClick={handleClearTripDate} className="ms-2">Clear</Button>
                )}
              </div>
            </Nav>
            {/* Manage Categories & Add Todo (right) */}
            <Nav className="ms-auto d-flex flex-column flex-md-row align-items-center gap-2 mt-2 mt-md-0">
              <Button variant="outline-secondary" onClick={() => checkAuth() && setShowModal(true)}>
                <i className="bi bi-gear"></i> Manage Categories
              </Button>
              <Link to="/add" className="btn btn-primary" onClick={(e) => !checkAuth() && e.preventDefault()}>
                Add New Todo
              </Link>
              {isAuthenticated ? (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted">Welcome, {user?.username}</span>
                  <Button variant="outline-danger" size="sm" onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right"></i> Logout
                  </Button>
                </div>
              ) : (
                <Button variant="outline-primary" size="sm" onClick={() => setShowLoginModal(true)}>
                  <i className="bi bi-box-arrow-in-right"></i> Login
                </Button>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Login Modal is hidden by default */}
      <LoginModal show={showLoginModal} onHide={() => setShowLoginModal(false)} />

      {/* Modal Managing Categories (add, edit, delete, filter) is hidden by default */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Manage Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {/* Add new category */}
          <Form.Group className="mb-3">
            <InputGroup className="mb-2">
              <Form.Control
                type="text"
                placeholder="Add new category"
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddCategory(e); }}
              />
              <Button variant="outline-success" onClick={handleAddCategory} title="Add Category">
                <i className="bi bi-plus-lg"></i>
              </Button>
            </InputGroup>
            {/* List of categories with edit/delete */}
            <div className="d-flex flex-wrap gap-2 mb-3">
              {categories.map(cat => (
                <span key={cat.name} className="badge bg-light border text-dark d-flex align-items-center">
                  <span className="me-1">{cat.icon}</span>
                  {editingCategory === cat.name ? (
                    <>
                      <Form.Control
                        size="sm"
                        value={editingValue}
                        onChange={e => setEditingValue(e.target.value)}
                        style={{ width: 100, display: 'inline-block' }}
                        className="me-1"
                        autoFocus
                      />
                      <Button
                        variant="outline-success"
                        size="sm"
                        className="me-1"
                        onClick={() => handleUpdateCategory(cat.name)}
                        title="Save"
                      >
                        <i className="bi bi-check-lg"></i>
                      </Button>
                      {editError && (
                        <div className="text-danger small ms-2">{editError}</div>
                      )}
                    </>
                  ) : (
                    <>
                      <span className="me-1">{cat.name}</span>
                      <Button
                        variant="outline-primary"
                        size="sm"
                        className="me-1"
                        onClick={() => handleEditCategory(cat.name)}
                        title="Edit"
                      >
                        <i className="bi bi-pencil"></i>
                      </Button>
                      <Button
                        variant="outline-danger"
                        size="sm"
                        disabled={todos.some(t => t.category === cat.name) || defaultCategories.some(def => def.name === cat.name)}
                        onClick={() => handleDeleteCategory(cat.name)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </Button>
                    </>
                  )}
                </span>
              ))}
            </div>
          </Form.Group>
          {/* Category filter dropdown */}
          <Form.Group className="mb-2" style={{ maxWidth: 300 }}>
            <Form.Label>Show Categories</Form.Label>
            <Form.Select multiple value={selectedCategories} onChange={handleCategoryChange}>
              {categories.map((cat) => (
                <option key={cat.name} value={cat.name}>{cat.name}</option>
              ))}
            </Form.Select>
            <Form.Text muted>
              Hold Ctrl (Windows) or Cmd (Mac) to select multiple
            </Form.Text>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Close
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Main content: Category cards with todos */}
      <Container>
        <div className="row">
          {categories.filter(category => selectedCategories.includes(category.name)).map((category) => {
            const categoryTodos = todos.filter(todo => todo.category === category.name);
            return (
              <CategoryCard
                key={category.name}
                category={category}
                todos={categoryTodos}
                onDeleteTodo={(id) => dispatch(deleteTodo(id))}
                onToggleTodo={(id) => dispatch(toggleTodo(id))}
              />
            );
          })}
        </div>
      </Container>
    </>
  );
}