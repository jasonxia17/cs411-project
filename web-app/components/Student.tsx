import React from "react";
import Link from "next/link";

interface StudentProps {
  UserId: string;
  Name: string;
  Email: string;
}

export default function Student({
  UserId,
  Name,
  Email
}: StudentProps): JSX.Element {
  return (
    <div>
      <h2>
        Id: {UserId}, Name: {Name}, Email: {Email}
      </h2>
    </div>
  );
}
