import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ViewPostsPage(): JSX.Element {
  const [posts, setPosts] = useState([]);
  const { query } = useRouter();

  // CourseID can either be a string or an array of strings
  // Let's always make it a string
  let courseId = query.courseId as string;
  if (Array.isArray(courseId)) {
    courseId = courseId[0];
  }
  useEffect(() => {
    fetch("/api/view_posts", {
      method: "GET",
      headers: {
        courseId
      }
    })
      .then(res => {
        console.log(res);
        return res.json();
      })
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
