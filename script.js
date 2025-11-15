/*
    script.js
    - Controla os elementos `.fish` presentes no `index.html`.
    - Objetivos:
        1) posicionar os peixes aleatoriamente na viewport
        2) mantê-los movendo-se de forma natural (mudanças de direção aleatórias)
        3) reagir ao mouse (fugir quando o mouse se aproxima)
        4) tratar colisões com as bordas da janela
*/

// 1) Seleciona todos os elementos com a classe `.fish` (peixinhos)
const fishes = document.querySelectorAll('.fish');

// Largura/altura do peixe em px (deve corresponder ao tamanho em `styles.css`)
// Usamos constantes para coordenar limites de colisão corretamente.
const FISH_W = 90; // largura do peixe em px (ajustada em styles.css)
const FISH_H = 66; // altura do peixe em px

// Variáveis globais que armazenam a posição atual do mouse
let mouseX = window.innerWidth / 2;
let mouseY = window.innerHeight / 2;

// Atualiza posição do mouse em tempo real (evento utilizado para reação)
document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

// Função auxiliar: clamp (limita valor entre min e max)
function clamp(val, min, max) {
    return Math.max(min, Math.min(max, val));
}

// 2) Inicializa cada peixe: posição aleatória, velocidade inicial e loop de movimento
fishes.forEach((fish, index) => {
    // Posição inicial aleatória dentro da viewport
    let x = Math.random() * (window.innerWidth - FISH_W);
    let y = Math.random() * (window.innerHeight - FISH_H);

    // Velocidade inicial aleatória (mais energia = movimentos mais rápidos)
    let vx = (Math.random() - 0.5) * 4; // px por frame (xis)
    let vy = (Math.random() - 0.5) * 4; // px por frame (y)

    // Temporizador para mudança de direção aleatória (em frames)
    let changeDirectionTimer = Math.random() * 120 + 60; // 60-180 frames
    let directionChangeCounter = 0;

    // Aplica propriedades iniciais ao elemento DOM
    fish.style.position = 'fixed';
    fish.style.left = x + 'px';
    fish.style.top = y + 'px';
    fish.style.pointerEvents = 'none'; // não bloqueia interações do usuário

    // LOOP de movimento: executado via requestAnimationFrame
    function moveFish() {
        // ===== FUNÇÃO 1: movimento aleatório com mudanças de direção =====
        directionChangeCounter++;
        if (directionChangeCounter >= changeDirectionTimer) {
            // Escolhe um novo vetor direcional aleatório
            const angle = Math.random() * Math.PI * 2;
            const speed = Math.random() * 3 + 2; // velocidade entre 2 e 5 px/frame
            vx = Math.cos(angle) * speed;
            vy = Math.sin(angle) * speed;

            // Reseta contador e escolhe novo intervalo para próxima mudança
            directionChangeCounter = 0;
            changeDirectionTimer = Math.random() * 150 + 60; // 60-210 frames
        }

        // ===== FUNÇÃO 2: reação ao mouse (fuga) =====
        // Calcula distância até o mouse
        const dx = x - mouseX;
        const dy = y - mouseY;
        const distance = Math.sqrt(dx * dx + dy * dy);
        const detectionRadius = 120; // raio em px onde o peixe detecta o mouse

        if (distance < detectionRadius) {
            // Calcula vetor de escape (direção oposta ao mouse)
            const angle = Math.atan2(dy, dx);
            const escapeForce = (detectionRadius - distance) / detectionRadius * 3; // intensidade da fuga
            vx += Math.cos(angle) * escapeForce;
            vy += Math.sin(angle) * escapeForce;
        }

        // ===== Aplica movimentos e amortecimento =====
        x += vx;
        y += vy;
        vx *= 0.98; // leve amortecimento para evitar acúmulo excessivo de velocidade
        vy *= 0.98;

        // ===== FUNÇÃO 3: colisão com bordas (rebate) =====
        // Usamos FISH_W / FISH_H para que o peixe não "vaze" para fora da viewport
        if (x <= 0 || x >= window.innerWidth - FISH_W) {
            vx *= -1; // inverte direção horizontal
            x = clamp(x, 0, window.innerWidth - FISH_W);
        }
        if (y <= 0 || y >= window.innerHeight - FISH_H) {
            vy *= -1; // inverte direção vertical
            y = clamp(y, 0, window.innerHeight - FISH_H);
        }

        // Atualiza posição no DOM
        fish.style.left = x + 'px';
        fish.style.top = y + 'px';

        // Próximo frame
        requestAnimationFrame(moveFish);
    }

    // Inicia o movimento para este peixe
    moveFish();
});