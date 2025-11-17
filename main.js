// --- 1. Acessibilidade (ARIA) e Lógica de Abas Refatorada ---
const botoes = document.querySelectorAll(".botao");
const conteudos = document.querySelectorAll(".aba-conteudo");

function desativaBotoesEConteudo() {
    botoes.forEach(botao => {
        botao.classList.remove("ativo");
        // Remove a seleção ARIA e define tabindex para desabilitar foco via teclado
        botao.setAttribute("aria-selected", "false"); 
        botao.setAttribute("tabindex", "-1");
    });

    conteudos.forEach(conteudo => {
        conteudo.classList.remove("ativo");
        // Esconde o painel para leitores de tela
        conteudo.setAttribute("hidden", "true"); 
    });
}

function mostraConteudo(indice) {
    // 1. Desativa todos os elementos
    desativaBotoesEConteudo();

    // 2. Ativa o botão e conteúdo corretos
    botoes[indice].classList.add("ativo");
    conteudos[indice].classList.add("ativo");
    
    // 3. Atualiza os atributos ARIA para a aba ativa
    botoes[indice].setAttribute("aria-selected", "true");
    botoes[indice].setAttribute("tabindex", "0"); // Permite foco via teclado
    conteudos[indice].removeAttribute("hidden"); // Torna o painel visível para leitores de tela
    
    // Opcional: Foca no painel recém-aberto para melhor experiência ARIA (depende do caso de uso)
    // conteudos[indice].focus(); 
}

// Associa a função mostraConteudo aos cliques dos botões
botoes.forEach((botao, indice) => {
    // Define o estado inicial da primeira aba (já está ativo no HTML/CSS, mas reforça o JS)
    if (indice === 0) {
        botao.setAttribute("tabindex", "0");
        botao.setAttribute("aria-selected", "true");
    }
    
    // Adiciona o evento de clique
    botao.addEventListener('click', () => {
        mostraConteudo(indice);
    });
});


// --- 2. Lógica de Cronômetro Otimizada e Refatorada ---
const contadores = document.querySelectorAll(".contador");
const TEMPOS_OBJETIVOS = [
    new Date("2023-10-05T00:00:00"), // Alvo 0
    new Date("2023-12-05T00:00:00"), // Alvo 1
    new Date("2023-12-30T00:00:00"), // Alvo 2
    new Date("2024-02-01T00:00:00")  // Alvo 3
];

function calculaTempo(tempoObjetivo) {
    const tempoAtual = new Date();
    let tempoRestante = tempoObjetivo - tempoAtual;

    if (tempoRestante < 0) {
        return [0, 0, 0, 0];
    }

    // Calcula todas as unidades de uma só vez, evitando recálculos
    const segundosTotal = Math.floor(tempoRestante / 1000);
    const dias = Math.floor(segundosTotal / (60 * 60 * 24));
    const horas = Math.floor((segundosTotal % (60 * 60 * 24)) / (60 * 60));
    const minutos = Math.floor((segundosTotal % (60 * 60)) / 60);
    const segundos = Math.floor(segundosTotal % 60);

    return [dias, horas, minutos, segundos];
}

function formataDigito(numero) {
    // Adiciona um zero à esquerda se o número for menor que 10
    return String(numero).padStart(2, '0');
}

function atualizaCronometro() {
    for (let i = 0; i < contadores.length; i++) {
        const [dias, horas, minutos, segundos] = calculaTempo(TEMPOS_OBJETIVOS[i]);

        // Adiciona a formatação de zero à esquerda e usa um ID mais robusto
        document.getElementById(`dias${i}`).textContent = formataDigito(dias);
        document.getElementById(`horas${i}`).textContent = formataDigito(horas);
        document.getElementById(`min${i}`).textContent = formataDigito(minutos);
        document.getElementById(`seg${i}`).textContent = formataDigito(segundos);
    }
}

function iniciaCronometro() {
    // Chama a atualização imediatamente e depois a cada 1000ms
    atualizaCronometro();
    setInterval(atualizaCronometro, 1000);
}

iniciaCronometro();
