import React from "react";
import { Provider } from "next-auth/client";
import "bootstrap/dist/css/bootstrap.min.css";

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
