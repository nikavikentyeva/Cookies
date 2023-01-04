const inputs = document.querySelectorAll('input');
const cookieForm = document.querySelector('form');
const toastsContainer = document.querySelector('.toasts-container');
const cookiesList = document.querySelector('.cookies-list');
const displayCookieBtn = document.querySelector('.display-cookie-btn');
const infoTxt = document.querySelector('.info-txt');

inputs.forEach(input => {
  input.addEventListener('invalid', handleValidation);
  input.addEventListener('input', handleValidation);
})

function handleValidation (e) {
  if (e.type === 'invalid') {
    e.target.setCustomValidity('This field can\'t be empty');
    return;
  }
  e.target.setCustomValidity('');
}

cookieForm.addEventListener('submit', handleForm);

function handleForm (e) {
  e.preventDefault();

  let newCookie = {}

  inputs.forEach(input => {
    const nameAttribute = input.getAttribute('name');
    newCookie[nameAttribute] = input.value;
  })
  // the time in ms of a week: 7 days * 24h * 60min * 60s * 1000ms
  newCookie.expires = new Date(new Date().getTime() + 7 * 24 * 60 * 60 * 1000)
  cookieForm.reset()
  createCookie(newCookie)
}

function createCookie(newCookie) {
  if (doesCookieExist(newCookie.name)) {
    createToast({name: newCookie.name, state: 'modified', color: 'orangered'})
  } else {
    createToast({name: newCookie.name, state: 'created', color: 'green'})
  }
  document.cookie = `${encodeURIComponent(newCookie.name)}=${encodeURIComponent(newCookie.value)};expires=${newCookie.expires.toUTCString()}`

  if (cookiesList.children.length) {
    displayCookies()
  }
}

function doesCookieExist(name) {
  const cookies = document.cookie.replace(/\s/g,'').split(';');
  const onlyCookiesName = cookies.map(cookie => cookie.split('=')[0]);
  return onlyCookiesName.find(cookie => cookie === encodeURIComponent(name));
}

function createToast ({name, state, color}) {
  const toastInfo = document.createElement('p');

  toastInfo.className = 'toast';
  toastInfo.textContent = `Cookie ${name} ${state}.`;
  toastInfo.style.backgroundColor = color;
  toastsContainer.appendChild(toastInfo);

  setTimeout(() => {
    toastInfo.remove()
  }, 2500)
}

displayCookieBtn.addEventListener('click', displayCookies)

let lock = false;

function displayCookies () {
  if (cookiesList.children.length) {
    cookiesList.textContent = '';
  }
  const cookies = document.cookie.replace(/\s/g,'').split(';').reverse()

  if (!cookies[0]) {
    if (lock) return;

    lock = true;
    infoTxt.textContent = 'Cookies not found, create them';

    setTimeout(() => {
      infoTxt.textContent = '';
      lock = false
    },1500);
    return;
  }

  createElements(cookies);
}

function createElements (cookies) {

  cookies.forEach(cookie => {
    const formatCookie = cookie.split('=');
    const listItem = document.createElement('li');
    const name = decodeURIComponent(formatCookie[0]);

    listItem.innerHTML = `
      <p>
        <span>Name</span> : ${name}
      </p>
      <p>
        <span>Value</span> : ${decodeURIComponent(formatCookie[1])}
      </p>
      <button>X</button>
    `
    listItem.querySelector('button').addEventListener('click', e => {
      createToast({name: name, state: 'removed', color: 'crimson'})
      document.cookie = `${name}=; expires=${new Date(0)}`
      e.target.parentElement.remove()
    })
    cookiesList.appendChild(listItem)

  })
}
