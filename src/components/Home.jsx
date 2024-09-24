import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

function Home() {
  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={8} className="text-center">
          <Card className="shadow-sm">
            <Card.Body>
              <h1 className="display-4 mb-4">Welcome to Ranner!</h1>
              <p className="lead mb-4">Start planning your next big adventure, one step at a time!</p>
              <Link to="/origin">
                <Button variant="primary" size="lg">Start Your Journey</Button>
              </Link>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
}

export default Home;