import flatpickr from 'flatpickr';
import iziToast from 'izitoast';
import 'flatpickr/dist/flatpickr.min.css';
import 'izitoast/dist/css/iziToast.min.css';

const button = document.querySelector('[data-start]');
const input = document.querySelector('#datetime-picker');

const timerDays = document.querySelector('[data-days]');
const timerHours = document.querySelector('[data-hours]');
const timerMinutes = document.querySelector('[data-minutes]');
const timerSeconds = document.querySelector('[data-seconds]');

let userSelectedDate;

let time = null;
let timerId = null;
button.disabled = true;

const options = {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    console.log(selectedDates[0]);
    userSelectedDate = selectedDates[0];

    const dateNow = Date.now();
    const selected = userSelectedDate.getTime();

    if (dateNow > selected) {
      iziToast.error({
        title: 'Error',
        message: 'Illegal operation',
        // icon: "",
        // iconColor: `white`,
        backgroundColor: '#EF4040',
        titleColor: '#FFFFFF',
        titleSize: `16px`,
        titleLineHeight: '1.5',
        messageColor: '#FFFFFF',
        messageSize: `16px`,
        messageLineHeight: '1.5',
        position: 'topRight',
      });
      button.disabled = true;
    }
    if (dateNow < selected) {
      button.disabled = false;
    }
  },
};

flatpickr(`#datetime-picker`, options);

function addLeadingZero(value) {
  return String(value).padStart(2, '0');
}

function convertMs(ms) {
  // Number of milliseconds per unit of time
  const second = 1000;
  const minute = second * 60;
  const hour = minute * 60;
  const day = hour * 24;

  // Remaining days
  const days = Math.floor(ms / day);
  // Remaining hours
  const hours = Math.floor((ms % day) / hour);
  // Remaining minutes
  const minutes = Math.floor(((ms % day) % hour) / minute);
  // Remaining seconds
  const seconds = Math.floor((((ms % day) % hour) % minute) / second);

  return { days, hours, minutes, seconds };
}
button.addEventListener('click', () => {
  button.disabled = true;
  input.disabled = true;

  const startTimer = () => {
    const now = Date.now();
    const timeLeft = userSelectedDate - now;

    if (timeLeft <= 0) {
      clearInterval(timerId);
      timerDays.textContent = addLeadingZero(0);
      timerHours.textContent = addLeadingZero(0);
      timerMinutes.textContent = addLeadingZero(0);
      timerSeconds.textContent = addLeadingZero(0);
      input.disabled = false;
      return;
    }
    const { days, hours, minutes, seconds } = convertMs(timeLeft);
    timerDays.textContent = addLeadingZero(days);
    timerHours.textContent = addLeadingZero(hours);
    timerMinutes.textContent = addLeadingZero(minutes);
    timerSeconds.textContent = addLeadingZero(seconds);
  };

  startTimer();
  timerId = setInterval(startTimer, 1000);
});
