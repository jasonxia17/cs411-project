import { useSession } from "next-auth/client";
import Head from "next/head";
import Link from "next/link";
import React from "react";
import ContentWrapper from "../components/ContentWrapper";
import CoursesView from "../components/CoursesView";

export default function Index(): JSX.Element {
  const [session] = useSession();
  console.log(session);

  if (session) {
    return <CoursesView />;
  }

  return (
    <ContentWrapper>
      <div className="homepage-div">
        <h2>Why Struggle Session?</h2>
        <p>
          We wanted to solve the problem of students feeling isolated when working on their classes, especially in a remote working environment. Currently, many students may have motivation issues because they feel like they are struggling alone, without a community of people to share their experiences with.
        </p>
        <p>
          To address these issues, we created a website that allows students to write journal entries about their progress on a course. Students can use this journal to keep notes on what they’ve learned, share their struggles and their triumphs, and plan out projects. Our application aims to build a community among people taking the same class by allowing students to view and comment on each other’s journal entries.
        </p>
        <h2>What makes Struggle Session unique?</h2>
        <p>
          We want to encourage active participation rather than having students simply scour a forum for ideas or code. In order to achieve this, we require students to post their own journal entries before they can see other students’ contributions within the same topic.
        </p>
      </div>
    </ContentWrapper>
  );
}
