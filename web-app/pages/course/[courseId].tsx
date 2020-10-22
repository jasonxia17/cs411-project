import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  console.log("query", query);

  // CourseID can either be a string or an array of strings
  // Let's always make it a string
  let courseId = query.courseId;
  if (Array.isArray(courseId)) {
    courseId = courseId[0];
  }

  const viewPostsLink = `/view_posts?courseId=${query.courseId}`;
  const makePostsLink = `/make_post?courseId=${query.courseId}`;
  const searchPostsLink = `/search_post_keywords?courseId=${query.courseId}`;
  const viewTopicsLink = `/view_topics?courseId=${query.courseId}`;

  // TODO refactor to page's home screen (should have a similar layout as Piazza)
  return (
    <div>
      <div>
        <Link href={viewPostsLink}>
          <a className="page_link">Go see posts!</a>
        </Link>
      </div>
      <div>
        <Link href={makePostsLink}>
          <a className="page_link">Make a post!</a>
        </Link>
      </div>
      <div>
        <Link href={searchPostsLink}>
          <a className="page_link">Search for posts based on keywords!</a>
        </Link>
      </div>
      <div>
        <Link href={viewTopicsLink}>
          <a className="page_link">Go see topics!</a>
        </Link>
      </div>
    </div>
  );
}
