import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";

interface CreateCourseModalData {
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function CreateCourseModal({
  shouldShow,
  setShouldShow
}: CreateCourseModalData): JSX.Element {
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

  const hideModal = () => {
    const currentSemester = getCurrentSemester();
    setTitle("");
    setSeason(currentSemester.season);
    setYear(currentSemester.year);
    setShouldShow(false);
  };

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
    window.location.href = "/view_courses";
  }

  return (
    <Modal show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create a Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Course Title</Form.Label>
            <Form.Control
              required
              type="title"
              placeholder="Title"
              onChange={e => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formSemester">
            <Form.Label>Course Semester</Form.Label>
            <Form.Control
              as="select"
              value={season}
              onChange={e => {
                setSeason(e.target.value);
              }}
            >
              <option value="Spring">Spring</option>
              <option value="Summer">Summer</option>
              <option value="Fall">Fall</option>
              <option value="Winter">Winter</option>
            </Form.Control>
          </Form.Group>
          <Form.Group>
            <Form.Label>Course Year</Form.Label>
            <Form.Control
              required
              value={year}
              className="mobileBox"
              name="year"
              type="number"
              min="1900"
              max="2099"
              step="1"
              onChange={e => setYear(parseInt(e.target.value))}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={createNewCourse}>
          Create my course!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
