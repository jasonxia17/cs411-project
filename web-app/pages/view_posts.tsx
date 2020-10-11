import React, { useState, useEffect } from "react";

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
          <h2>
            Post {post.PostId} by User {post.UserId}: {post.Title}
          </h2>
          <p>{post.Body}</p>
        </li>
      ))}
    </ul>
  );
}
