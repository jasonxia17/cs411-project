import React from "react";
import Card from "react-bootstrap/Card";

interface CourseData {
  key: string;
  id: string;
  title: string;
  cardColor: string;
}

export default function Course({
  id,
  title,
  cardColor
}: CourseData): JSX.Element {
  return (
    <Card border={cardColor} key={id}>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Link href={`/topic/${id}`}>View posts</Card.Link>
      </Card.Body>
    </Card>
  );
}
