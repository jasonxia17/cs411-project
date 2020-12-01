import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import { copyFileSync } from "fs";
import Student from "./Student";

interface RosterModalType {
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
  colorTheme: string;
}

export default function RosterModal({
  shouldShow,
  setShouldShow,
  colorTheme
}: RosterModalType): JSX.Element {
  const hideModal = () => {
    setShouldShow(false);
  };

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

  async function removeStudentFromRoster(studentId: string): Promise<void> {
    console.log("here", studentId);
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
    <Modal show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Roster (Students Only)</Modal.Title>
      </Modal.Header>
      <div
        style={{
          marginTop: 10,
          marginLeft: 10,
          marginRight: 10,
          marginBottom: 10
        }}
      >
        <Button
          variant={colorTheme}
          style={{ cursor: "pointer" }}
          onClick={matchStudents}
        >
          Match students with partners!
        </Button>
        {students.map(student => (
          <Student
            key={student.id}
            id={student.id}
            name={student.name}
            preference_list={student.preference_list}
            partner={student.matching}
            removeStudentFromRoster={removeStudentFromRoster}
          />
        ))}
      </div>
    </Modal>
  );
}
