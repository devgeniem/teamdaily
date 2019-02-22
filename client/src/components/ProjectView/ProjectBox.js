import React, { Component } from 'react';
import styles from './style.pcss';
import peopleStyles from '../PeopleView/style.pcss';
import classnames from 'classnames';

import ProjectColor from './ProjectColor';
import ProjectMessage from './ProjectMessage';

export default class ProjectBox extends Component {
  render() {
    const { project, entries, saveProjectColor, saveProjectMessage, handleClick } = this.props;

    const doClick = (e) => {
      if (e.target.className.indexOf("target") < 0) {
        return;
      }
      handleClick && handleClick(project);
    }

    return (
      <div className={classnames([peopleStyles.masonryCard, 'target'])} onClick={doClick}>
        <div className={classnames(styles.cardHeader, project.color, 'target')}  />

        <div className={classnames(styles.card, 'target')}>
          <h4 className={classnames(styles.projectTitle, 'target')}>
            {project.name}
          </h4>
          <ProjectColor color={project.color} saveProjectColor={saveProjectColor} />
          <ProjectMessage message={project.message} saveProjectMessage={saveProjectMessage} />

          <br />

          {project.employees.map(e => {
            const entry = entries.filter(entry => entry.name === e.name);
            const latestEntry = entry ? entry.get(-1) : null;
            const color = latestEntry ? latestEntry.color : 'empty';

            return (
              <span key={`${project.id}-${e.name}`} className={`${styles.employee} ${color} target`}>
                {e.name}
              </span>
            );
          })}
        </div>
      </div>
    );
  }
}
