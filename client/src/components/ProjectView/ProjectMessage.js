import React, { Component } from 'react';
import { debounce } from 'lodash';
import classnames from 'classnames';
import { FormattedMessage, injectIntl } from 'react-intl';

import styles from './style.pcss';

export default class ProjectMessage extends Component {
  state = {
    message: '',
    focused: false,
  };

  componentDidMount = () => {
    this.setState({
      message: this.props.message || '',
    });
  };

  componentWillReceiveProps = nextProps => {
    this.setState({
      message: nextProps.message || '',
    });
  };

  save = value => {
    this.props.saveProjectMessage(this.state.message);
  };

  debouncedSave = debounce(this.save, 2000);

  onChange = event => {
    this.setState({
      message: event.target.value,
    });
    this.debouncedSave();
  };

  onBlur = event => {
    event.stopPropagation();
    this.setState(
      {
        message: event.target.value,
        focused: false,
      },
      () => {
        this.save();
      },
    );
  };

  focus = (e) => {
    e.stopPropagation();
    this.setState(
      {
        focused: true,
      },
      () => {
        this.textarea.focus();
      },
    );
  };

  isDirty = () => {
    return (
      (this.state.message.length > 0 || this.props.message) &&
      (this.props.message || this.state.focused) &&
      this.props.message !== this.state.message
    );
  };

  render() {
    const { message } = this.props;

    return (
      <div>
        {this.state.focused &&
          <textarea
            ref={textarea => {
              this.textarea = textarea;
            }}
            className={classnames([styles.message, styles.messageInput])}
            onChange={this.onChange}
            onBlur={this.onBlur}
            value={this.state.message}
            onClick={e => e.stopPropagation()}
          />}

        {!this.state.focused &&
          this.state.message.length > 0 &&
          <pre className={styles.message} onClick={this.focus}>
            {this.state.message}
          </pre>}

        <div className={styles.messageDirty}>
          {this.isDirty() &&
            <div className="loadingDots">
              <span />
              <span />
              <span />
            </div>}
        </div>

        {!this.state.focused &&
          this.state.message.length === 0 &&
          <button className={classnames([styles.message, styles.setMessage])} onClick={this.focus}>
            +
          </button>}
      </div>
    );
  }
}
