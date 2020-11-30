import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import Post from "../../components/Post";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";

export default function SingleTopicPage(): JSX.Element {
  const { query } = useRouter();
  const [posts, setPosts] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");

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
        setTopicTitle(data.topicTitle);
      })
      .catch(reason => console.log(reason));
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <div className="body-wrapper">
      <div className="limit-width">
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center"
          }}
        >
          <h2 style={{ flex: 1 }}>Topic: {topicTitle}</h2>
          <Button size="lg" href={makePostsLink}>
            Make a post
          </Button>
        </div>
        <div>
          {posts === null ? (
            <Alert variant="secondary" style={{ marginTop: 30 }}>
              You must post in this topic before viewing other posts.
            </Alert>
          ) : (
            <Fragment>
              {posts.map(post => (
                <Post key={post.PostId} {...post} />
              ))}
            </Fragment>
          )}
        </div>
      </div>
    </div>
  );
}
