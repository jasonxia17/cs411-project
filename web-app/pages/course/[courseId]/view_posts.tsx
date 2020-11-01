import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";

export default function ViewPostsPage(): JSX.Element {
  const [posts, setPosts] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }

    fetch(`/api/course/${courseId}/view_posts?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

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
