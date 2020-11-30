import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";
import Student from "../../../components/Student";

export default function ViewRoster(): JSX.Element {
  const [courseId, setCourseId] = useState("");
  const [studentMatchingInfo, setStudentMatchingInfo] = useState(new Map());
  const [students, setStudents] = useState([]);

  const { query } = useRouter();

  function updateStudentsWithMatchingInfo(curr_students, matchings) {
    // Setting state to force a re-render (so the instructor can see the updated student
    // info right away)
    const students_with_preferences = [];
    curr_students.forEach(student => {
      const curr_student_info = matchings.get(student.id);
      if (curr_student_info != null) {
        students_with_preferences.push({
          ...student,
          preference_list: curr_student_info.preference_list,
          matching: curr_student_info.matching
        });
      } else {
        students_with_preferences.push({ ...student });
      }
    });
    setStudents(students_with_preferences);
  }

  useEffect(() => {
    let courseIdLocal = query.courseId as string;
    if (courseIdLocal != undefined) {
      setCourseId(courseIdLocal);
    } else {
      courseIdLocal = courseId;
    }

    // Use local version of course ID because useState doesn't
    // guarantee synchronous updates
    fetch(`/api/course/${courseIdLocal}/view_roster?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students);
        // Pass in data.students because setState isn't guaranteed to be synchronous
        updateStudentsWithMatchingInfo(data.students, studentMatchingInfo);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function removeStudentFromRoster(studentId: string): Promise<void> {
    await fetch(`/api/course/${courseId}/remove_from_course`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ studentId })
    });
    location.reload();
  }

  async function matchStudents(): Promise<void> {
    await fetch(`/api/course/${courseId}/find_student_pairings`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        const student_info = new Map();
        data.student_info.forEach(student =>
          student_info.set(student.student_id, student)
        );
        setStudentMatchingInfo(student_info);
        updateStudentsWithMatchingInfo(students, student_info);
      })
      .catch(reason => console.log(reason));
  }

  return (
    <div>
      <div style={{ marginTop: 10 }}>
        <button style={{ cursor: "pointer" }} onClick={matchStudents}>
          Match students with partners!
        </button>
      </div>
      <ul>
        {students.map(student => (
          <Student
            key={student.id}
            name={student.name}
            preference_list={student.preference_list}
            partner={student.matching}
            removeStudentFromRoster={removeStudentFromRoster}
          />
        ))}
      </ul>
      <div
        style={{
          marginTop: 10
        }}
      >
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            window.location.href = `/course/${courseId}`;
          }}
        >
          Go back to course forum
        </button>
      </div>
    </div>
  );
}
