import React, { Component } from 'react';
import {
  alphabeticalSort,
  getLatestEntry,
  getEntryColor,
  doesFlaggedExist,
} from '../../utils/helpers';
import { ModalContainer, ModalDialog } from 'react-modal-dialog';
import { FormattedMessage, injectIntl } from 'react-intl';

import WeekSelection from '../WeekSelection';
import Modal from 'react-modal';
import * as colors from '../../colors';

import { Icon } from 'react-fa';
import keydown from 'react-keydown';

import FlaggedIcon from 'assets/flagged.svg';

import styles from './style.pcss';
import menuStyles from './menuStyle.pcss';
import modalStyles from './modalStyle.pcss';

class ProjectModal extends React.Component {
  handleCloseClick = () => this.props.handleClose();

  componentWillMount() {

  }

  @keydown(27)
  closeModal = event => {
    event.preventDefault();
    this.props.handleClose();
  };

  render() {
    const { project, entries } = this.props;

    const color = project.color;

    return (
      <Modal
        isOpen={true}
        contentLabel="Modal"
        onRequestClose={this.closeModal}
        className={{
          base: modalStyles.modal,
        }}
        overlayClassName={{
          base: modalStyles.overlay,
        }}
      >
        <button className={modalStyles.closeButton} onClick={this.handleCloseClick}>
          X
        </button>
        <div className={`${modalStyles.header} ${color}`}>
          <h4 className={modalStyles.title}>
            {project.name}
          </h4>
        </div>
        <div className={modalStyles.message}>
          {project.message}
        </div>
        <div className={modalStyles.employeeList}>
          {project.employees.map(e => {
            const entry = entries.filter(entry => entry.name === e.name);
            const latestEntry = entry ? entry.get(-1) : null;
            const color = latestEntry ? latestEntry.color : 'empty';
            return (
              <div key={`${project.id}-${e.name}`} className={modalStyles.employeeContainer}>
                <div className={`${styles.employee} ${color} target`}>
                  {e.name}
                </div>
                <div className={modalStyles.subMessage}>
                  {latestEntry ? latestEntry.message : ''}
                </div>
              </div>
            );
          })}
        </div>
      </Modal>
    );
  }
}

export default injectIntl(ProjectModal);

function getColor(e) {
  const latestEntry = e.entry.size > 0 ? e.entry.get(-1) : null;
  return latestEntry ? latestEntry.color : 'empty';
}
