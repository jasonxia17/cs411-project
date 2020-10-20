import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function SinglePostPage(): JSX.Element {
  const [posts, setPosts] = useState([]);
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
      })
      .catch(reason => console.log(reason));
  }, [query]); // empty array => effect never needs to re-run.

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
