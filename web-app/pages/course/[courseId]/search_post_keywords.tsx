import React, { useState } from "react";
import { useRouter } from "next/router";

export default function SearchPostsKeywordsPage(): JSX.Element {
  const [keywords, setKeywords] = useState("");
  const [matchingPosts, setMatchingPosts] = useState([]);
  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);

  const { query } = useRouter();

  async function searchForPosts(): Promise<void> {
    const courseId = query.courseId as string;

    await fetch("/api/search_post_keywords", {
      method: "GET",
      headers: {
        courseId,
        keywords: keywords
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
      <h1>Search for posts that match the following words or phrase!</h1>
      <textarea
        style={{ width: 250, height: 50, padding: 10, resize: "none" }}
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
      />
      <div>
        <button
          disabled={keywords.length === 0}
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
          <li key={post.PostId}>
            <h2>
              Post {post.PostId} by User {post.UserId}
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
