import Link from "next/link";
import React, { useState, useEffect } from "react";

export default function ViewCourses(): JSX.Element {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/view_courses")
      .then(res => res.json())
      .then(data => {
        setCourses(data.courses);
      })
      .catch(reason => console.log(reason));
  }, []); // empty array => effect never needs to re-run.

  return (
    <ul>
      {courses.map(course => (
        <li key={course.CourseId}>
          <h2>
            Title: {course.Title}, Semester: {course.Semester}
          </h2>
          <div>
            <Link href="/view_posts">
              <a className="posts_link">Go to {course.Title} forum!</a>
            </Link>
          </div>
        </li>
      ))}
      <div
        style={{
          marginTop: 50
        }}
      >
        <Link href="/create_course">
          <a className="page_link">Create a course!</a>
        </Link>
      </div>
    </ul>
  );
}
