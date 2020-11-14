import React, { useState } from "react";
import useProtectedRoute from "../hooks/protected_route_hook";

export default function CreateCoursePage(): JSX.Element {
  function generateRandomJoinCode(joinCodeLength: number) {
    // https://stackoverflow.com/questions/1349404/generate-random-string-characters-in-javascript
    const asciiBase = 36;
    // Note: First 2 chars will always be 0. -- we want to avoid them
    return Math.random()
      .toString(asciiBase)
      .substring(2, joinCodeLength + 2);
  }

  function getCurrentSemester(): { year: number; season: string } {
    // https://stackoverflow.com/questions/2013255/how-to-get-year-month-day-from-a-date-object
    const date = new Date();
    const day = date.getUTCDate();
    const month = date.getUTCMonth() + 1; // Months from 1 - 12

    const FALL_START_DATE = 15;
    const WINTER_START_DATE = 15;

    let season;
    if (month <= 5) {
      season = "Spring";
    } else if (month <= 8 && day <= FALL_START_DATE) {
      season = "Summer";
    } else if (month <= 11) {
      season = "Fall";
    } else {
      if (day <= WINTER_START_DATE) {
        season = "Fall";
      } else {
        season = "Winter";
      }
    }
    return {
      year: date.getUTCFullYear(),
      season
    };
  }

  const currentSemester = getCurrentSemester();
  const [title, setTitle] = useState("");
  const [season, setSeason] = useState(currentSemester.season);
  const [year, setYear] = useState(currentSemester.year);

  const JOIN_CODE_LENGTH = 5;
  const [joinCode, setJoinCode] = useState(
    generateRandomJoinCode(JOIN_CODE_LENGTH)
  );
  const [isJoinCodeColliding, setIsJoinCodeColliding] = useState(false);
  const SUCCESS = 200;

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  async function createNewCourse(): Promise<void> {
    // Build semester from season and course year
    const semester = season + " " + String(year);
    let courseReturnCode;
    await fetch("/api/create_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, semester, joinCode })
    }).then(data => {
      courseReturnCode = data.status;
      setIsJoinCodeColliding(courseReturnCode !== SUCCESS);
    });

    if (courseReturnCode === SUCCESS) {
      window.location.href = "/view_courses";
    }
    setJoinCode(generateRandomJoinCode(JOIN_CODE_LENGTH));
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
      <h2>(Optional) Customized Join Code</h2>
      Note: If you choose not to input a custom join code, one will be generated
      for you. Maximum length: {JOIN_CODE_LENGTH}
      <div
        style={{
          marginTop: 5
        }}
      >
        {isJoinCodeColliding && (
          <h3>Join code already exists. Please select another one</h3>
        )}
        Join Code:
        <input
          value={joinCode}
          onChange={e => {
            const code = e.target.value;
            setJoinCode(code.substr(0, JOIN_CODE_LENGTH));
          }}
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
