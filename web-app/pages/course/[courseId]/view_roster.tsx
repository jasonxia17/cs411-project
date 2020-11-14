import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../../hooks/protected_route_hook";

export default function ViewRoster(): JSX.Element {
  const [students, setStudents] = useState([]);
  const { query } = useRouter();

  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }

    fetch(`/api/course/${courseId}/view_roster?`, {
      method: "GET"
    })
      .then(res => res.json())
      .then(data => {
        setStudents(data.students);
      })
      .catch(reason => console.log(reason));
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  return (
    <ul>
      {students.map(student => (
        <li key={student.id}>
          <div>
            <h2>Name: {student.name}</h2>
          </div>
        </li>
      ))}
    </ul>
  );
}
