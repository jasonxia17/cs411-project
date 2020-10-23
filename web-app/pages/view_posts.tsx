import React, { useState, useEffect } from "react";
import Link from "next/link";

export default function ViewPostsPage(): JSX.Element {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    fetch("/api/view_posts")
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
      })
      .catch(reason => console.log(reason));
  }, []); // empty array => effect never needs to re-run.

  return (
    <ul>
      {posts.map(post => (
        <li key={post.PostId}>
          <Link href={`/post/${post.PostId}`}>
            <a style={{ color: "chocolate" }}>
              <h2>
                Post {post.PostId} by User {post.UserId}: {post.Title}
              </h2>
            </a>
          </Link>
          <p>{post.Body}</p>
        </li>
      ))}
    </ul>
  );
}
