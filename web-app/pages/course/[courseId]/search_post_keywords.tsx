import React, { useState } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";
import Post from "../../../components/Post";
import { Alert, Button, FormControl, InputGroup } from "react-bootstrap";
import ContentWrapper from "../../../components/ContentWrapper";

export default function SearchPostsKeywordsPage(): JSX.Element {
  const [keywords, setKeywords] = useState("");
  const [matchingPosts, setMatchingPosts] = useState([]);
  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);

  const { query } = useRouter();

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function searchForPosts(): Promise<void> {
    const courseId = query.courseId as string;

    await fetch(
      `/api/course/${courseId}/search_post_keywords?` +
        new URLSearchParams({ keywords: keywords }),
      {
        method: "GET"
      }
    )
      .then(res => res.json())
      .then(data => setMatchingPosts(data.matched_posts))
      .catch(reason => console.log(reason));
    setShouldDisplayResults(true);
  }

  const searchTextbox = (
    <InputGroup className="mb-3">
      <FormControl
        placeholder="Search for matching posts and comments by keywords or usernames!"
        aria-label="Search keywords"
        value={keywords}
        onChange={e => setKeywords(e.target.value)}
      />
      <InputGroup.Append>
        <Button disabled={keywords.length === 0} onClick={searchForPosts}>
          Search!
        </Button>
      </InputGroup.Append>
    </InputGroup>
  );

  const displayedPosts = (
    <div>
      <h2 style={{ marginTop: 30 }}>Matching posts:</h2>
      {matchingPosts.map(post => (
        <Post key={post.PostId} {...post} />
      ))}
    </div>
  );

  return (
    <ContentWrapper>
      {searchTextbox}
      {shouldDisplayResults &&
        (matchingPosts.length > 0 ? (
          displayedPosts
        ) : (
          <Alert variant="secondary" style={{ marginTop: 30 }}>
            No posts were found
          </Alert>
        ))}
    </ContentWrapper>
  );
}
