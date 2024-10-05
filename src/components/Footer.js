import React from 'react';
import { Container } from 'react-bootstrap';

const Footer = () => {
  return (
    <Container className="text-center mt-4">
      <p>&copy; {new Date().getFullYear()} Imtiyajodin babar Application</p>
    </Container>
  );
};

export default Footer;
