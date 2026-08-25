import React, { useState } from "react";

function App() {
  const [url, setUrl] = useState("");
  const [media, setMedia] = useState([]);

  const extractMedia = async () => {
    try {
      const res = await fetch("/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ url })
      });

      const data = await res.json();
      setMedia(data.media);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>Media Extractor</h2>

      <input
        type="text"
        placeholder="Enter website URL"
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        style={{ width: "60%", padding: "10px" }}
      />

      <br /><br />

      <button onClick={extractMedia}>Extract</button>

      <div style={{ marginTop: "20px" }}>
        {media.map((item, i) => (
          <div key={i}>
            {item.type === "image" && (
              <img src={item.src} alt="" width="300" />
            )}
            {item.type === "video" && (
              <video src={item.src} controls width="300" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;