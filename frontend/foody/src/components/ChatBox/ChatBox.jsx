import { useState, useEffect } from "react";
import axios from "axios";

const ChatBox = () => {
  const [show, setShow] = useState(false);
  const [messages, setMessages] = useState([
    { sender: "Bạn", text: "Xin chào!" },
    { sender: "Chatbot", text: "Chào bạn!" },
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [userLocation, setUserLocation] = useState({ lat: null, lon: null });

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lon: position.coords.longitude,
          });
        },
        (error) => {
          console.error("Lỗi lấy vị trí:", error);
        }
      );
    }
  }, []);

  const handleSend = async () => {
    if (!inputMessage.trim()) return;

    const newMessage = { sender: "Bạn", text: inputMessage };
    setMessages([...messages, newMessage]);
    setInputMessage("");

    try {
      const response = await axios.get("http://127.0.0.1:8005/chatbot", {
        params: {
          query: inputMessage,
          user_lat: userLocation.lat,
          user_lon: userLocation.lon,
        },
      });

      const botReply = {
        sender: "Chatbot",
        text: response.data.response || "Không có phản hồi.",
      };
      setMessages((prevMessages) => [...prevMessages, botReply]);

      if (response.data.restaurant_suggestions?.length > 0) {
        setMessages((prevMessages) => [
          ...prevMessages,
          {
            sender: "Chatbot",
            text: "Dưới đây là một số nhà hàng gợi ý:",
            restaurants: response.data.restaurant_suggestions,
          },
        ]);
      }
    } catch (error) {
      console.error("Lỗi gọi API chatbot:", error);
      setMessages((prevMessages) => [
        ...prevMessages,
        { sender: "Chatbot", text: "Lỗi kết nối chatbot." },
      ]);
    }
  };

  return (
    <div>
      <div
        className="chatbox-container"
        style={{
          position: "fixed",
          bottom: "20px",
          right: "20px",
          zIndex: 1050,
        }}
      >
        <button className="btn btn-primary" onClick={() => setShow(!show)}>
          <i className="bi bi-chat-dots"></i> Chat
        </button>
      </div>

      {show && (
        <div
          className="chatbox-window"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "350px",
            height: "500px",
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
            style={{ flex: 1, padding: "10px", overflowY: "auto" }}
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
                    backgroundColor:
                      message.sender === "Bạn" ? "#007bff" : "#e9ecef",
                    color: message.sender === "Bạn" ? "#fff" : "#000",
                    maxWidth: "70%",
                    wordWrap: "break-word",
                  }}
                >
                  {message.text}
                </span>
                {message.restaurants && (
                  <div style={{ marginTop: "10px" }}>
                    {message.restaurants.map((restaurant, i) => (
                      <div
                        key={i}
                        onClick={() =>
                          window.open(`/details/${restaurant._id}`, "_blank")
                        }
                        style={{
                          cursor: "pointer",
                          border: "1px solid #ccc",
                          borderRadius: "8px",
                          padding: "10px",
                          marginTop: "5px",
                          display: "flex",
                          alignItems: "center",
                          gap: "10px",
                          backgroundColor: "#f9f9f9",
                        }}
                      >
                        <img
                          src={restaurant.image}
                          alt={restaurant.name}
                          style={{
                            width: "50px",
                            height: "50px",
                            borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                        <div>
                          <strong>{restaurant.name}</strong>
                          <p
                            style={{
                              margin: "0",
                              fontSize: "12px",
                              color: "#555",
                            }}
                          >
                            {restaurant.address}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
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
