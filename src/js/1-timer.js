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
      iziToast.show({
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

      const timeLeft = selected - dateNow;
      time = convertMs(timeLeft);

      timerDays.textContent = addLeadingZero(time.days);
      timerHours.textContent = addLeadingZero(time.hours);
      timerMinutes.textContent = addLeadingZero(time.minutes);
      timerSeconds.textContent = addLeadingZero(time.seconds);
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
  const int = setInterval(() => {
    let { days, hours, minutes, seconds } = time;

    if (days === 0 && hours === 0 && minutes === 0 && seconds === 0) {
      clearInterval(int);
      input.disabled = false;
      return;
    }

    if (seconds > 0) {
      seconds -= 1;
    } else {
      seconds = 59;
      if (minutes > 0) {
        minutes -= 1;
      } else {
        minutes = 59;
        if (hours > 0) {
          hours -= 1;
        } else {
          hours = 23;
          if (days > 0) {
            days -= 1;
          }
        }
      }
    }

    time = { days, hours, minutes, seconds };

    timerDays.textContent = addLeadingZero(days);
    timerHours.textContent = addLeadingZero(hours);
    timerMinutes.textContent = addLeadingZero(minutes);
    timerSeconds.textContent = addLeadingZero(seconds);
  }, 1000);

  button.disabled = true;
  input.disabled = true;
});
