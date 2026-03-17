import { useEffect, useRef, useState } from "react";
export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const chatEndRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

useEffect(() => {
  chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
}, [messages]);
<div ref={chatEndRef} />

  const sendMessage = async () => {
    if (!input.trim()) return;

    // 1. simpan pesan user
    const userMessage = {
      from: "user",
      text: input
    };
    

    setMessages(prev => [...prev, userMessage]);

    try {
      // 2. kirim ke n8n
      setLoading(true);
      const response = await fetch("http://localhost:5678/webhook/chatbot", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          message: input
        })
      });
      setLoading(false);

      // 3. ambil response
      const data = await response.json();

      // 4. tampilkan balasan bot
      const botMessage = {
        from: "bot",
        text: data.reply || "Tidak ada respon"
      };

      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error("ERROR:", error);

      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Server error 😢" }
      ]);
    }

    // 5. kosongkan input
    setInput("");
  };

  return (
    <div style={styles.container} className="z-3">
        <button onClick={() => setOpen(!open)}>
            💬
        </button>
        {open && 
      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              textAlign: msg.from === "user" ? "right" : "left"
            }}
          >
            <span style={styles.bubble(msg.from)}>
                {loading && <p>Bot sedang mengetik...</p>}
              {msg.text}
            </span>
          </div>
        ))}
      </div>
}

      <div style={styles.inputBox}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ketik pesan..."
          style={styles.input}
          onKeyDown={(e) => {
                if (e.key === "Enter") {
                    sendMessage();
                }
                }}
            />

        <button onClick={sendMessage} className="btn btn-success">
          Kirim
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    width: "300px",
    background: "#fff",
    border: "1px solid #ccc",
    borderRadius: "10px",
    overflow: "hidden",
    boxShadow: "0 0 10px rgba(0,0,0,0.2)"
  } as const,
  chatBox: {
    height: "250px",
    overflowY: "auto",
    padding: "10px"
  } as const,
  inputBox: {
    display: "flex",
    borderTop: "1px solid #ccc"
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none"
  },
  button: {
    padding: "10px",
    background: "#007bff",
    color: "#fff",
    border: "none"
  },
  bubble: (from) => ({
    display: "inline-block",
    padding: "8px 12px",
    margin: "5px",
    borderRadius: "10px",
    background: from === "user" ? "#00c3ff" : "#eee",
    color: from === "user" ? "#fff" : "#000"
  })
};