import React, { useState } from "react";
import useProtectedRoute from "../../../hooks/protected_route_hook";
import { useRouter } from "next/router";
import ContentWrapper from "../../../components/ContentWrapper";

export default function MakeTopicPage(): JSX.Element {
  const [topicTitle, setTopicTitle] = useState("");
  const { query } = useRouter();

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function submitTopic(): Promise<void> {
    const courseId = query.courseId;
    await fetch("/api/make_topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ courseId, topicTitle })
    });
    window.location.href = `/course/${courseId}`;
  }

  return (
    <ContentWrapper>
      <h1>Create a new topic!</h1>
      <div>
        Title:
        <input
          value={topicTitle}
          onChange={e => setTopicTitle(e.target.value)}
        />
      </div>
      <br></br>
      <div>
        <button style={{ cursor: "pointer" }} onClick={submitTopic}>
          Create topic!
        </button>
      </div>
    </ContentWrapper>
  );
}
