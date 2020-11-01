import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";

export default function ViewTopicsPage(): JSX.Element {
  const [topics, setTopics] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }

    fetch(`/api/course/${courseId}/view_topics?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <ul>
      {topics.map(topic => (
        <li key={topic.TopicId}>
          <Link href={`/topic/${topic.TopicId}`}>
            <a style={{ color: "chocolate" }}>
              <h2>
                Topic {topic.TopicId} : {topic.Title}
              </h2>
            </a>
          </Link>
        </li>
      ))}
    </ul>
  );
}
