let move_speed = 3, gravity = 0.5, max_speed = 6, gravity_increase_rate = 0.05;
let bird = document.querySelector('.bird');
let img = document.getElementById('bird-1');
let sound_point = new Audio('sounds effect/point.mp3');
let sound_die = new Audio('sounds effect/die.mp3');
let sound_background = new Audio('sounds effect/background.mp3');
let sound_speedup = new Audio('sounds effect/speedup.mp3'); // New sound for speed up

// getting bird element properties
let bird_props = bird.getBoundingClientRect();
let background = document.querySelector('.background').getBoundingClientRect();

let score_val = document.querySelector('.score_val');
let message = document.querySelector('.message');
let score_title = document.querySelector('.score_title');
let timer_val = document.querySelector('.timer_val');
let timer; // Variable to hold the timer interval
let game_state = 'Start';
let paused = false; // To control pause state
img.style.display = 'none';
message.classList.add('messageStyle');

document.addEventListener('keydown', (e) => {
    if (e.key == 'Enter' && game_state != 'Play') {
        resetGame();
        play();
    } else if (e.key == 'p') {
        togglePause(); // Toggle pause when 'p' is pressed
    }
});

function resetGame() {
    document.querySelectorAll('.pipe_sprite').forEach((e) => {
        e.remove();
    });
    img.style.display = 'block';
    bird.style.top = '40vh';
    game_state = 'Play';
    paused = false;
    message.innerHTML = '';
    score_title.innerHTML = 'Score : ';
    score_val.innerHTML = '0';
    timer_val.innerHTML = '60'; // Reset timer to 60 seconds
    message.classList.remove('messageStyle');
    move_speed = 3; // Reset speed
}

function togglePause() {
    if (game_state === 'Play') {
        paused = !paused;
        if (paused) {
            message.innerHTML = 'Paused<br>Press P to Resume';
            message.classList.add('messageStyle');
            clearInterval(timer); // Pause timer
        } else {
            message.innerHTML = '';
            message.classList.remove('messageStyle');
            play(); // Resume game
        }
    }
}

function play() {
    // Start the timer
    timer = setInterval(() => {
        if (!paused && game_state === 'Play') {
            let current_time = parseInt(timer_val.innerHTML);
            if (current_time > 0) {
                timer_val.innerHTML = current_time - 1;
            } else {
                endGame('Time Up! Game Over<br>Press Enter To Restart');
            }
        }
    }, 1000);

    function move() {
        if (game_state != 'Play' || paused) return;

        let pipe_sprite = document.querySelectorAll('.pipe_sprite');
        pipe_sprite.forEach((element) => {
            let pipe_sprite_props = element.getBoundingClientRect();
            bird_props = bird.getBoundingClientRect();

            if (pipe_sprite_props.right <= 0) {
                element.remove();
            } else {
                if (collision(bird_props, pipe_sprite_props)) {
                    endGame('Game Over<br>Press Enter To Restart');
                    sound_die.play();
                    return;
                } else {
                    if (passedPipe(bird_props, pipe_sprite_props, element)) {
                        score_val.innerHTML = parseInt(score_val.innerHTML) + 1; // Increment score
                        sound_point.play();
                        adjustDifficulty(); // Increase speed and gravity with score
                    }
                    element.style.left = pipe_sprite_props.left - move_speed + 'px';
                }
            }
        });
        requestAnimationFrame(move);
    }
    requestAnimationFrame(move);

    let bird_dy = 0;
    function apply_gravity() {
        if (game_state != 'Play' || paused) return;
        bird_dy += gravity;
        document.addEventListener('keydown', (e) => {
            if ((e.key == 'ArrowUp' || e.key == ' ') && !paused) {
                img.src = 'images/Bird-2.png';
                bird_dy = -7.6; // Jump action
            }
        });

        document.addEventListener('keyup', (e) => {
            if ((e.key == 'ArrowUp' || e.key == ' ') && !paused) {
                img.src = 'images/Bird.png';
            }
        });

        if (bird_props.top <= 0 || bird_props.bottom >= background.bottom) {
            endGame('Game Over<br>Press Enter To Restart');
            return;
        }
        bird.style.top = bird_props.top + bird_dy + 'px';
        bird_props = bird.getBoundingClientRect();
        requestAnimationFrame(apply_gravity);
    }
    requestAnimationFrame(apply_gravity);

    let pipe_separation = 0;
    let pipe_gap = 35;

    function create_pipe() {
        if (game_state != 'Play' || paused) return;

        if (pipe_separation > 115) {
            pipe_separation = 0;

            let pipe_posi = Math.floor(Math.random() * 43) + 8;
            let pipe_sprite_inv = document.createElement('div');
            pipe_sprite_inv.className = 'pipe_sprite';
            pipe_sprite_inv.style.top = pipe_posi - 70 + 'vh';
            pipe_sprite_inv.style.left = '100vw';

            document.body.appendChild(pipe_sprite_inv);
            let pipe_sprite = document.createElement('div');
            pipe_sprite.className = 'pipe_sprite';
            pipe_sprite.style.top = pipe_posi + pipe_gap + 'vh';
            pipe_sprite.style.left = '100vw';
            pipe_sprite.increase_score = '1';

            document.body.appendChild(pipe_sprite);
        }
        pipe_separation++;
        requestAnimationFrame(create_pipe);
    }
    requestAnimationFrame(create_pipe);
}

function collision(bird_props, pipe_props) {
    return bird_props.left < pipe_props.left + pipe_props.width &&
        bird_props.left + bird_props.width > pipe_props.left &&
        bird_props.top < pipe_props.top + pipe_props.height &&
        bird_props.top + bird_props.height > pipe_props.top;
}

function passedPipe(bird_props, pipe_props, element) {
    return pipe_props.right < bird_props.left &&
        pipe_props.right + move_speed >= bird_props.left &&
        element.increase_score == '1';
}

function adjustDifficulty() {
    if (parseInt(score_val.innerHTML) % 5 === 0 && move_speed < max_speed) {
        move_speed += 0.5;
        gravity += gravity_increase_rate;
        sound_speedup.play(); // Play sound on speed increase
    }
}

function endGame(message_text) {
    game_state = 'End';
    message.innerHTML = message_text;
    message.classList.add('messageStyle');
    img.style.display = 'none';
    clearInterval(timer); // Stop the timer
    paused = false; // Reset pause state
}
