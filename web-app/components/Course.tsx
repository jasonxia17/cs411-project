import React from "react";
import Link from "next/link";

interface CourseData {
  CourseId: string;
  Title: string;
  Semester: string;
}

export default function Course({
  CourseId,
  Title,
  Semester
}: CourseData): JSX.Element {
  return (
    <div>
      <h2>
        Title: {Title}, Semester: {Semester}
      </h2>
      <div>
        <Link href={`/course/${CourseId}`}>
          <a className="posts_link">Go to {Title} forum!</a>
        </Link>
      </div>
    </div>
  );
}
