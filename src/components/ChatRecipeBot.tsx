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

    const userMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch(
        "https://chronos.ploutosforge.com/webhook/chatbot",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ message: input }),
        }
      );

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: data.reply || "⚠️ Tidak ada respon" },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        { sender: "bot", text: "❌ Error koneksi ke server" },
      ]);
    }

    setInput("");
    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <>
      {/* ✅ FLOATING BUTTON */}
      {!open && (
        <button
          className="btn btn-success rounded-circle shadow"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "60px",
            height: "60px",
            fontSize: "24px",
          }}
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}

      {/* ✅ CHATBOX */}
      {open && (
        <div
          className="card shadow"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            width: "320px",
            height: "420px",
          }}
        >
          {/* HEADER */}
          <div className="card-header bg-success text-white d-flex justify-content-between align-items-center">
            <span className="text-white">Chat Resep</span>
            <button
              className="cursor-pointer text-white bg-transparent border-0"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* CHAT */}
          <div
            className="card-body d-flex flex-column gap-2"
            style={{ overflowY: "auto" }}
          >
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`p-2 rounded ${
                  msg.sender === "user"
                    ? "bg-success text-white align-self-end"
                    : "bg-light align-self-start"
                }`}
                style={{ maxWidth: "80%" }}
              >
                {msg.text}
              </div>
            ))}

            {loading && (
              <small className="text-muted">Bot sedang mengetik...</small>
            )}
          </div>

          {/* INPUT */}
          <div className="card-footer d-flex p-2">
            <input
              type="text"
              className="form-control me-2"
              placeholder="Ketik menu..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
            />
            <button className="btn btn-success" onClick={sendMessage}>
              Kirim
            </button>
          </div>
        </div>
      )}
    </>
  );
}