import React, { useState, useEffect } from "react";

export default function ViewCourses(): JSX.Element {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    fetch("/api/view_courses")
      .then(res => {
          console.log("res: ", res);
          return res.json();
      })
      .then(data => {
        setCourses(data.courses);
      })
      .catch(reason => console.log(reason));
  }, []); // empty array => effect never needs to re-run.

  console.log("courses: ", courses);
  return (
    <ul>
      {courses.map(course => (
        <li key={course.CourseId}>
          <h2>
            Title: {course.Title}, Semester: {course.Semester}
          </h2>
          <div>
            <Link href={`/course/${course.CourseId}`}>
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
