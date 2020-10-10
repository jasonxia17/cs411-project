import React, { useState } from "react";

export default function SearchPostsKeywordsPage(): JSX.Element {
  const [keywords, setKeywords] = useState("");
  const [matchingPosts, setMatchingPosts] = useState([]);

  async function searchForPosts(): Promise<void> {
    await fetch("/api/search_post_keywords", {
      method: "GET",
      headers: {
        keywords: keywords
      }
    })
      .then(res => res.json())
      .then(data => {
        setMatchingPosts(data.posts);
        console.log(matchingPosts);
      })
      .catch(reason => console.log(reason));
    // TODO display queried posts
  }

  return (
    <div>
      <h1>Search for posts that match the following words or phrase!</h1>
      <textarea
        style={{ width: 250, height: 50, padding: 10, resize: "none" }}
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
      />
      <div>
        <button style={{ cursor: "pointer" }} onClick={searchForPosts}>
          Search!
        </button>
      </div>
    </div>
  );
}
