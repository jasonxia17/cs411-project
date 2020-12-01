import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { useRouter } from "next/router";

interface MakePostModalType {
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function MakePostModal({
  shouldShow,
  setShouldShow
}: MakePostModalType): JSX.Element {
  const hideModal = () => {
    setShouldShow(false);
  };

  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const { query } = useRouter();

  async function submitPost(): Promise<void> {
    const topicId = query.topicId;
    await fetch("/api/make_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postTitle, postBody, topicId })
    });
    hideModal();
    location.reload();
  }

  return (
    <Modal size="lg" show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Write your post here!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="title"
              placeholder="Title"
              onChange={e => setPostTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group controlId="formBody">
            <Form.Label>Body</Form.Label>
            <Form.Control
              type="body"
              placeholder="Body"
              as="textarea"
              rows={10}
              onChange={e => setPostBody(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={submitPost}>
          Post!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}