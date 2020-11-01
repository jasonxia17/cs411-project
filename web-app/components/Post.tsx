import React from "react";
import Link from "next/link";

interface PostData {
  PostId: string;
  UserId: string;
  Title: string;
  Body: string;
}

export default function Post({
  PostId,
  UserId,
  Title,
  Body
}: PostData): JSX.Element {
  return (
    <div>
      <Link href={`/post/${PostId}`}>
        <a style={{ color: "chocolate" }}>
          <h2>
            Post {PostId} by User {UserId}: {Title}
          </h2>
        </a>
      </Link>
      <p>{Body}</p>
    </div>
  );
}
