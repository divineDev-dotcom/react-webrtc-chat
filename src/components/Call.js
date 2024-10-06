import React, { useState, useRef, useEffect } from 'react';
import Peer from 'peerjs';
import { Button, Modal, Form } from 'react-bootstrap';

const Call = ({ userName, setIsCalling }) => {
  const [remotePeerId, setRemotePeerId] = useState('');
  const [incomingCall, setIncomingCall] = useState(null);
  const [call, setCall] = useState(null);
  const [isCalling, setIsCallingLocal] = useState(false);
  const [ringtone, setRingtone] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [file, setFile] = useState(null);
  const [peerId, setPeerId] = useState('');
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoCall, setIsVideoCall] = useState(false);
  const remoteAudioRef = useRef(null);
  const remoteVideoRef = useRef(null); // Reference for remote video
  const peerRef = useRef(null);
  const connRef = useRef(null); // Store the connection for ongoing messaging

  useEffect(() => {
    const peer = new Peer();
    peerRef.current = peer;

    peer.on('open', (id) => {
      console.log('Your Peer ID:', id);
      setPeerId(id); // Set the user's Peer ID
    });

    peer.on('call', (incomingCall) => {
      setIncomingCall(incomingCall);
      playRingtone();
    });

    peer.on('connection', (conn) => {
      connRef.current = conn; // Store the connection
      conn.on('data', (data) => {
        if (data.type === 'message') {
          setMessages((prevMessages) => [...prevMessages, data]);
          playReceiveTone();  // Play receive tone on incoming message
        } else if (data.type === 'file') {
          handleReceivedFile(data.file);
        }
      });
    });

    return () => peer.destroy(); // Cleanup peer on unmount
  }, []);

  const handleReceivedFile = (fileData) => {
    const blob = new Blob([fileData], { type: fileData.type });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileData.name; // Use the name sent with the file
    link.click();
    URL.revokeObjectURL(url); // Clean up the URL object after use
  };

  const playRingtone = () => {
    const audio = new Audio('/audios/ring.wav');
    audio.loop = false;
    audio.play();
    setRingtone(audio);
  };

  const stopRingtone = () => {
    if (ringtone) {
      ringtone.pause();
      setRingtone(null);
    }
  };

  const playSendTone = () => {
    const audio = new Audio('/audios/send-tone.wav');
    audio.play();
  };

  const playReceiveTone = () => {
    const audio = new Audio('/audios/receive-tone.wav');
    audio.play();
  };

  const startCall = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: !isMuted,
      video: isVideoCall // Toggle video based on state
    });

    const outgoingCall = peerRef.current.call(remotePeerId, stream);
    setCall(outgoingCall);
    setIsCalling(true); // Set the call state to true
    setIsCallingLocal(true); // Update local call state
    outgoingCall.on('stream', (remoteStream) => {
      if (isVideoCall) {
        remoteVideoRef.current.srcObject = remoteStream; // Play remote video stream
      } else {
        remoteAudioRef.current.srcObject = remoteStream; // Play remote audio stream
      }
    });
    playRingtone();
    // Establish a persistent connection for messaging
    const conn = peerRef.current.connect(remotePeerId);
    conn.on('open', () => {
      connRef.current = conn; // Save the connection for sending messages
    });
  };

  const answerCall = async () => {
    stopRingtone();
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: !isMuted,
      video: isVideoCall // Toggle video based on state
    });
    
    incomingCall.answer(stream);
    incomingCall.on('stream', (remoteStream) => {
      if (isVideoCall) {
        remoteVideoRef.current.srcObject = remoteStream; // Play remote video stream
      } else {
        remoteAudioRef.current.srcObject = remoteStream; // Play remote audio stream
      }
    });
    setCall(incomingCall);
    setIncomingCall(null);
    setIsCalling(true); // Set the call state to true
    setIsCallingLocal(true); // Update local call state
    // Establish a persistent connection for messaging
    const conn = peerRef.current.connect(incomingCall.peer);
    conn.on('open', () => {
      connRef.current = conn; // Save the connection for sending messages
    });
  };

  const declineCall = () => {
    stopRingtone();
    setIncomingCall(null);
    setIsCalling(false); // Set the call state to false
    setIsCallingLocal(false); // Update local call state
  };

  const sendMessage = () => {
    if (newMessage.trim() && connRef.current) {
      connRef.current.send({ type: 'message', sender: userName, message: newMessage });
      setMessages((prevMessages) => [...prevMessages, { type: 'message', sender: userName, message: newMessage }]);
      playSendTone();  // Play send tone on outgoing message
      setNewMessage(''); // Clear the input after sending
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const sendFile = () => {
    if (file && connRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const fileData = {
          name: file.name,
          type: file.type,
          file: new Uint8Array(e.target.result) // Read the file as an ArrayBuffer
        };
        connRef.current.send({ type: 'file', file: fileData }); // Send the file
      };
      reader.readAsArrayBuffer(file); // Read the file as ArrayBuffer
      setFile(null); // Clear the file after sending
    }
  };

  const toggleMute = () => {
    setIsMuted(prev => !prev);
if (remoteAudioRef.current) {
remoteAudioRef.current.muted = !isMuted;
}
  };

  const toggleVideoCall = () => {
    setIsVideoCall(prev => !prev);
    if (call) {
      const stream = navigator.mediaDevices.getUserMedia({
        audio: !isMuted,
        video: !isVideoCall // Toggle video based on the new state
      });
      call.peerConnection.getSenders().forEach(sender => {
        if (sender.track.kind === 'audio') {
          sender.track.enabled = !isMuted;
        } else if (sender.track.kind === 'video') {
          sender.track.enabled = !isVideoCall;
        }
      });
    }
  };

  const shareScreen = async () => {
    const screenStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true // Request audio if you want to share the internal sound
    });

    if (call) {
      call.peerConnection.getSenders().forEach(sender => {
        if (sender.track.kind === 'video') {
          sender.replaceTrack(screenStream.getTracks()[0]);
        }
      });
    }
};


 
  return (
    <>
      <div>
        <h4>Your Peer ID: {peerId}</h4>
        <input
          type="text"
          placeholder="Enter Remote Peer ID"
          value={remotePeerId}
          onChange={(e) => setRemotePeerId(e.target.value)}
        />
        <br />
        <Button
          variant="primary"
          onClick={startCall}
          disabled={!remotePeerId || isCalling}
        >
          Connect and Call
        </Button>
      </div>
      <Modal show={!!incomingCall} onHide={declineCall}>
        <Modal.Header closeButton>
          <Modal.Title>Incoming Call</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>Incoming Call from {incomingCall?.peer}</h4>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" onClick={answerCall}>
            Answer
          </Button>
          <Button variant="danger" onClick={declineCall}>
            Decline
          </Button>
        </Modal.Footer>
      </Modal>
      <audio ref={remoteAudioRef} autoPlay />
      <video ref={remoteVideoRef} autoPlay style={{ width: '100%', display: isVideoCall ? 'block' : 'none' }} />
      <div>
        <h5>Messages</h5>
        <div style={{ border: '1px solid black', height: '200px', overflowY: 'scroll' }}>
          {messages.map((msg, index) => (
            <div key={index}><strong>{msg.sender}:</strong> {msg.message}</div>
          ))}
        </div>
        <Form.Control
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <Button onClick={sendMessage}>Send</Button>
        <input type="file" onChange={handleFileChange} />
        <Button onClick={sendFile}>Send File</Button>
        <Button onClick={toggleMute}>{isMuted ? 'Unmute' : 'Mute'}</Button>
        <Button onClick={toggleVideoCall}>{isVideoCall ? 'Switch to Audio Call' : 'Switch to Video Call'}</Button>
        <Button onClick={shareScreen}>Share Screen</Button>
      </div>
    </>
  );
};

export default Call;
