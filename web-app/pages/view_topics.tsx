import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";

export default function ViewTopicsPage(): JSX.Element {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch("/api/view_topics")
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics);
      })
      .catch(reason => console.log(reason));
  }, []); // empty array => effect never needs to re-run.

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
