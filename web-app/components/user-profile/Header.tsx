import React, { Fragment } from "react";
import { useSession, signIn, signOut } from "next-auth/client";

import Button from "react-bootstrap/Button";
import Navbar from "react-bootstrap/Navbar";

export default function Header(): JSX.Element {
  const [session] = useSession();

  return (
    <Navbar bg="dark" variant="dark">
      <Navbar.Brand href="/">Struggle Session</Navbar.Brand>
      <Navbar.Toggle />
      <Navbar.Collapse className="justify-content-end">
        {session ? (
          <Fragment>
            <Navbar.Text className="mr-sm-2">
              Signed in as: <a>{session.user.name}</a>
            </Navbar.Text>
            <Button onClick={() => signOut()} variant="danger">
              Sign out
            </Button>
          </Fragment>
        ) : (
          <Button onClick={() => signIn()} variant="primary">
            Sign in
          </Button>
        )}
      </Navbar.Collapse>
    </Navbar>
  );
}
