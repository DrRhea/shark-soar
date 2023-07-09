let moveSpeed = 3,
  gravity = 0.5;
let shark = document.querySelector('.shark');
let img = document.getElementById('shark-1');

let explosionAudio = document.getElementById('explosion-audio');
explosionAudio.addEventListener('canplaythrough', () => {
  explosionAudio.play();
});


let sharkProps = shark.getBoundingClientRect();

let background = document.querySelector('.background').getBoundingClientRect();
let scoreValue = document.querySelector('.score-value');
let message = document.querySelector('.message');
let scoreTitle = document.querySelector('.score-title');

let gameState = 'Start';
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
  if ((e.key === ' ' || e.key === 'Spacebar') && gameState !== 'Play') {
    document.querySelectorAll('.seaMines').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    shark.style.top = '40vh';
    gameState = 'Play';
    message.innerHTML = '';
    scoreTitle.innerHTML = 'Score';
    scoreValue.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
});

document.addEventListener('touchstart', handleTouch);
document.addEventListener('keydown', handleInput);

function handleTouch(event) {
  if (gameState !== 'Play') {
    document.querySelectorAll('.seaMines').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    shark.style.top = '40vh';
    gameState = 'Play';
    message.innerHTML = '';
    scoreTitle.innerHTML = 'Score';
    scoreValue.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
  event.preventDefault(); // Menghindari refresh otomatis pada perangkat mobile
}

function handleInput(event) {
  if ((event.key === ' ' || event.key === 'Spacebar') && gameState !== 'Play') {
    document.querySelectorAll('.seaMines').forEach((e) => {
      e.remove();
    });
    img.style.display = 'block';
    shark.style.top = '40vh';
    gameState = 'Play';
    message.innerHTML = '';
    scoreTitle.innerHTML = 'Score';
    scoreValue.innerHTML = '0';
    message.classList.remove('messageStyle');
    play();
  }
}

function play() {
  let currentScore = 0; // Menambahkan variabel untuk melacak score saat ini

  function move() {
    if (gameState !== 'Play') return;

    let seaMines = document.querySelectorAll('.seaMines');
    seaMines.forEach((element) => {
      let seaMinesProps = element.getBoundingClientRect();
      let sharkProps = shark.getBoundingClientRect();

      if (seaMinesProps.right <= 0) {
        element.remove();
      } else {
        if (
          (sharkProps.left < seaMinesProps.left + seaMinesProps.width &&
            sharkProps.left + sharkProps.width > seaMinesProps.left &&
            sharkProps.top < seaMinesProps.top + seaMinesProps.height &&
            sharkProps.top + sharkProps.height > seaMinesProps.top) ||
          (sharkProps.left < seaMinesProps.left + seaMinesProps.width &&
            sharkProps.left + sharkProps.width > seaMinesProps.left &&
            sharkProps.top < seaMinesProps.bottom &&
            sharkProps.top + sharkProps.height > seaMinesProps.bottom)
        ) {
          element.style.backgroundImage = "url('../img/seaMinesExplodes.gif')";
          element.style.backgroundSize = "contain";
          element.style.backgroundRepeat = "repeat-y";

          let explosionAudio = document.getElementById('explosion-audio');
          explosionAudio.play();

          setTimeout(() => {
            element.remove(); // Menghapus seaMines setelah beberapa waktu
          }, 1000);

          gameState = 'End';
          message.innerHTML =
            'Game Over'.fontcolor('black') +
            '<br> <br>Press Spacebar <br>or<br> Tap the Screen <br><br> To Restart';
          message.classList.add('messageStyle');
          img.style.display = 'none';
          return;
        } else {
          if (seaMinesProps.right < sharkProps.left && seaMinesProps.right + moveSpeed >= sharkProps.left && element.increaseScore === '1') {
            scoreValue.innerHTML = +scoreValue.innerHTML + 1;
            currentScore++; // Menambahkan 1 pada score saat ini
            if (currentScore % 10 === 0) { // Memeriksa apakah score adalah kelipatan 10
              moveSpeed += 1; // Menambahkan 1 pada moveSpeed setiap 10 score
            }
          }
          element.style.left = seaMinesProps.left - moveSpeed + 'px';
        }

      }
    });
    requestAnimationFrame(move);
  }

  requestAnimationFrame(move);

  let sharkDy = 0;

  function applyGravity() {
    if (gameState != 'Play') return;
    sharkDy = sharkDy + gravity;
    document.addEventListener('touchstart', handleTouch);
    document.addEventListener('keydown', handleInput);

    function handleTouch() {
      sharkDy = -7.6;
    }

    function handleInput(event) {
      if (event.key === ' ' || event.key === 'Spacebar') {
        sharkDy = -7.6;
      }
    }

    if (sharkProps.top <= 0 || sharkProps.bottom >= background.bottom) {
      gameState = 'End';
      message.style.left = '28vw';
      window.location.reload();
      message.classList.remove('messageStyle');
      return;
    }
    shark.style.top = sharkProps.top + sharkDy + 'px';
    sharkProps = shark.getBoundingClientRect();
    requestAnimationFrame(applyGravity);
  }
  requestAnimationFrame(applyGravity);

  let seaMinesSeperation = 0;

  function createSeaMines() {
    if (gameState !== 'Play') return;

    if (seaMinesSeperation > 115) {
      seaMinesSeperation = -50;
      let seaMinesGap = 35;

      let seaMinesHeight = Math.floor(Math.random() * 30) + 10; // Tinggi acak untuk seaMines
      let seaMinesTop = 0; // Top position untuk seaMines atas
      let seaMinesBottom = seaMinesHeight + seaMinesGap; // Top position untuk seaMines bawah

      let seaMinesTopElement = document.createElement('div');
      seaMinesTopElement.className = 'seaMines';
      seaMinesTopElement.style.height = seaMinesHeight + 'vh';
      seaMinesTopElement.style.top = seaMinesTop + 'vh';
      seaMinesTopElement.style.left = '100vw';

      let seaMinesBottomElement = document.createElement('div');
      seaMinesBottomElement.className = 'seaMines';
      seaMinesBottomElement.style.height = 'calc(100vh - ' + seaMinesBottom + 'vh)'; // Mengatur tinggi seaMines bawah
      seaMinesBottomElement.style.top = seaMinesBottom + 'vh';
      seaMinesBottomElement.style.left = '100vw';
      seaMinesBottomElement.increaseScore = '1';

      document.body.appendChild(seaMinesTopElement);
      document.body.appendChild(seaMinesBottomElement);
    }
    seaMinesSeperation++;
    requestAnimationFrame(createSeaMines);
  }
  requestAnimationFrame(createSeaMines);
}


document.addEventListener('contextmenu', function (e) {
  e.preventDefault();
});