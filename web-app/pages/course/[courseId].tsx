import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import assert from "assert";
import ContentWrapper from "../../components/ContentWrapper";
import Post from "../../components/Post";
import { Alert, Button, FormControl, InputGroup } from "react-bootstrap";

enum UserRole {
  Student = "Student",
  Instructor = "Instructor"
}

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  const [courseId, setCourseId] = useState(query.courseId as string);
  const [joinCode, setJoinCode] = useState("");
  const [userRole, setUserRole] = useState(UserRole.Student);
  const [keywords, setKeywords] = useState("");
  const [matchingPosts, setMatchingPosts] = useState([]);
  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);

  // Wrap courseId in hook to handle case where user refreshes
  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }
    setCourseId(courseId);

    fetch(`/api/course/${courseId}`)
      .then(res => res.json())
      .then(data => {
        setJoinCode(data.courseData.JoinCode as string);

        assert(data.isStudent || data.isInstructor);
        if (data.isStudent) {
          setUserRole(UserRole.Student);
        } else if (data.isInstructor) {
          setUserRole(UserRole.Instructor);
        }
      })
      .catch(reason => console.log(reason));
  }, [query]);

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

  const displayedPosts = (
    <div>
      <h2 style={{ marginTop: 30 }}>Matching posts:</h2>
      {matchingPosts.map(post => (
        <Post key={post.PostId} {...post} />
      ))}
    </div>
  );

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

  async function dropClassAsStudent(): Promise<void> {
    assert(userRole == UserRole.Student);
    await fetch(`/api/course/${courseId}/remove_from_course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentId: session.user["id"] })
    });
    window.location.href = "/view_courses";
  }

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  const viewPostsLink = `/course/${courseId}/view_posts`;
  const searchPostsLink = `/course/${courseId}/search_post_keywords`;
  const viewTopicsLink = `/course/${courseId}/view_topics`;
  const viewRosterAsInstructorLink = `/course/${courseId}/view_roster`;
  const seeInteractionsLink = `/course/${courseId}/view_interactions_graph`;

  // TODO refactor to page's home screen (should have a similar layout as Piazza)
  return (
    <ContentWrapper>
      <div>
        {searchTextbox}
        {shouldDisplayResults &&
          (matchingPosts.length > 0 ? (
            displayedPosts
          ) : (
            <Alert variant="secondary" style={{ marginTop: 30 }}>
              No posts were found
            </Alert>
          ))}
      </div>
      <div>
        <Link href={viewTopicsLink}>
          <a className="page_link">Go see topics!</a>
        </Link>
      </div>
      {userRole == UserRole.Student && (
        <div
          style={{
            marginTop: 10
          }}
        >
          <button style={{ cursor: "pointer" }} onClick={dropClassAsStudent}>
            Drop class
          </button>
        </div>
      )}
      {userRole == UserRole.Instructor && (
        <div>
          <div
            style={{
              marginTop: 10
            }}
          >
            <Link href={seeInteractionsLink}>
              <a className="page_link">
                See a visualization of student interactions!
              </a>
            </Link>
          </div>
          <div
            style={{
              marginTop: 10
            }}
          >
            <Link href={viewRosterAsInstructorLink}>
              <a className="page_link">
                See roster (to remove students from course)!
              </a>
            </Link>
          </div>
        </div>
      )}
      <div
        style={{
          marginTop: 10
        }}
      >
        Join Code: {joinCode}
      </div>
    </ContentWrapper>
  );
}
