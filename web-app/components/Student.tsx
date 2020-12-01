import React from "react";
import Link from "next/link";
import Button from "react-bootstrap/Button";
import Card from "react-bootstrap/Card";
import ListGroup from "react-bootstrap/ListGroup";

interface StudentData {
  key: string;
  id: string;
  name: string;
  preference_list: Array<string> | null;
  partner?: string;
  removeStudentFromRoster: (studentId: string) => Promise<void>;
}

export default function Student({
  id,
  name,
  preference_list,
  partner,
  removeStudentFromRoster
}: StudentData): JSX.Element {
  const partnerInfo =
    partner == null ? "Not enough data to autogenerate partner" : partner;
  let preferenceInfo;
  if (preference_list == null) {
    preferenceInfo = "No preferences";
  } else {
    preferenceInfo = (
      <ListGroup>
        {preference_list.map(user => (
          <ListGroup.Item key={user} variant="info">
            {user}
          </ListGroup.Item>
        ))}
      </ListGroup>
    );
  }

  return (
    <Card style={{ marginTop: 30, marginBottom: 30 }}>
      <Card.Body>
        <Card.Title>StudentName: {name}</Card.Title>
        <Card.Text>Partner: {partnerInfo}</Card.Text>
        {preference_list != null && <Card.Text>Preferences: </Card.Text>}
        {preference_list == null ? (
          <Card.Text>Preferences: {preferenceInfo}</Card.Text>
        ) : (
          preferenceInfo
        )}
      </Card.Body>
      <Card.Footer>
        <Button
          variant="danger"
          size="sm"
          style={{ cursor: "pointer" }}
          onClick={() => removeStudentFromRoster(id)}
        >
          Remove student from Course
        </Button>
      </Card.Footer>
    </Card>
  );
}
