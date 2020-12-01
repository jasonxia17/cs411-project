import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import Post from "../../components/Post";
import Comment from "../../components/Comment";
import MakeCommentModal from "../../components/MakeCommentModal";

import Button from "react-bootstrap/Button";
import { ArrowLeft } from "react-bootstrap-icons";
import ContentWrapper from "../../components/ContentWrapper";

export default function SinglePostPage(): JSX.Element {
  const [data, setData] = useState(undefined);
  const [shouldShowNewCommentModal, setShouldShowNewCommentModal] = useState(
    false
  );
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
      .then(data => setData(data))
      .catch(reason => console.log(reason));
  }

  if (!data) {
    return null;
  }

  return (
    <ContentWrapper>
      <Button variant="outline-secondary" href={`/topic/${data.post.TopicId}`}>
        <ArrowLeft /> Back to Topic
      </Button>
      <Post
        {...data.post}
        clickable={false}
        editable={session.user["id"] == data.post.UserId}
      />
      {data.comments.map(comment => (
        <Comment
          key={comment.CommentId}
          CommentId={comment.CommentId}
          Username={comment.name}
          Body={comment.Body}
          PostTime={comment.PostTime}
          deletable={comment.UserId == session.user["id"]}
        />
      ))}
      <div style={{ marginTop: 30, marginBottom: 30 }}>
        <Button
          size="lg"
          style={{ cursor: "pointer" }}
          onClick={() => setShouldShowNewCommentModal(true)}
        >
          Make a comment!
        </Button>
        <MakeCommentModal
          shouldShow={shouldShowNewCommentModal}
          setShouldShow={setShouldShowNewCommentModal}
        ></MakeCommentModal>
      </div>
    </ContentWrapper>
  );
}
