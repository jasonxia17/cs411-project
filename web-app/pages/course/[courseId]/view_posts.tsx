import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";
import Post from "../../../components/Post";

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
          <Post
            PostId={post.PostId as string}
            UserId={post.UserId as string}
            Title={post.Title as string}
            Body={post.Body as string}
          />
        </li>
      ))}
    </ul>
  );
}
