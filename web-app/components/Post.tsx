import React from "react";
import Link from "next/link";

interface PostData {
  PostId: string;
  UserId: string;
  Title: string;
  Body: string;
  NumComments?: number;
}

export default function Post({
  PostId,
  UserId,
  Title,
  Body,
  NumComments
}: PostData): JSX.Element {
  return (
    <div>
      <Link href={`/post/${PostId}`}>
        <a style={{ color: "chocolate" }}>
          <h2>
            Post {PostId}: {Title}
            {NumComments !== undefined && ` (${NumComments} Comments)`}
          </h2>
        </a>
      </Link>
      <p>{Body}</p>
    </div>
  );
}
