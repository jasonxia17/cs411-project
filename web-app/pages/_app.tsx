import React from "react";
import { Provider } from "next-auth/client";

export default function App({ Component, pageProps }): JSX.Element {
  return (
    <Provider session={pageProps.session}>
      <Component {...pageProps} />
    </Provider>
  );
}
