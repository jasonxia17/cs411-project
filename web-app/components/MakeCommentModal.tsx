import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState } from "react";
import { useRouter } from "next/router";

interface MakeCommentModalType {
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function MakeCommentModal({
  shouldShow,
  setShouldShow
}: MakeCommentModalType): JSX.Element {
  const hideModal = () => {
    setShouldShow(false);
  };

  const [newComment, setNewComment] = useState("");
  const { query } = useRouter();

  async function submitComment(): Promise<void> {
    const postId = query.postId;
    if (postId === undefined) {
      alert("Failed to submit comment");
      return;
    }

    await fetch("/api/make_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId, newComment })
    });
    setNewComment("");
    hideModal();
    location.reload();
  }

  return (
    <Modal size="lg" show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Write your comment here!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formComment">
            <Form.Control
              type="comment"
              placeholder="Comment"
              as="textarea"
              rows={2}
              onChange={e => setNewComment(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={hideModal}>
          Close
        </Button>
        <Button variant="primary" onClick={submitComment}>
          Post!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
