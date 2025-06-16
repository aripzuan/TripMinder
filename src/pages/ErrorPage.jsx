import { Container, Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import { useEffect } from "react";

export default function ErrorPage() {
  // Set the page title when component mounts
  useEffect(() => {
    document.title = "404 - Page Not Found | TripMate";
  }, []);

  return (
    <Container className="min-vh-100 d-flex flex-column justify-content-center align-items-center text-center py-5">
      <div>
        <h1 className="display-1 fw-bold text-primary mb-4">404</h1>
        <div className="mb-4">
          <i className="bi bi-emoji-dizzy" style={{ fontSize: "5rem" }}></i>
        </div>
        <h2 className="h3 mb-3">Oops! Page Not Found</h2>
        <p className="text-muted mb-4">
          The page you're looking for seems to have taken a vacation without leaving a forwarding address.
        </p>
        <Link to="/">
          <Button variant="primary" size="lg" className="px-4">
            <i className="bi bi-house-door me-2"></i>
            Back to Home
          </Button>
        </Link>
      </div>
    </Container>
  );
}