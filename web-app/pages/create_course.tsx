import React, { useState } from "react";

let courseId = 0;

export default function MakePostPage(): JSX.Element {
  const [courseTitle, setCourseTitle] = useState("");
  const [semester, setSemester] = useState(""); // TODO: Default value should be current semester
  const [courseYear, setCourseYear] = useState(new Date().getFullYear());

  return (
    <div>
      <h1>Create a Course</h1>
      <h2>Course Title</h2>
      <div>
        Title:
        <input
          value={courseTitle}
          onChange={e => setCourseTitle(e.target.value)}
        />
      </div>
      <div
        style={{
          marginTop: 10
        }}
      >
        <h2>Course Semester</h2>
        <select
          value={semester}
          onChange={e => {
            setSemester(e.target.value);
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
          marginTop: 10
        }}
      >
        <h2>Course Year</h2>
        <input
          value={courseYear}
          onChange={e => setCourseYear(parseInt(e.target.value))}
          type="number"
          min="1900"
          max="2099"
          step="1"
        />
      </div>
      <div>
        <button
          disabled={courseTitle.length == 0}
          style={{ cursor: "pointer" }}
          onClick={() => ({})}
        >
          Create my course!
        </button>
      </div>
    </div>
  );
}
