import React, { Component } from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Icon } from 'react-fa';

import { Link } from 'react-router-dom';

import { alphabeticalSort } from '../../utils/helpers';
import { name } from 'services/employee';
import AddProjectForm from 'components/AddProjectForm';
import Button from 'components/Button';
import * as colors from '../../colors';
import styles from './style.pcss';

class StatusForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      ...props.initialValues,
    };
  }

  changeEmployee = evt => {
    const employee = this.props.employees.find(e => e.name === evt.target.value);

    this.setState({
      name: employee.name || '',
      employeeId: employee.id || null,
      activeProjects: employee.projects || [],
    });
  };

  changeDescription = ({ target: { value: description } }) => {
    this.setState({ description });
  };

  changeColor = color => {
    this.setState({ color });
  };

  toggleActiveProject = (id, e) => {
    e.preventDefault();

    const activeProjects = this.state.activeProjects || [];
    const isProjectActive = activeProjects.includes(id);

    if (isProjectActive) {
      activeProjects.splice(activeProjects.indexOf(id), 1);
    } else {
      activeProjects.push(id);
    }

    this.setState({ activeProjects }, () => this.saveProject(id, !isProjectActive));
  };

  submitStatus = e => {
    const { name, employeeId } = this.state;

    e.preventDefault();

    if (name && !employeeId) {
      const employee = this.props.employees.find(e => e.name === name);

      this.setState(
        {
          employeeId: employee.id,
        },
        () => this.doSubmit(),
      );

      return;
    }

    this.doSubmit();
  };

  doSubmit = () => {
    this.props.onSubmit({
      ...this.state,
    });

    this.setState({
      description: '',
    });
  };

  saveProject = (projectId, newProjectState) => {
    const { onSaveProject } = this.props;

    onSaveProject(this.state, this.state.employeeId, projectId, newProjectState);
  };

  isSubmittable = () => {
    return this.state.name && this.props.enabled && this.state.description;
  };

  setFlagged = () => {
    this.setState({ flagged: !this.state.flagged });
  };

  render() {
    const fields = {
      ...this.state,
    };

    const { employees, projects, employeeProjectsSavedNotification, intl } = this.props;

    return (
      <form className={styles.container} onSubmit={e => this.submitStatus(e)}>
        <div className={styles.floatLeft}>
          <select
            disabled={!this.props.enabled}
            ref="name"
            value={fields.name}
            onChange={this.changeEmployee}
          >
            <option value="">
              {intl.messages.statusForm_emptySelection}
            </option>
            {employees.map(employee =>
              <option key={employee.name} value={employee.name}>
                {name(employee.name)}
              </option>,
            )}
          </select>
        </div>
        <div className={styles.control}>
          <div className={styles.label}>
            <FormattedMessage id="statusForm_feeling" defaultMessage="How are you?" />
          </div>
          <div className={styles.buttonGroup}>
            <Button
              type="button"
              disabled={!this.props.enabled}
              onClick={() => this.changeColor(colors.COLOR_DARK_GREEN)}
              active={fields.color === colors.COLOR_DARK_GREEN}
              className="darkgreen"
              title={intl.messages.statusForm_darkGreen}
            >
              <FormattedMessage id="statusForm_darkGreen" defaultMessage="Doing good" /> 😁
            </Button>
            <Button
              type="button"
              disabled={!this.props.enabled}
              onClick={() => this.changeColor(colors.COLOR_GREEN)}
              active={fields.color === colors.COLOR_GREEN}
              className="green"
              title={intl.messages.statusForm_green}
            >
              <FormattedMessage id="statusForm_green" defaultMessage="Okay" /> 😎
            </Button>
            <Button
              type="button"
              disabled={!this.props.enabled}
              onClick={() => this.changeColor(colors.COLOR_YELLOW)}
              active={fields.color === colors.COLOR_YELLOW}
              className="yellow"
              title={intl.messages.statusForm_yellow}
            >
              <FormattedMessage id="statusForm_yellow" defaultMessage="So so" /> 🤔
            </Button>
            <Button
              type="button"
              disabled={!this.props.enabled}
              onClick={() => this.changeColor(colors.COLOR_ORANGE)}
              active={fields.color === colors.COLOR_ORANGE}
              className="orange"
              title={intl.messages.statusForm_orange}
            >
              <FormattedMessage id="statusForm_orange" defaultMessage="Pretty hard" /> 😪
            </Button>
            <Button
              type="button"
              disabled={!this.props.enabled}
              onClick={() => this.changeColor(colors.COLOR_RED)}
              active={fields.color === colors.COLOR_RED}
              className="red"
              title={intl.messages.statusForm_red}
            >
              <FormattedMessage id="statusForm_red" defaultMessage="Not good" /> 😵
            </Button>
          </div>
        </div>
        <div className={styles.control}>
          <div className={styles.label}>
            <FormattedMessage id="statusForm_doing" defaultMessage="Elaborate, please" />
          </div>
          <input
            disabled={!this.props.enabled}
            type="text"
            ref="description"
            className={styles.input}
            value={fields.description}
            onChange={this.changeDescription}
            placeholder={intl.messages.statusForm_whatAreYouDoingPlaceholder}
          />
        </div>
        <div>
          <label>
            <input
              type="checkbox"
              className={styles.checkbox}
              checked={fields.flagged}
              onChange={this.setFlagged}
            />
            <FormattedMessage
              id="statusForm_attention"
              defaultMessage="My situation requires attention"
            />
          </label>
        </div>
        <div className={styles.control}>
          <div className={styles.label}>
            <FormattedMessage
              id="statusForm_projects"
              defaultMessage="Which projects are you participating in?"
            />
            <span className={styles.projectsSaved}>
              {employeeProjectsSavedNotification ? 'Projektit tallennettu!' : ''}
            </span>
          </div>
          <div className={styles.smallButtons}>
            {projects.sort((a, b) => alphabeticalSort(a.name, b.name)).map(project =>
              <Button
                key={project.id}
                onClick={this.toggleActiveProject.bind(this, project.id)}
                active={
                  this.state.activeProjects && this.state.activeProjects.indexOf(project.id) != -1
                }
                title={project.name}
                disabled={project.disabled}
                type="button"
              >
                {project.name}
              </Button>,
            )}
            <AddProjectForm onSubmit={this.props.onAddNewProject} />
          </div>
        </div>

        <Button type="submit" disabled={!this.isSubmittable()} id="submitter" className="orange">
          <FormattedMessage id="statusForm_sendButtonText" defaultMessage="SUBMIT" />
        </Button>
      </form>
    );
  }
}

export default injectIntl(StatusForm);
