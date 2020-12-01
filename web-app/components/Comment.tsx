import React, { useState } from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

interface CommentData {
  key: string;
  CommentId: string;
  Username: string;
  Body: string;
  PostTime: string;
  deletable: boolean;
}

export default function Comment({
  CommentId,
  Username,
  Body,
  PostTime,
  deletable = false
}: CommentData): JSX.Element {
  const timestampString = new Date(PostTime).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });

  async function deleteComment(commentId: string): Promise<void> {
    await fetch("/api/delete_comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ commentId })
    });
    location.reload();
  }

  const commentTheme = "light";

  return (
    <Card
      bg={commentTheme}
      style={{ marginLeft: 30, marginTop: 7.5, marginBottom: 7.5 }}
    >
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">
          Posted by {Username} on {timestampString}
        </Card.Subtitle>
        <Card.Text>{Body}</Card.Text>
        {deletable && (
          <div>
            <Button
              size="sm"
              variant="danger"
              onClick={() => {
                deleteComment(CommentId);
              }}
            >
              Delete comment!
            </Button>
          </div>
        )}
      </Card.Body>
    </Card>
  );
}
