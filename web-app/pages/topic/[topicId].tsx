import React, { useState, useEffect, Fragment } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import Post from "../../components/Post";
import MakePostModal from "../../components/MakePostModal";

import Alert from "react-bootstrap/Alert";
import Button from "react-bootstrap/Button";
import ContentWrapper from "../../components/ContentWrapper";
import { ArrowLeft } from "react-bootstrap-icons";

export default function SingleTopicPage(): JSX.Element {
  const { query } = useRouter();
  const [posts, setPosts] = useState([]);
  const [topicTitle, setTopicTitle] = useState("");
  const [courseId, setCourseId] = useState("");
  const [showMakePostModal, setShowMakePostModal] = useState(false);

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
        setCourseId(data.courseId);
      })
      .catch(reason => console.log(reason));
  }, [query]); // query is an empty object initially; need to rerun effect when it's populated

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <ContentWrapper>
      <Button variant="outline-secondary" href={`/course/${courseId}`}>
        <ArrowLeft /> Back to Course
      </Button>
      <div
        style={{
          marginTop: 30,
          display: "flex",
          flexDirection: "row",
          alignItems: "center"
        }}
      >
        <h2 style={{ flex: 1 }}>Topic: {topicTitle}</h2>
        <Button
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => {
            setShowMakePostModal(true);
          }}
        >
          Make a post
        </Button>
        <MakePostModal
          shouldShow={showMakePostModal}
          setShouldShow={setShowMakePostModal}
        ></MakePostModal>
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
    </ContentWrapper>
  );
}
