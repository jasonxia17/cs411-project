import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SinglePostPage(): JSX.Element {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  const { query } = useRouter();

  useEffect(() => {
    const postId = query.postId;
    if (postId === undefined) {
      return;
    }

    fetch(`/api/post/${postId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
        setComments(data.comments);
      })
      .catch(reason => console.log(reason));
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  async function submitComment(): Promise<void> {
    const postId = query.postId;
    if (postId === undefined) {
      alert("Failed to submit comment");
      return;
    }

    await fetch("/api/make_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId, newComment })
    });
    location.reload();
  }

  return (
    <div>
      <div style={{ border: "1px solid black", marginBottom: 30 }}>
        <ul>
          {posts.map(post => (
            <li key={post.PostId}>
              <h2>
                Post {post.PostId} by User {post.UserId}: {post.Title}
              </h2>
              <p>{post.Body}</p>
            </li>
          ))}
        </ul>
      </div>
      <h2>Comments</h2>
      <ul>
        {comments.map(comment => (
          <li key={comment.CommentId}>
            <h3>
              Comment {comment.CommentId} by User {comment.UserId}
            </h3>
            <p>{comment.Body}</p>
          </li>
        ))}
      </ul>
      <h3 style={{ marginTop: 50 }}>Make a comment:</h3>
      <textarea
        style={{
          width: 750,
          height: 150,
          padding: 10,
          resize: "none"
        }}
        value={newComment}
        onChange={e => setNewComment(e.target.value)}
      />
      <div>
        <button style={{ cursor: "pointer" }} onClick={submitComment}>
          Comment!
        </button>
      </div>
    </div>
  );
}
