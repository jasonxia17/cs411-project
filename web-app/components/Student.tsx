import React from "react";

interface StudentData {
  key: string;
  name: string;
  preference_list: Array<string> | null;
  partner?: string;
  removeStudentFromRoster: (studentId: string) => Promise<void>;
}

export default function Student({
  key,
  name,
  preference_list,
  partner,
  removeStudentFromRoster
}: StudentData): JSX.Element {
  console.log("partner: ", partner);
  return (
    <div>
      <div>
        <h2>{name}</h2>
      </div>
      <div>
        {partner != null ? (
          <h2>Partner: {partner}</h2>
        ) : (
          <h2>Not enough data to autogenerate partner</h2>
        )}
      </div>
      <div>
        <h2>Preference list:</h2>
        {preference_list.map(user => (
          <li key={user}>{user}</li>
        ))}
      </div>
      <div
        style={{
          marginTop: 10
        }}
      >
        <button
          style={{ cursor: "pointer" }}
          onClick={() => {
            removeStudentFromRoster(key);
          }}
        >
          Remove student from course
        </button>
      </div>
    </div>
  );
}
