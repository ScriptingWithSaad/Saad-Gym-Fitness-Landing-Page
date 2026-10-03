'use strict';
document.documentElement.classList.add('js');

const menu = document.querySelector('.menu-toggle');
const nav = document.querySelector('#navigation');
function closeMenu(returnFocus = false) {
  nav.dataset.open = 'false';
  menu.setAttribute('aria-expanded', 'false');
  if (returnFocus) menu.focus();
}
menu.addEventListener('click', () => {
  const open = menu.getAttribute('aria-expanded') !== 'true';
  menu.setAttribute('aria-expanded', String(open));
  nav.dataset.open = String(open);
});
nav.addEventListener('click', event => {
  const link = event.target.closest('a');
  if (!link) return;
  const wasOpen = nav.dataset.open === 'true';
  closeMenu();
  if (wasOpen) {
    const section = document.querySelector(link.getAttribute('href'));
    section.tabIndex = -1;
    section.focus({ preventScroll: true });
  }
});
document.addEventListener('click', event => {
  if (!event.target.closest('.site-header')) closeMenu();
});
document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && nav.dataset.open === 'true') closeMenu(true);
});
window.matchMedia('(min-width:901px)').addEventListener('change', () => closeMenu());

const training = {
  strength: {
    title: 'Strength training',
    description: 'Explore resistance training with free weights, machines and bodyweight movements. Talk through your experience and goals to find a useful starting point.',
    alt: 'Athlete lifting a barbell',
    heading: 'Movements to explore',
    movements: ['Barbell row', 'Bench press', 'Deadlift', 'Incline dumbbell press', 'Leg press', 'Lunge', 'Pull-ups', 'Push-ups'],
  },
  conditioning: {
    title: 'Cardio & conditioning',
    description: 'Explore training that gets you moving and helps you build a regular exercise habit. Ask about available options and the right starting intensity for you.',
    alt: 'Runner outdoors',
    heading: 'Talk to us about',
    movements: ['Cardio sessions', 'Jogging and endurance', 'Combining cardio with strength training'],
  },
  mobility: {
    title: 'Mobility & balance',
    description: 'Explore flexibility, balance and controlled movement. Ask about available sessions and how mobility can fit into your wider training routine.',
    alt: 'Person stretching on a yoga mat',
    heading: 'Movements to explore',
    movements: ['Yoga', 'Bird-dog plank', 'Controlled mobility and balance work'],
  },
};

const dialog = document.querySelector('#training-dialog');
let selectedTraining;
let opener;
let savedScroll = null;
function updateDialogViewport() {
  const viewport = window.visualViewport;
  const style = document.documentElement.style;
  style.setProperty('--dialog-height', `${viewport?.height || innerHeight}px`);
  style.setProperty('--dialog-width', `${viewport?.width || innerWidth}px`);
  style.setProperty('--dialog-top', `${viewport?.offsetTop || 0}px`);
}
function unlockPage() {
  if (savedScroll === null) return;
  const y = savedScroll;
  savedScroll = null;
  document.body.classList.remove('dialog-locked');
  document.body.style.removeProperty('--page-scroll');
  const oldBehavior = document.documentElement.style.scrollBehavior;
  document.documentElement.style.scrollBehavior = 'auto';
  window.scrollTo(0, y);
  document.documentElement.style.scrollBehavior = oldBehavior;
  opener?.focus({ preventScroll: true });
}
document.querySelectorAll('[data-training]').forEach(button => {
  button.addEventListener('click', () => {
    selectedTraining = button.dataset.training;
    const info = training[selectedTraining];
    opener = button;
    document.querySelector('#dialog-title').textContent = info.title;
    document.querySelector('#dialog-description').textContent = info.description;
    document.querySelector('#dialog-list-title').textContent = info.heading;
    const image = document.querySelector('#dialog-image');
    image.src = `assets/optimized/${selectedTraining}-800.webp`;
    image.alt = info.alt;
    document.querySelector('#dialog-movements').replaceChildren(...info.movements.map(text => {
      const li = document.createElement('li');
      li.textContent = text;
      return li;
    }));
    if (typeof dialog.showModal !== 'function') {
      chooseTraining(info.title);
      return;
    }
    savedScroll = scrollY;
    document.body.style.setProperty('--page-scroll', `${-savedScroll}px`);
    document.body.classList.add('dialog-locked');
    updateDialogViewport();
    dialog.showModal();
    dialog.scrollTop = 0;
  });
});
dialog.querySelector('.dialog-close').addEventListener('click', () => dialog.close());
dialog.addEventListener('close', unlockPage);
dialog.addEventListener('click', event => {
  if (event.target !== dialog) return;
  const box = dialog.getBoundingClientRect();
  if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) dialog.close();
});
window.addEventListener('resize', updateDialogViewport);
window.visualViewport?.addEventListener('resize', updateDialogViewport);
window.visualViewport?.addEventListener('scroll', updateDialogViewport);
updateDialogViewport();

const form = document.querySelector('#enquiry-form');
const result = document.querySelector('#enquiry-result');
const focusSelect = document.querySelector('#enquiry-focus');
function chooseTraining(title) {
  form.hidden = false;
  result.hidden = true;
  focusSelect.value = title;
  document.querySelector('#contact').scrollIntoView({ block: 'start' });
  focusSelect.focus({ preventScroll: true });
}
document.querySelector('#dialog-enquire').addEventListener('click', () => {
  const title = training[selectedTraining].title;
  dialog.close();
  unlockPage();
  chooseTraining(title);
});
form.addEventListener('submit', event => {
  event.preventDefault();
  const name = document.querySelector('#enquiry-name').value.trim();
  const note = document.querySelector('#enquiry-note').value.trim();
  document.querySelector('#enquiry-draft').value = `Hi Saad Gym Fitness!${name ? ` My name is ${name}.` : ''}\n\nI'm interested in ${focusSelect.value.toLowerCase()}.${note ? `\n\n${note}` : ''}\n\nCould you share your current session options, location, timings and fees?`;
  document.querySelector('#copy-status').textContent = '';
  form.hidden = true;
  result.hidden = false;
  document.querySelector('#enquiry-draft').focus({ preventScroll: true });
  result.scrollIntoView({ block: 'nearest' });
});
document.querySelector('#edit-enquiry').addEventListener('click', () => {
  form.hidden = false;
  result.hidden = true;
  focusSelect.focus({ preventScroll: true });
  form.scrollIntoView({ block: 'nearest' });
});
document.querySelector('#copy-message').addEventListener('click', async () => {
  const draft = document.querySelector('#enquiry-draft');
  const status = document.querySelector('#copy-status');
  try {
    await navigator.clipboard.writeText(draft.value);
    status.textContent = 'Copied. Open a profile below and paste your message.';
  } catch {
    draft.focus();
    draft.select();
    status.textContent = 'Select and copy the message above, then paste it into Instagram or Facebook.';
  }
});
document.querySelector('#year').textContent = new Date().getFullYear();
