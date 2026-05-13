// app.js

const tabs = document.querySelectorAll('.tab');
const wrappers = document.querySelectorAll('.cards-wrapper');

tabs.forEach(tab => {

  tab.addEventListener('click', () => {

    tabs.forEach(btn => {
      btn.classList.remove('active');
    });

    wrappers.forEach(item => {
      item.classList.remove('active');
    });

    tab.classList.add('active');

    const id = tab.dataset.tab;

    document.getElementById(id).classList.add('active');

  });

});

const messages = [
  '🔥 Кто-то только что купил карту $10',
  '⚡ Активирован iCloud 2 ТБ',
  '✅ Новый заказ через Telegram',
  '☁️ Кто-то оплатил iCloud 200 ГБ',
  '💳 Успешная оплата по СБП',
  '🚀 Новый клиент подключил Apple Music'
];

const liveBuy = document.getElementById('liveBuy');

setInterval(() => {

  const random =
    messages[Math.floor(Math.random() * messages.length)];

  liveBuy.style.opacity = '0';

  setTimeout(() => {

    liveBuy.innerText = random;

    liveBuy.style.opacity = '1';

  }, 250);

}, 4000);

const observer = new IntersectionObserver(entries => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {
      entry.target.classList.add('show');
    }

  });

});

document.querySelectorAll('.feature-card, .review, .step')
.forEach(el => {

  el.style.opacity = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = '.6s';

  observer.observe(el);

});

document.querySelectorAll('.feature-card, .review, .step')
.forEach(el => {

  el.classList.add('hidden');

});

const style = document.createElement('style');

style.innerHTML = `
.show {
  opacity: 1 !important;
  transform: translateY(0) !important;
}
`;

document.head.appendChild(style);