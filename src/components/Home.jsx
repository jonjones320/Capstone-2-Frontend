import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Button, Card } from 'react-bootstrap';

function Home() {
  return (
    <div style={{ position: 'relative', overflow: 'hidden', minHeight: '100vh' }}>
      <video
        autoPlay
        loop
        muted
        style={{
          position: 'absolute',
          width: '100%',
          left: '50%',
          top: '50%',
          height: '100%',
          objectFit: 'cover',
          transform: 'translate(-50%, -50%)',
          zIndex: '-1'
        }}
      >
        <source src="../../public/Video/backyard-takeoff.mp4" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      
      <Container className="mt-5">
        <Row className="justify-content-center">
          <Col md={8} className="text-center">
            <Card className="shadow-sm bg-white bg-opacity-75">
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
    </div>
  );
}

export default Home;