import React, { useState } from "react";

export default function MakePostPage(): JSX.Element {
  
  function getCurrentSemester(): {year: int, season: string} {
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
    console.log(day, month, season, date.getUTCFullYear());
    return {
      year: date.getUTCFullYear(),
      season
    };
  }

  const currentSemester = getCurrentSemester();

  const [title, setTitle] = useState("");
  const [season, setSeason] = useState(currentSemester.season);
  const [year, setYear] = useState(currentSemester.year);

  async function createNewCourse(): Promise<void> {
    // Build semester from season and course year
    const semester = season + " " + String(year);

    await fetch("/api/create_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ title, semester })
    });
    window.location.href = "/"; // go back to home page
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
