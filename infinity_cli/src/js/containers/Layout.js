import React from 'react';
import NavigationBar from './NavigationBar';
import StatusBar from './StatusBar'

class Layout extends React.Component {
  
  render() {
    return (
      <div className="container-fluid">
        <NavigationBar/>
        <h1>Infinity</h1>
        <div className="row">
          <div className="col-lg-12">
            {this.props.children}
          </div>
        </div>
        <StatusBar/>

      </div>
    );
  }
}

export default Layout;
