// Footer.jsx - Simple footer component
import { Container } from 'react-bootstrap';

export default function Footer() {
  return (
    <footer className="bg-light py-3 mt-auto">
      <Container className="text-center">
        <p className="mb-0 text-muted">
          Developed by <span className="fw-bold">Ariff Ridzuan</span>
        </p>
      </Container>
    </footer>
  );
} 