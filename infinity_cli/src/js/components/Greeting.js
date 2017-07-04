import React from 'react';
import { connect } from 'react-redux';
import { get_steps } from '../actions/stepsActions'
import _ from 'lodash'
class Greetings extends React.Component {
  constructor(props) {
    super(props);

    this.click = this.click.bind(this)
  }
  click(e) {
    e.preventDefault();
    this.props.get_steps(this.props.user)
  }
  render() {
    const { steps } = this.props.steps
    const steps_items = _.isUndefined(steps)? [] : steps.map((step) => <li className="list-group-item " key={step._id}>{step.name}</li>)
    return (
      <div >
        <h1>Home Page!</h1>
        <button className="btn btn-primary btn-lg" onClick={this.click}>Go!
        </button>
        <p></p>

        <ul className="list-group">
          <li className="list-group-item ">Step Name <span className="badge">{steps_items.length}</span></li>
          {steps_items}
        </ul>

      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    user: state.user,
    steps: state.steps
  };
}

export default connect(mapStateToProps, { get_steps })(Greetings);
