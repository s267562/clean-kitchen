import { Component } from 'react';
import './App.css';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = { value: 0 };

    this.handleProximity = this.handleProximity.bind(this);
  }

  componentDidMount() {
    window.addEventListener('userproximity', this.handleProximity);
  }

  componentWillUnmount() {
    window.removeEventListener('userproximity', this.handleProximity);
  }

  handleProximity(e) {
    console.log('Proximity');
    console.log(e);

    if (e.near) {
      this.setState(prevState => {
        return { value: prevState.value + 1 };
      });
      console.log("near");
    } else {
      console.log("far");
    }
  }

  render() {
    return <>
      <div className="App">
        <header className="App-header">
          <p>
            Proximity sensor: {this.state.value }
          </p>
        </header>
      </div>
    </>;
  }
}

export default App;
