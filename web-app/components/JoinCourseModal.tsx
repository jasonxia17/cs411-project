import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";

type UserType = "Student" | "Instructor";

interface JoinCourseModalData {
  joinType: UserType;
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function JoinCourseModal({
  joinType,
  shouldShow,
  setShouldShow
}: JoinCourseModalData): JSX.Element {
  const hideModal = () => setShouldShow(false);

  const [joinCode, setJoinCode] = useState("");
  const [errorCode, setErrorCode] = useState(0);
  const SUCCESSFUL_JOIN_ERR_CODE = 200;

  async function attemptToJoinCourse(): Promise<void> {
    let shouldJoinAsStudent;
    if (joinType === "Student") {
      shouldJoinAsStudent = true;
    } else if (joinType === "Instructor") {
      shouldJoinAsStudent = false;
    } else {
      throw "Invalid join type";
    }

    // Note: Need to also store the join status locally because errorCode
    // will be updated asynchronously
    let join_status;
    await fetch("/api/join_course", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ joinCode, shouldJoinAsStudent })
    })
      .then(res => {
        join_status = res.status;
        setErrorCode(res.status);
      })
      .catch(reason => console.log(reason));

    if (join_status === SUCCESSFUL_JOIN_ERR_CODE) {
      location.reload();
    }
    setJoinCode("");
  }

  let errorMessage;
  if (errorCode === 404) {
    errorMessage = "You entered an invalid course ID. Please try again";
  } else if (errorCode === 401) {
    errorMessage = "You are already a student/instructor for this course";
  }

  return (
    <Modal show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Join a Course</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form validated={errorCode !== 404 && errorCode !== 401}>
          <Form.Group controlId="formJoinCode">
            <Form.Label>Join code</Form.Label>
            <Form.Control
              type="joinCode"
              placeholder="Join code"
              onChange={e => setJoinCode(e.target.value)}
              isInvalid={errorCode === 404 || errorCode === 401}
            />
            <Form.Control.Feedback type="invalid">
              {errorMessage}
            </Form.Control.Feedback>
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={attemptToJoinCourse}>
          Join!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
