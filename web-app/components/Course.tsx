import React from "react";
import Card from "react-bootstrap/Card";
import Badge from "react-bootstrap/Badge";

type UserType = "Student" | "Instructor";

interface CourseData {
  key: string;
  UserType: UserType;
  CardColor: string;
  CourseId: string;
  Title: string;
  Semester: string;
}

export default function Course({
  UserType,
  CardColor,
  CourseId,
  Title,
  Semester
}: CourseData): JSX.Element {
  return (
    <Card border={CardColor} key={CourseId}>
      <Card.Body>
        <Card.Title>
          {Title} <Badge variant="secondary">{UserType}</Badge>
        </Card.Title>
        <Card.Text>{Semester}</Card.Text>
        <Card.Link href={`/course/${CourseId}`}>Visit course forum</Card.Link>
      </Card.Body>
    </Card>
  );
}
