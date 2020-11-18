import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";
import assert from "assert";

enum UserRole {
  Student = "Student",
  Instructor = "Instructor"
}

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  const [courseId, setCourseId] = useState(query.courseId as string);
  const [joinCode, setJoinCode] = useState("");
  const [userRole, setUserRole] = useState(UserRole.Student);

  // So we can use the same API endpoint for dropping a class and removing someone
  // else from a class
  const [userId, setUserId] = useState("");

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
        setUserId(data.userId);

        assert(data.isStudent || data.isInstructor);
        if (data.isStudent) {
          setUserRole(UserRole.Student);
        } else if (data.isInstructor) {
          setUserRole(UserRole.Instructor);
        }
      })
      .catch(reason => console.log(reason));
  }, [query]);

  console.log(userId);

  async function dropClassAsStudent(): Promise<void> {
    assert(userRole == UserRole.Student);
    await fetch("/api/course/remove_from_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentId: userId })
    });
    window.location.href = "/view_courses";
  }

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  const viewPostsLink = `/course/${courseId}/view_posts`;
  const makePostsLink = `/course/${courseId}/make_post`;
  const searchPostsLink = `/course/${courseId}/search_post_keywords`;
  const viewTopicsLink = `/course/${courseId}/view_topics`;
  const viewRosterAsInstructorLink = `/course/${courseId}/view_roster`;

  // TODO refactor to page's home screen (should have a similar layout as Piazza)
  return (
    <div>
      <div>
        <Link href={viewPostsLink}>
          <a className="page_link">Go see posts!</a>
        </Link>
      </div>
      <div>
        <Link href={makePostsLink}>
          <a className="page_link">Make a post!</a>
        </Link>
      </div>
      <div>
        <Link href={searchPostsLink}>
          <a className="page_link">Search for posts based on keywords!</a>
        </Link>
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
      )}
      <div
        style={{
          marginTop: 10
        }}
      >
        Join Code: {joinCode}
      </div>
    </div>
  );
}
