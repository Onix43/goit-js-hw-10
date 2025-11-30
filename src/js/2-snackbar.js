import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const form = document.querySelector('.form');

form.addEventListener('submit', e => {
  e.preventDefault();

  let delay = Number(form.elements.delay.value);

  const time = new Promise((resolve, reject) => {
    setTimeout(() => {
      if (form.elements.state.value === 'fulfilled') {
        resolve(`✅ Fulfilled promise in ${delay}ms`);
      } else reject(`❌ Rejected promise in ${delay}ms`);
    }, delay);
  });
  time
    .then(result =>
      iziToast.show({
        message: `${result}`,
        backgroundColor: '#59A10D',
        messageColor: '#ffffff',
        position: 'topRight',
      })
    )
    .catch(err =>
      iziToast.show({
        message: `${err}`,
        backgroundColor: '#EF4040',
        messageColor: '#ffffff',
        position: 'topRight',
      })
    );
});
