import React, { useState } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";

export default function MakePostPage(): JSX.Element {
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const [session, loading] = useProtectedRoute();

  async function submitPost(): Promise<void> {
    await fetch("/api/make_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postTitle, postBody })
    });
    window.location.href = "/"; // go back to home page
  }

  if (loading) {
    return <div> Loading... </div>;
  } else if (!session) {
    return <div> Redirecting to signin... </div>;
  }

  return (
    <div>
      <h1>Write your post here!</h1>
      <div>
        Title:
        <input value={postTitle} onChange={e => setPostTitle(e.target.value)} />
      </div>
      <textarea
        style={{
          width: 750,
          height: 300,
          padding: 10,
          resize: "none",
          marginTop: 20
        }}
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
