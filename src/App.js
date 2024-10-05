import React, { useState } from 'react';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import Footer from './components/Footer';
import Call from './components/Call';
import './App.css';

const App = () => {
  const [userName, setUserName] = useState('');
  const [isCalling, setIsCalling] = useState(false); // Track if a call is active

  return (
    <Container>
      <Header />
      <div className="mt-4">
        {!isCalling && ( // Only show input when not calling
          <input
            type="text"
            placeholder="Enter Your Name"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
          />
        )}
      </div>
      {userName && <h5>Welcome, {userName}!</h5>}
      <Call userName={userName} setIsCalling={setIsCalling} /> {/* Pass down setIsCalling */}
      <Footer />
    </Container>
  );
};

export default App;
