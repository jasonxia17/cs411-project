import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  console.log("query", query);
  
  // TODO refactor to page's home screen (should have a similar layout as Piazza)
  return (
    <div>
      <div>
        <Link href="/view_posts">
          <a className="page_link">Go see posts!</a>
        </Link>
      </div>
      <div>
        <Link href="/make_post">
          <a className="page_link">Make a post!</a>
        </Link>
      </div>
      <div>
        <Link href="/search_post_keywords">
          <a className="page_link">Search for posts based on keywords!</a>
        </Link>
      </div>
      <div>
        <Link href="/view_topics">
          <a className="page_link">Go see topics!</a>
        </Link>
      </div>
    </div>
  );
}
