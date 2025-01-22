import React, { useState } from "react";

const ChatBox = () => {
  const [show, setShow] = useState(false);
  const [newMessages, setNewMessages] = useState(1); // Số lượng tin nhắn mới
  const [messages, setMessages] = useState([
    { sender: "Bạn", text: "Xin chào!" },
    { sender: "Người khác", text: "Chào bạn!" },
  ]);
  const [inputMessage, setInputMessage] = useState("");

  const handleShow = () => {
    setShow(true);
    setNewMessages(0); // Reset số lượng tin nhắn mới khi mở
  };

  const handleSend = () => {
    if (inputMessage.trim()) {
      setMessages([...messages, { sender: "Bạn", text: inputMessage }]);
      setInputMessage("");
    }
  };

  return (
    <div>
      {/* Nút ChatBox */}
      <div className="chatbox-container" style={{ position: "fixed", bottom: "20px", right: "20px", zIndex: 1050 }}>
        <button id="chatbox-btn" className="btn btn-primary position-relative" onClick={handleShow}>
          <i className="bi bi-chat-dots"></i> Tin mới
          {newMessages > 0 && (
            <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
              {newMessages}
            </span>
          )}
        </button>
      </div>

      {/* ChatBox */}
      {show && (
        <div
          className="chatbox-window"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "300px",
            height: "400px",
            backgroundColor: "#fff",
            border: "1px solid #ccc",
            borderRadius: "8px",
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
            zIndex: 1051,
          }}
        >
          <div
            className="chatbox-header"
            style={{
              padding: "10px",
              borderBottom: "1px solid #ccc",
              backgroundColor: "#f5f5f5",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <h5 className="mb-0">Hộp Chat</h5>
            <button
              type="button"
              className="btn-close"
              onClick={() => setShow(false)}
              aria-label="Close"
            ></button>
          </div>
          <div
            className="chatbox-body"
            style={{
              flex: 1,
              padding: "10px",
              overflowY: "auto",
            }}
          >
            {messages.map((message, index) => (
              <div
                key={index}
                style={{
                  marginBottom: "10px",
                  textAlign: message.sender === "Bạn" ? "right" : "left",
                }}
              >
                <span
                  style={{
                    display: "inline-block",
                    padding: "8px 12px",
                    borderRadius: "8px",
                    backgroundColor: message.sender === "Bạn" ? "#007bff" : "#e9ecef",
                    color: message.sender === "Bạn" ? "#fff" : "#000",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {message.text}
                </span>
              </div>
            ))}
          </div>
          <div
            className="chatbox-footer"
            style={{
              padding: "10px",
              borderTop: "1px solid #ccc",
              display: "flex",
              gap: "5px",
            }}
          >
            <input
              type="text"
              className="form-control"
              placeholder="Nhập tin nhắn..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              style={{ flex: 1 }}
            />
            <button className="btn btn-primary" onClick={handleSend}>
              Gửi
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChatBox;
