import React, { useState } from "react";

export default function SearchPostsTopicsPage(): JSX.Element {
  const [topics, setTopics] = useState("");
  const [matchingPosts, setMatchingPosts] = useState([]);
  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);

  async function searchForPosts(): Promise<void> {
    await fetch("/api/search_post_topics", {
      method: "GET",
      headers: {
        topics: topics
      }
    })
      .then(res => res.json())
      .then(data => {
        setMatchingPosts(data.posts);
      })
      .catch(reason => console.log(reason));
    setShouldDisplayResults(true);
  }

  const searchTextbox = (
    <div>
      <h1>Search for posts that match the following topics!</h1>
      <textarea
        style={{ width: 250, height: 50, padding: 10, resize: "none" }}
        value={topics}
        onChange={e => setTopics(e.target.value)}
      />
      <div>
        <button
          disabled={topics.length === 0}
          style={{ cursor: "pointer" }}
          onClick={searchForPosts}
        >
          Search!
        </button>
      </div>
    </div>
  );

  const displayedPosts = (
    <div>
      <h1>Matching posts:</h1>
      <ul>
        {matchingPosts.map(post => (
          <li key={post.TopicId}>
            <h2>
              Post {post.TopicId} by User {post.TopicId}
            </h2>
            <p>{post.Body}</p>
          </li>
        ))}
      </ul>
    </div>
  );

  if (shouldDisplayResults) {
    return (
      <div>
        {searchTextbox}
        {matchingPosts.length > 0 ? (
          displayedPosts
        ) : (
          <h2>No posts were found</h2>
        )}
      </div>
    );
  } else {
    return searchTextbox;
  }
}
