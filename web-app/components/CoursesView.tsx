import React, { useState, useEffect } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";
import Course from "./Course";
import ContentWrapper from "./ContentWrapper";
import Card from "react-bootstrap/Card";
import CardColumns from "react-bootstrap/CardColumns";
import JoinCourseModal from "./JoinCourseModal";
import CreateCourseModal from "./CreateCourseModal";

import Button from "react-bootstrap/Button";
import Badge from "react-bootstrap/Badge";

export default function ViewCourses(): JSX.Element {
  const [studentCourses, setStudentCourses] = useState([]);
  const [instructorCourses, setInstructorCourses] = useState([]);
  const [
    shouldShowJoinCourseStudentModal,
    setShouldShowJoinCourseStudentModal
  ] = useState(false);
  const [
    shouldShowJoinCourseInstructorModal,
    setShouldShowJoinCourseInstructorModal
  ] = useState(false);
  const [
    shouldShowCreateCourseModal,
    setShouldShowCreateCourseModal
  ] = useState(false);

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
          onClick={() => {
            setShouldShowJoinCourseStudentModal(true);
          }}
        >
          Join Course As Student
        </Button>{" "}
        <JoinCourseModal
          joinType="Student"
          shouldShow={shouldShowJoinCourseStudentModal}
          setShouldShow={setShouldShowJoinCourseStudentModal}
        ></JoinCourseModal>
        <Button
          variant={instructorCardColor}
          onClick={() => {
            setShouldShowJoinCourseInstructorModal(true);
          }}
        >
          Join Course As Instructor
        </Button>{" "}
        <JoinCourseModal
          joinType="Instructor"
          shouldShow={shouldShowJoinCourseInstructorModal}
          setShouldShow={setShouldShowJoinCourseInstructorModal}
        ></JoinCourseModal>
        <Button
          variant={instructorCardColor}
          onClick={() => {
            setShouldShowCreateCourseModal(true);
          }}
        >
          Create Course As Instructor
        </Button>{" "}
        <CreateCourseModal
          shouldShow={shouldShowCreateCourseModal}
          setShouldShow={setShouldShowCreateCourseModal}
        ></CreateCourseModal>
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
