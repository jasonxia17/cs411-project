import React from "react";
import styles from "./App.module.css";

class App extends React.Component {
  state = {
    message: "placeholder"
  };

  componentDidMount(): void {
    fetch("/api/welcome")
      .then(res => res.json())
      .then(data => {
        this.setState({ message: data.message });
      })
      .catch(reason => console.log(reason));
  }

  render(): JSX.Element {
    return (
      <div className={styles.App}>
        <p>{this.state.message}</p>
      </div>
    );
  }
}

export default App;
