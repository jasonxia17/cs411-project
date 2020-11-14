import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";

export default function SinglePostPage(): JSX.Element {
  const [posts, setPosts] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { query } = useRouter();

  useEffect(() => {
    fetchPost();
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function fetchPost(): Promise<void> {
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
  }

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
    setNewComment("");
    fetchPost();
  }

  async function deleteComment(commentId: string): Promise<void> {
    await fetch("/api/delete_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ commentId })
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
              <div>
                <Link href={`/post/${post.PostId}/edit_post`}>
                  <a className="edit_link">Edit post!</a>
                </Link>
              </div>
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
            <div>
              <button
                style={{ cursor: "pointer" }}
                onClick={() => {
                  deleteComment(comment.CommentId);
                }}
              >
                Delete comment!
              </button>
            </div>
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
