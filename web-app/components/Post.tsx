import React from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";

interface PostData {
  PostId: string;
  Username: string;
  Title: string;
  Body: string;
  NumComments?: number;
  PostTime: string;
  clickable: boolean;
  editable: boolean;
}

export default function Post({
  PostId,
  Username,
  Title,
  Body,
  NumComments,
  PostTime,
  clickable = true,
  editable = false
}: PostData): JSX.Element {
  const timestampString = new Date(PostTime).toLocaleString("en-US", {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric"
  });

  return (
    <Card style={{ marginTop: 30, marginBottom: 30 }}>
      <Card.Header className="text-muted">
        Posted on {timestampString} • {NumComments}{" "}
        {NumComments === 1 ? "Comment" : "Comments"}
      </Card.Header>
      <Card.Body>
        <Card.Title>{Title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Posted by {Username}
        </Card.Subtitle>
        <Card.Text>{Body}</Card.Text>
        {editable && (
          <Button href={`/post/${PostId}/edit_post`}>Edit post!</Button>
        )}
      </Card.Body>
      {clickable && <a href={`/post/${PostId}`} className="stretched-link"></a>}
    </Card>
  );
}
