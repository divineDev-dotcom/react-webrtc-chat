import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import logo from '../logo.jpeg'; // Adjust the path if needed

const Header = () => {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="#home">
          <img src={logo} alt="Logo" className="logo" />
          React Voice Chat & Data Sharing
        </Navbar.Brand>
      </Container>
    </Navbar>
  );
};

export default Header;
