export function initializeSidebar() {
    const toggleSidebarButton = document.getElementById("toggle-sidebar");
    const expandSidebarButton = document.getElementById("expand-sidebar");
    const sidebar = document.querySelector(".sidebar");

    // Restaurar o estado do menu ao carregar a página
    const isCollapsed = localStorage.getItem("sidebar-collapsed") === "true";
    if (isCollapsed) {
        sidebar.classList.add("collapse");
    }

    // Colapsar a sidebar
    toggleSidebarButton.addEventListener("click", () => {
        sidebar.classList.add("collapse");
        localStorage.setItem("sidebar-collapsed", "true"); // Salvar estado no localStorage
    });

    // Expandir a sidebar
    expandSidebarButton.addEventListener("click", () => {
        sidebar.classList.remove("collapse");
        localStorage.setItem("sidebar-collapsed", "false"); // Salvar estado no localStorage
    });
}