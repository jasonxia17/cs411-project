import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { useRouter } from "next/router";

interface MakeTopicModal {
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function MakeTopicModal({
  shouldShow,
  setShouldShow
}: MakeTopicModal): JSX.Element {
  const hideModal = () => {
    setShouldShow(false);
  };

  const [topicTitle, setTopicTitle] = useState("");
  const { query } = useRouter();

  async function submitTopic(): Promise<void> {
    const courseId = query.courseId;
    await fetch("/api/make_topic", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ courseId, topicTitle })
    });
    window.location.href = `/course/${courseId}`;
  }

  return (
    <Modal show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Create a new topic</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="title"
              placeholder="Title"
              onChange={e => setTopicTitle(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={submitTopic}>
          Create topic!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
