import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

const FileShare = ({ connection }) => {
  const [message, setMessage] = useState('');

  const sendMessage = () => {
    if (connection) {
      connection.send(message); // Send the message to the remote peer
      setMessage(''); // Clear the input field
    }
  };

  return (
    <div className="file-share">
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message to send"
      />
      <Button onClick={sendMessage} disabled={!connection}>
        Send Data
      </Button>
    </div>
  );
};

export default FileShare;
