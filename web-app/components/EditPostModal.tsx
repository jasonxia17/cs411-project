import Modal from "react-bootstrap/Modal";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

interface EditPostModalType {
  currentPostBody: string;
  shouldShow: boolean;
  setShouldShow: (boolean) => void;
}

export default function EditPostModal({
  currentPostBody,
  shouldShow,
  setShouldShow
}: EditPostModalType): JSX.Element {
  const hideModal = () => {
    setShouldShow(false);
  };

  const [postBody, setPostBody] = useState(currentPostBody);
  const [postId, setPostId] = useState("");
  const { query } = useRouter();

  useEffect(() => {
    if (query.postId == undefined) {
      return;
    }
    setPostId(query.postId as string);
  }, [query]);

  async function submitEdit(): Promise<void> {
    await fetch("/api/post/edit_post", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ postId: postId, postBody })
    });
    hideModal();
    window.location.href = `/post/${postId}`; // go back to home page
  }
  return (
    <Modal size="lg" show={shouldShow} onHide={hideModal} animation={false}>
      <Modal.Header closeButton>
        <Modal.Title>Edit the post here!</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formEdit">
            <Form.Control
              type="edit"
              as="textarea"
              value={postBody}
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
        <Button variant="primary" onClick={submitEdit}>
          Save edits!
        </Button>
      </Modal.Footer>
    </Modal>
  );
}