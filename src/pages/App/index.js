import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';

import Profile from '../../containers/Profile';
import Organization from '../../containers/Organization';
import Navigation from '../../containers/Navigation';

import * as routes from '../../constants/routes';

class App extends Component {

  state = {
    organizationName: 'the-road-to-learn-react'
  };

  onOrganizationSearch = value => {
    this.setState({ organizationName: value });
  };

  render() {

    const { organizationName } = this.state;

    return (
      <Router>
        <div className="App">
          <Navigation
            organizationName={organizationName}
            onOrganizationSearch={this.onOrganizationSearch}
          />
          <Route
            exact
            path={routes.ORGANIZATION}
            component={() => (
              <div className="App-content_large-header">
                <Organization organizationName={organizationName} />
              </div>
            )}
          />
          <Route
            exact
            path={routes.PROFILE}
            component={() => (
              <div className="App-content_small-header">
                <Profile />
              </div>
            )}
          />
        </div>
      </Router>
    );
  }
}

export default App;
