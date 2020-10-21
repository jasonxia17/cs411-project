import React, { useState } from "react";

let courseId = 0;

export default function MakePostPage(): JSX.Element {
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState(""); // TODO: Default value should be current semester
  const [year, setYear] = useState(new Date().getFullYear());

  async function createNewCourse(): Promise<void> {
    const semester = season + " " + String(year);

    await fetch("/api/create_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ courseId, title, semester })
    });
    window.location.href = "/"; // go back to home page
    courseId++;
  }

  return (
    <div>
      <h1>Create a Course</h1>
      <h2>Course Title</h2>
      <div>
        Title:
        <input value={title} onChange={e => setTitle(e.target.value)} />
      </div>
      <div
        style={{
          marginTop: 10
        }}
      >
        <h2>Course Semester</h2>
        <select
          value={season}
          onChange={e => {
            setSeason(e.target.value);
          }}
        >
          <option value="Spring">Spring</option>
          <option value="Summer">Summer</option>
          <option value="Fall">Fall</option>
          <option value="Winter">Winter</option>
        </select>
      </div>
      <div
        style={{
          marginTop: 5
        }}
      >
        <h2>Course Year</h2>
        <input
          value={year}
          onChange={e => setYear(parseInt(e.target.value))}
          type="number"
          min="1900"
          max="2099"
          step="1"
        />
      </div>
      <div
        style={{
          marginTop: 20
        }}
      >
        <button
          disabled={title.length == 0}
          style={{ cursor: "pointer" }}
          onClick={createNewCourse}
        >
          Create my course!
        </button>
      </div>
    </div>
  );
}
