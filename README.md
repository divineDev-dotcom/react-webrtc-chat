# Real-Time Communication App

This is a real-time communication application that allows users to connect with each other using PeerJS. Users can make voice calls, send messages, and share files seamlessly. The application is built with React and Bootstrap for a responsive user interface.

## Features

- **Peer-to-Peer Voice Calling**: Users can connect with each other via voice calls.
- **Message Sending**: Users can send and receive text messages during the call.
- **File Sharing**: Users can share files in real-time.
- **Ringtone Notification**: A ringtone plays when there is an incoming call.
- **User-Friendly Interface**: Built with React Bootstrap for a clean and responsive design.

## Technologies Used

- **React**: A JavaScript library for building user interfaces.
- **PeerJS**: A simple wrapper around WebRTC to create peer-to-peer connections.
- **Bootstrap**: A front-end framework for developing responsive web applications.
- **HTML5 Audio**: For managing audio playback (ringtone, message tones).

## Installation

To run the project locally, follow these steps:

1. **Clone the repository**:
   ```bash
   git clone https://github.com/divineDev-dotcom/react-webrtc-chat.git
   cd react-webrtc-chat
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Run the application**:
   ```bash
   npm start
   ```

4. Open your browser and navigate to `http://localhost:3000`.

## Usage

1. **Enter your Peer ID**: Upon starting the application, you will see an input field to enter your Peer ID.
2. **Connect with others**: Enter the remote Peer ID of the user you want to call and click on the "Connect and Call" button.
3. **Incoming Calls**: If you receive an incoming call, a modal will appear. You can choose to answer or decline the call.
4. **Sending Messages**: You can type messages in the input field and click "Send" to communicate during a call.
5. **File Sharing**: Choose a file from your device and click "Send File" to share it with the connected user.

## Contributing

Contributions are welcome! If you have suggestions for improvements or want to report a bug, please open an issue or submit a pull request.

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add new feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a pull request.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.