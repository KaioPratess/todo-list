import creator from './creator.js';
import events from './pubSub.js';
import project from './project.js';
import task from './task.js';

const dom = (function () {
  const select = {
    pageStructure: document.querySelector('.page-structure'),
    addTaskBtn: document.querySelector('.add-task'),
    notificationBtn: document.querySelector('.notification'),
    themeChangeBtn: document.querySelector('.theme'),
    configBtn: document.querySelector('.config'),
    inboxBtn: document.querySelector('.inbox-btn'),
    todayBtn: document.querySelector('.today-btn'),
    doneBtn: document.querySelector('.done-btn'),
    projectsSec: document.querySelector('.projects'),
    projectList: document.querySelector('.project-list'),
    addProjectBtn: document.querySelector('.add-project'),
    tasksContainer: document.querySelector('.tasks-container'),
    headSec: document.querySelector('.head-sec'),
    dateWrapper: document.querySelector('.date-wrapper'),
    arrowBackward: document.querySelector('.arrow-backward'),
    arrowForward: document.querySelector('.arrow-forward'),
    date: document.querySelector('.date'),
    details: document.querySelector('.details-project-task'),
    title: document.querySelector('.title'),
    descriptionInput: document.querySelector('#description'),
    deadlineInput: document.querySelector('#deadline'),
    priorityInput: document.querySelector('#priority'),
    isFinishedInput: document.querySelector('#finished'),
    notesInput: document.querySelector('#notes'),
    sun: document.querySelector('.sun'),
    moon: document.querySelector('.moon'),
    bin: document.querySelector('.bin'),
    checklistBtn: document.querySelector('.checklist-btn'),
    checklistDiv: document.querySelector('.checklist'),
    creatorProp: document.querySelector('.creator-properties'),
  }

  function appendTasks(title, priority, project, append) {
    const wrapper = document.createElement('div');
    const taskTitle = document.createElement('div');
    const para = document.createElement('p');
    const projectTitle = document.createElement('span');
    const circle = document.createElement('div');

    wrapper.classList.add('task');
    taskTitle.classList.add('task-title');

    para.textContent = title;
    projectTitle.textContent = project;
    circle.classList.add('priority-icon', 'low');

    switch(priority) {
      case 'moderate':
        circle.classList.add('moderate')
        break;
      case 'high':
        circle.classList.add('high')
    }

    taskTitle.append(circle, para);
    wrapper.append(taskTitle, projectTitle);
    append.appendChild(wrapper);

    events.publish('taskWrapper', wrapper);
    creator.creator.creatorBg.remove();
  }

  function appendProject(title, dueDate) {
    const wrapper = document.createElement('div');
    const projectTitle = document.createElement('p');
    const deadline = document.createElement('span');

    projectTitle.textContent = title;
    deadline.textContent = dueDate;
    wrapper.classList.add('project');
    projectTitle.classList.add('project-title');
    deadline.classList.add('project-deadline');

    wrapper.append(projectTitle, deadline);
    select.projectList.append(wrapper);
    creator.creator.creatorBg.remove();

    events.publish('getWrapper', wrapper);
  }
  
  function openProjectTask(title, description, deadline, priority, notes, isComplete) {
    select.headSec.textContent = '';
    select.details.style.display = 'block';

    select.tasksContainer.textContent = '';

    select.descriptionInput.value = description;
    select.deadlineInput.value = deadline;
    select.priorityInput.value = priority;
    select.notesInput.value = notes;
    select.isFinishedInput.checked = isComplete;

    select.title.textContent = title;
    select.headSec.append(select.details);
  }

  function appendInbox() {
    select.headSec.textContent = '';
    const inboxTitle = document.createElement('h1');
          inboxTitle.classList.add('inbox-title');
          inboxTitle.textContent = 'Inbox';
    select.headSec.append(inboxTitle);
  }

  function appendDone() {
    dom.select.tasksContainer.style.display = 'block';
    dom.select.checklistDiv.style.display = 'none';
    select.headSec.textContent = '';
    const doneTitle = document.createElement('h1');
          doneTitle.classList.add('done-title');
          doneTitle.textContent = 'Done';
    select.headSec.append(doneTitle);
  }

  select.themeChangeBtn.addEventListener('click', () => {
    select.pageStructure.classList.toggle('dark');
    select.pageStructure.classList.toggle('light');
    saveToLocalStorage();

    select.sun.classList.toggle('active');
    select.moon.classList.toggle('active');
  });

  function saveToLocalStorage() {
    localStorage.setItem('theme', select.pageStructure.classList[1]);
  }

  function retrieveFromLocalStorage() {
    const theme = localStorage.getItem('theme');
    if(theme !== null) {
      if(select.pageStructure.classList[1] === 'dark') {
        select.pageStructure.classList.replace('dark', theme);
      } else if(select.pageStructure.classList[1] === 'light') {
          select.pageStructure.classList.replace('light', theme);
      }
  }
  }

  window.addEventListener('load', () => {
    retrieveFromLocalStorage();
  })

  events.subscribe('openTask', events.events, () => {
    select.descriptionInput.addEventListener('change', task.editDescription);
    select.deadlineInput.addEventListener('change', task.editDeadline);
    select.priorityInput.addEventListener('change', task.editPriority);
    select.notesInput.addEventListener('change', task.editNotes);
    select.isFinishedInput.addEventListener('change', task.checkFinish);
    select.bin.addEventListener('click', task.deleteTask);
  });

  events.subscribe('openProject', events.events, () => {
    select.descriptionInput.addEventListener('change', project.editDescription);
    select.deadlineInput.addEventListener('change', project.editDeadline);
    select.priorityInput.addEventListener('change', project.editPriority);
    select.notesInput.addEventListener('change', project.editNotes);
    select.isFinishedInput.addEventListener('change', project.checkFinish);
    select.bin.addEventListener('click', project.deleteProject);
  });

  function createLine(container) {
    const div = document.createElement('div');
          div.classList.add('line-bg');
    const line = document.createElement('div');
          line.classList.add('line');

    div.append(line);
    container.append(div);
  }

  return {
    select,
    appendTasks,
    appendProject,
    openProjectTask,
    appendInbox,
    appendDone,
    createLine
  }
})();

export default dom;