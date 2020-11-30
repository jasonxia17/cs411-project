import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

interface CourseData {
  key: string;
  CardColor: string;
  CourseId: string;
  Title: string;
  Semester: string;
}

export default function Course({
  CardColor,
  CourseId,
  Title,
  Semester
}: CourseData): JSX.Element {
  return (
    <Card border={CardColor} key={CourseId}>
      <Card.Body>
        <Card.Title>
          {Title} <Badge variant="secondary">Instructor</Badge>
        </Card.Title>
        <Card.Text>{Semester}</Card.Text>
        <Card.Link href={`/course/${CourseId}`}>Visit course forum</Card.Link>
      </Card.Body>
    </Card>
  );
}
