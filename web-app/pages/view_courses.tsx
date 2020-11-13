import Link from "next/link";
import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";
import Course from "../components/Course";

export default function ViewCourses(): JSX.Element {
  const [studentCourses, setStudentCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);

  useEffect(() => {
    fetch("/api/view_courses")
      .then(res => res.json())
      .then(data => {
        setStudentCourses(data.student_courses);
        setInstructorCourses(data.instructor_courses);
      })
      .catch(reason => console.log(reason));
  }, []); // empty array => effect never needs to re-run.

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <ul>
      <div
        style={{
          marginTop: 10
        }}
      >
        <h1>Courses where you are a student:</h1>
        {studentCourses.length == 0 ? (
          <h2>No courses available</h2>
        ) : (
          studentCourses.map(course => (
            <li key={course.CourseId}>
              <Course
                CourseId={course.CourseId as string}
                Title={course.Title as string}
                Semester={course.Semester as string}
              />
            </li>
          ))
        )}
      </div>
      <div
        style={{
          marginTop: 10
        }}
      >
        <h1>Courses where you are an instructor:</h1>
        {instructorCourses.length == 0 ? (
          <h2>No courses available</h2>
        ) : (
          instructorCourses.map(course => (
            <li key={course.CourseId}>
              <Course
                CourseId={course.CourseId as string}
                Title={course.Title as string}
                Semester={course.Semester as string}
              />
            </li>
          ))
        )}
      </div>
      <div
        style={{
          marginTop: 50
        }}
      >
        <Link href="/create_course">
          <a className="page_link">Create a course as an instructor!</a>
        </Link>
      </div>
    </ul>
  );
}
