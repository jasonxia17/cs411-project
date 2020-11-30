import React from "react";

interface StudentData {
  key: string;
  name: string;
  partner?: string;
  removeStudentFromRoster: (studentId: string) => Promise<void>;
}

export default function Student({
  key,
  name,
  partner,
  removeStudentFromRoster
}: StudentData): JSX.Element {
  return (
    <div>
      <div>
        <h2>Name: {name}</h2>
      </div>
      <div
        style={{
          marginTop: 10
        }}
      >
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeStudentFromRoster(id);
          }}
        >
          Remove student from course
        </button>
      </div>
    </div>
  );
}
