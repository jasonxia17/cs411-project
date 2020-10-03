import React from 'react';
import styles from './App.module.css';

class App extends React.Component {
  state = {
    message: "placeholder"
  }

  componentDidMount() {
    fetch('/api/welcome')
      .then(res => res.json())
      .then((data) => {
        this.setState({ message: data })
      })
  }

  render() {
    return (
      <div className={styles.App}>
        <p>Time to struggle together.</p>
      </div>
    );
  }
}

export default App;
