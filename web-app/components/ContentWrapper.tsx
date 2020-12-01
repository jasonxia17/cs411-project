import React, { Fragment, ReactNode } from "react";
import Header from "./user-profile/Header";

export default function ContentWrapper({
  children
}: {
  children: ReactNode;
}): JSX.Element {
  return (
    <Fragment>
      <Header />
      <div className="body-wrapper">
        <div className="limit-width">{children}</div>
      </div>
    </Fragment>
  );
}
