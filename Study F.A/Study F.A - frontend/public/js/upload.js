export function handleVideoUpload(formId, statusId) {
    const form = document.getElementById(formId);
    const statusElement = document.getElementById(statusId);

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData(form);

        // Logar os dados do FormData
        for (let [key, value] of formData.entries()) {
            console.log(`${key}: ${value}`);
        }

        try {
            const response = await fetch('http://localhost:4000/uploads', {
                method: 'POST',
                body: formData,
            });

            const result = await response.json();
            if (response.ok) {
                statusElement.textContent = result.message;
                statusElement.style.color = 'green';
            } else {
                statusElement.textContent = result.message;
                statusElement.style.color = 'red';
            }

            form.reset(); // Limpa o formulário após o envio
        } catch (error) {
            statusElement.textContent = 'Erro ao fazer upload';
            statusElement.style.color = 'red';
        }
    });
}
