import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import assert from "assert";
import ContentWrapper from "../../components/ContentWrapper";
import Post from "../../components/Post";
import Topic from "../../components/Topic";
import {
  Alert,
  Button,
  FormControl,
  InputGroup,
  CardColumns
} from "react-bootstrap";
import Card from "react-bootstrap/Card";
import Container from "react-bootstrap/Container";
import MakeTopicModal from "../../components/MakeTopicModal";

enum UserRole {
  Student = "Student",
  Instructor = "Instructor"
}

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  const [courseId, setCourseId] = useState(query.courseId as string);
  const [courseTitle, setCourseTitle] = useState("");
  const [courseSemester, setCourseSemester] = useState("");

  const [joinCode, setJoinCode] = useState("");
  const [userRole, setUserRole] = useState(UserRole.Student);
  const [keywords, setKeywords] = useState("");

  const [matchingPosts, setMatchingPosts] = useState([]);
  const [topics, setTopics] = useState([]);

  const [shouldDisplayResults, setShouldDisplayResults] = useState(false);
  const [shouldShowNewTopicModal, setShouldShowNewTopicModal] = useState(false);

  const classTheme = "info";
  const [partnerName, setPartnerName] = useState("");

  // Wrap courseId in hook to handle case where user refreshes
  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }
    setCourseId(courseId);

    fetch(`/api/course/${courseId}/view_topics?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setTopics(data.topics);
      })
      .catch(reason => console.log(reason));

    fetch(`/api/course/${courseId}`)
      .then(res => res.json())
      .then(data => {
        setJoinCode(data.courseData.JoinCode as string);
        setCourseTitle(data.courseData.Title);
        setCourseSemester(data.courseData.Semester);

        assert(data.isStudent || data.isInstructor);
        if (data.isStudent) {
          setUserRole(UserRole.Student);
        } else if (data.isInstructor) {
          setUserRole(UserRole.Instructor);
        }
        setPartnerName(data.studentPairing);
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

  // TODO border doesn't work here?
  const searchTextbox = (
    <InputGroup border={classTheme} className="mb-3">
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

  const viewRosterAsInstructorLink = `/course/${courseId}/view_roster`;
  const seeInteractionsLink = `/course/${courseId}/view_interactions_graph`;

  return (
    <ContentWrapper>
      <div style={{ marginBottom: 10 }}>
        <Card border={classTheme} className="text-center">
          <Card.Body>
            <Card.Title>{courseTitle}</Card.Title>
            <Card.Text>
              You are on the {courseSemester} forum as a(n){" "}
              {userRole.toLowerCase()}
            </Card.Text>
            <Card.Footer className="text-muted">
              Join code: {joinCode}
            </Card.Footer>
          </Card.Body>
        </Card>
      </div>
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
        <CardColumns>
          {topics.map(topic => (
            <Topic
              key={topic.TopicId}
              id={topic.TopicId}
              title={topic.Title}
              cardColor={classTheme}
            />
          ))}
        </CardColumns>
        <Button
          variant={classTheme}
          style={{ cursor: "pointer" }}
          onClick={setShouldShowNewTopicModal}
        >
          Make a new topic!
        </Button>
        <MakeTopicModal
          shouldShow={shouldShowNewTopicModal}
          setShouldShow={setShouldShowNewTopicModal}
        ></MakeTopicModal>
      </div>
      {userRole == UserRole.Student && (
        <div
          style={{
            marginTop: 10
          }}
        >
          <Button
            variant="danger"
            style={{ cursor: "pointer" }}
            onClick={dropClassAsStudent}
          >
            Drop class
          </Button>
        </div>
      )}
      {userRole == UserRole.Instructor && (
        <div>
          <div
            style={{
              marginTop: 10
            }}
          >
            <Button
              variant={classTheme}
              style={{ cursor: "pointer" }}
              href={seeInteractionsLink}
            >
              See a visualization of student interactions!
            </Button>
          </div>
          <div
            style={{
              marginTop: 10
            }}
          >
            <Link href={viewRosterAsInstructorLink}>
              <a className="page_link">See roster!</a>
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
      <div
        style={{
          marginTop: 10
        }}
      >
        {userRole == UserRole.Student && partnerName && (
          <h2>Partner name: {partnerName}</h2>
        )}
      </div>
    </ContentWrapper>
  );
}
