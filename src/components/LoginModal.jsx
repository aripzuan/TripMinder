// LoginModal.jsx - Component for handling user authentication
import { Modal, Form, Button, Alert } from 'react-bootstrap';
import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../store/authSlice';

export default function LoginModal({ show, onHide }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      // For demo purposes, using hardcoded credentials
      // In a real app, this would be an API call
      if (username === 'admin' && password === 'password') {
        dispatch(login({ username }));
        onHide();
      } else {
        setError('Invalid username or password');
      }
    } catch (err) {
      setError(`An error occurred: ${err.message || 'Please try again.'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>Login to TripMinder</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Username</Form.Label>
            <Form.Control
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              required
              disabled={isLoading}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Password</Form.Label>
            <Form.Control
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
              disabled={isLoading}
            />
          </Form.Group>
          {error && <Alert variant="danger">{error}</Alert>}
          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={isLoading}
          >
            {isLoading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <div className="text-center mt-3">
          <small className="text-muted">
            Demo credentials: admin / password
          </small>
        </div>
      </Modal.Body>
    </Modal>
  );
} 