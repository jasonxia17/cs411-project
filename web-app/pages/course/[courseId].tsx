import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import useProtectedRoute from "../../hooks/protected_route_hook";

export default function ViewCourseHomepage(): JSX.Element {
  const { query } = useRouter();
  const [courseId, setCourseId] = useState(query.courseId as string);

  // Wrap courseId in hook to handle case where user refreshes
  useEffect(() => {
    const courseId = query.courseId as string;
    if (courseId == undefined) {
      return;
    }
    setCourseId(courseId);
  }, [query]);

  const [session, loading] = useProtectedRoute();
  if (loading || !session) {
    return <div> Loading... </div>;
  }

  const viewPostsLink = `/course/${courseId}/view_posts`;
  const makePostsLink = `/course/${courseId}/make_post`;
  const searchPostsLink = `/course/${courseId}/search_post_keywords`;
  const viewTopicsLink = `/course/${courseId}/view_topics`;

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
