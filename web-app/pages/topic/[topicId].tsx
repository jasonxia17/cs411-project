import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import Link from "next/link";

export default function SingleTopicPage(): JSX.Element {
  const { query } = useRouter();
  const [posts, setPosts] = useState([]);
  const makePostsLink = `/topic/${query.topicId}/make_post`;
  useEffect(() => {
    const topicId = query.topicId;
    if (topicId === undefined) {
      return;
    }

    fetch(`/api/topic/${topicId}`)
      .then(res => res.json())
      .then(data => {
        setPosts(data.posts);
      })
      .catch(reason => console.log(reason));
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <Fragment>
      <div style={{ border: "1px solid black", marginBottom: 30 }}>
        <ul>
          {posts.map(post => (
            <li key={post.TopicId}>
              <h2>
                Post {post.PostId} by User {post.UserId}: {post.Title}
              </h2>
              <p>{post.Body}</p>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <Link href={makePostsLink}>
          <a className="page_link">Make a post!</a>
        </Link>
      </div>
    </Fragment>
  );
}
