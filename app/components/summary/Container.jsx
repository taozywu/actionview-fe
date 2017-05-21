import React, { PropTypes, Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import * as SummaryActions from 'redux/actions/SummaryActions';
const List = require('./List');

function mapDispatchToProps(dispatch) {
  return {
    actions: bindActionCreators(SummaryActions, dispatch)
  };
}

@connect(({ summary }) => ({ summary }), mapDispatchToProps)
export default class Container extends Component {
  constructor(props) {
    super(props);
    this.pid = '';
  }

  static propTypes = {
    actions: PropTypes.object.isRequired,
    location: PropTypes.object.isRequired,
    params: PropTypes.object.isRequired,
    summary: PropTypes.object.isRequired
  }

  async index() {
    await this.props.actions.index(this.pid);
    return this.props.summary.ecode;
  }

  componentWillMount() {
    const { params: { key } } = this.props;
    this.pid = key;
  }

  render() {
    return (
      <div>
        <List 
          index={ this.index.bind(this) } 
          { ...this.props.summary }/>
      </div>
    );
  }
}
