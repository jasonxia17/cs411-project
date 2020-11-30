import React from "react";
import Link from "next/link";
import Card from "react-bootstrap/Card";

interface PostData {
  PostId: string;
  Username: string;
  Title: string;
  Body: string;
  NumComments?: number;
  PostTime: string;
}

export default function Post({
  PostId,
  Username,
  Title,
  Body,
  NumComments,
  PostTime
}: PostData): JSX.Element {
  const timestampString = new Date(PostTime).toLocaleString("en-US", {
    dateStyle: "short",
    timeStyle: "short"
  });
  return (
    <Card style={{ marginTop: 30, marginBottom: 30 }}>
      <Card.Body>
        <Card.Title>{Title}</Card.Title>
        <Card.Subtitle className="mb-2 text-muted">
          Posted by {Username}
        </Card.Subtitle>
        <Card.Text>{Body}</Card.Text>
      </Card.Body>
      <Card.Footer className="text-muted">
        Posted on {timestampString} • {NumComments}{" "}
        {NumComments === 1 ? "Comment" : "Comments"}
      </Card.Footer>

      <a href={`/post/${PostId}`} className="stretched-link"></a>
    </Card>
  );
}
