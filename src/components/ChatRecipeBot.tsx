import { useState } from "react";

export default function ChatRecipeBot() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Halo! Mau cari resep apa? ☕" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    // simpan pesan user
    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);

    setLoading(true);

    try {
      const res = await fetch(
        "https://chronos.ploutosforge.com/webhook/chatbot",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      const botMessage = {
        sender: "bot",
        text: data.reply || "⚠️ Tidak ada respon",
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error koneksi ke server" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  return (
    <div style={styles.container} className="z-3 pt-2">
        <button onClick={() => setOpen(!open)} className="btn btn-small">
            💬
        </button>
        {open && 
      <div style={styles.chatBox}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={{
              ...styles.message,
              alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
              background: msg.sender === "user" ? "#4caf50" : "#eee",
              color: msg.sender === "user" ? "#fff" : "#000",
              whiteSpace: "pre-line",
                fontWeight: msg.sender === "bot" ? "500" : "normal"
            }}
          >
            {msg.text}
          </div>
        ))}
        {loading && <div style={styles.loading}>Bot sedang mengetik...</div>}
      </div>
        }

      <div style={styles.inputContainer}>
        <input
          type="text"
          value={input}
          placeholder="Ketik menu (contoh: latte)"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          style={styles.input}
        />
        <button onClick={sendMessage} style={styles.button}>
          Kirim
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    width: "300px",
    position: "fixed",
    bottom: "20px",
    right: "20px",
    border: "1px solid #ccc",
    borderRadius: "10px",
    background: "#fff",
    boxShadow: "0 4px 10px rgba(0,0,0,0.2)",
    display: "flex",
    flexDirection: "column",
  } as const,
  chatBox: {
    height: "300px",
    overflowY: "auto",
    padding: "10px",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  } as const,
  message: {
    padding: "8px 12px",
    borderRadius: "8px",
    maxWidth: "80%",
  } as const,
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
  }as const,
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
    outline: "none",
  }as const,
  button: {
    padding: "10px",
    border: "none",
    background: "#4caf50",
    color: "#fff",
    cursor: "pointer",
  },
  loading: {
    fontSize: "12px",
    color: "#888",
  }as const,
};