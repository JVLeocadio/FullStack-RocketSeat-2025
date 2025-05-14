export function initializeTabs() {
    const tabButtons = document.querySelectorAll('.tab-button');
    const tabPanes = document.querySelectorAll('.tab-pane');

    // Alternar entre abas
    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remover a classe ativa de todas as abas
            tabButtons.forEach(btn => btn.classList.remove('active'));
            tabPanes.forEach(pane => pane.classList.remove('active'));

            // Adicionar a classe ativa à aba clicada e ao conteúdo correspondente
            button.classList.add('active');
            document.getElementById(button.dataset.tab).classList.add('active');
        });
    });
}