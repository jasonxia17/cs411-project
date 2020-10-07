import React, { useState } from "react";

export default function MakePostPage(): JSX.Element {
  const [postBody, setPostBody] = useState("");

  async function submitPost(): Promise<void> {
    await fetch("/api/make_post", {
      method: "POST",
      body: postBody
    });
    window.location.href = "/"; // go back to home page
  }

  return (
    <div>
      <h1>Write your post here!</h1>
      <textarea
        style={{ width: 750, height: 300, padding: 10, resize: "none" }}
        value={postBody}
        onChange={e => setPostBody(e.target.value)}
      />
      <div>
        <button style={{ cursor: "pointer" }} onClick={submitPost}>
          Post!
        </button>
      </div>
    </div>
  );
}
