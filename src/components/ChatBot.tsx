import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const chatEndRef = useRef(null);
  const inputRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { from: "user", text: input };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const fetchWithRetry = async (url, options, retries = 3) => {
  try {
    const res = await fetch(url, options);
    return res;
  } catch (err) {
    if (retries > 0) {
      await new Promise(r => setTimeout(r, 1000));
      return fetchWithRetry(url, options, retries - 1);
    }
    throw err;
  }
};
    try {
      const res = await fetchWithRetry("http://localhost:5678/webhook/recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ keyword: input })
      });

      const text = await res.text();
      let data;

      try {
        data = JSON.parse(text);
      } catch {
        data = { answer: "Server tidak mengirim JSON 😢" };
      }

      setMessages(prev => [
        ...prev,
        { from: "bot", text: data.answer || "Tidak ada respon" }
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        { from: "bot", text: "Server error 😢" }
      ]);
    }

    setLoading(false);
  };

  return (
    <>
      {/* BUTTON SAAT CLOSE */}
      {!open && (
        <button
          className="btn btn-success position-fixed bottom-0 end-0 m-3 rounded-circle"
          style={{ width: "60px", height: "60px", fontSize: "20px" }}
          onClick={() => setOpen(true)}
        >
          💬
        </button>
      )}

      {/* CHAT WINDOW */}
      {open && (
        <div
          className="position-fixed bottom-0 z-3 end-0 bg-white shadow d-flex flex-column"
          style={{
            width: window.innerWidth < 768 ? "100%" : "50%",
            height: "80%"
          }}
        >
          {/* HEADER */}
          <div className="d-flex justify-content-between align-items-center p-2 border-bottom bg-success text-white">
            <strong>AI Barista</strong>
            <button
              className="btn btn-sm btn-light"
              onClick={() => setOpen(false)}
            >
              ✖
            </button>
          </div>

          {/* CHAT */}
          <div className="flex-grow-1 overflow-auto p-3 bg-light">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`d-flex mb-2 ${
                  msg.from === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`p-2 rounded ${
                    msg.from === "user"
                      ? "bg-success text-white"
                      : "bg-white border"
                  }`}
                  style={{ maxWidth: "75%", position: "relative" }}
                >
                  {msg.from === "bot" ? (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: msg.text.replace(/\n/g, "<br/>")
                      }}
                    />
                  ) : (
                    msg.text
                  )}

                  {/* tombol detail */}
                  {msg.from === "bot" && (
                    <button
                      className="btn btn-sm btn-secondary position-absolute top-0 end-0 m-1"
                      onClick={() => setSelectedMessage(msg.text)}
                    >
                      ?
                    </button>
                  )}
                </div>
              </div>
            ))}

            {loading && (
              <div className="text-muted">Bot sedang mengetik...</div>
            )}

            <div ref={chatEndRef} />
          </div>

          {/* INPUT */}
          <div className="d-flex border-top">
            <input
              ref={inputRef}
              className="form-control border-0"
              placeholder="Ketik pesan..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
            />
            <button className="btn btn-success" onClick={sendMessage}>
              Kirim
            </button>
          </div>
        </div>
      )}

      {/* MODAL DETAIL */}
      {selectedMessage && (
        <div className="modal fade show d-block" >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Detail Resep</h5>
                <button
                  className="btn-close"
                  onClick={() => setSelectedMessage(null)}
                ></button>
              </div>

              <div className="modal-body">
                <ReactMarkdown>{selectedMessage}</ReactMarkdown>
              </div>
            </div>
          </div>

          {/* backdrop */}
          <div
            className="modal-backdrop fade show"
            onClick={() => setSelectedMessage(null)}
          ></div>
        </div>
      )}
    </>
  );
}