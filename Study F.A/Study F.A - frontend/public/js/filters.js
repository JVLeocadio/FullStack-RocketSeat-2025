export function initializeFilters() {
    const categorySelect = document.getElementById('category-select');
    const treinosFilters = document.getElementById('treinos-filters');
    const scoutFilters = document.getElementById('scout-filters');
    const jogosFilters = document.getElementById('jogos-filters');

    // Verificar se os elementos existem
    if (!categorySelect || !treinosFilters || !scoutFilters || !jogosFilters) {
        console.error('Um ou mais elementos necessários para os filtros não foram encontrados.');
        return;
    }

    // Alternar entre os filtros com base na categoria selecionada
    categorySelect.addEventListener('change', () => {
        const selectedCategory = categorySelect.value;

        // Esconder todos os filtros
        treinosFilters.style.display = 'none';
        scoutFilters.style.display = 'none';
        jogosFilters.style.display = 'none';

        // Exibir os filtros correspondentes à categoria selecionada
        if (selectedCategory === 'treinos') {
            treinosFilters.style.display = 'block';
        } else if (selectedCategory === 'scout') {
            scoutFilters.style.display = 'block';
        } else if (selectedCategory === 'jogos') {
            jogosFilters.style.display = 'block';
        }
    });
}