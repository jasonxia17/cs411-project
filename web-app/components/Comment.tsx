import React, { useState } from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import EditPostModal from "./EditPostModal";

interface CommentData {
  key: string;
  CommentId: string;
  Username: string;
  Body: string;
  PostTime: string;
  deletable: boolean;
}

export default function Comment({
  CommentId: PostId,
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

  return (
    <Card style={{ marginTop: 30, marginBottom: 30 }}>
      <Card.Header className="text-muted">
        Posted on {timestampString}
      </Card.Header>
      <Card.Body>
        <Card.Subtitle className="mb-2 text-muted">
          Posted by {Username}
        </Card.Subtitle>
        <Card.Text>{Body}</Card.Text>
      </Card.Body>
    </Card>
  );
}
