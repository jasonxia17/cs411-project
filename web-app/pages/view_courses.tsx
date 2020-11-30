import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";
import Course from "../components/Course";
import ContentWrapper from "../components/ContentWrapper";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";

import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

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

  const studentCardColor = "primary"; // blue
  const instructorCardColor = "success"; // green

  return (
    <ContentWrapper>
      <div className="mb-2">
        <Button
          variant={studentCardColor}
          href="/join_course?join_type=student"
        >
          Join Course As Student
        </Button>{" "}
        <Button
          variant={instructorCardColor}
          href="/join_course?join_type=instructor"
        >
          Join Course As Instructor
        </Button>{" "}
        <Button variant={instructorCardColor} href="/create_course">
          Create Course As Instructor
        </Button>{" "}
      </div>
      <div>
        <CardColumns>
          {studentCourses.map(course => (
            <Course
              key={course.CourseId}
              UserType={"Student"}
              CardColor={studentCardColor}
              CourseId={course.CourseId as string}
              Title={course.Title as string}
              Semester={course.Semester as string}
            />
          ))}
        </CardColumns>
        <CardColumns>
          {instructorCourses.map(course => (
            <Course
              key={course.CourseId}
              UserType={"Instructor"}
              CardColor={instructorCardColor}
              CourseId={course.CourseId as string}
              Title={course.Title as string}
              Semester={course.Semester as string}
            />
          ))}
        </CardColumns>
      </div>
    </ContentWrapper>
  );
}
