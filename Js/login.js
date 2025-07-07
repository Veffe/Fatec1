document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    if (!loginForm) return; // Não executa se não estiver na página de login

    loginForm.addEventListener('submit', async function (e) {
        e.preventDefault();

        const email = document.getElementById('loginEmail').value;
        const senha = document.getElementById('loginSenha').value;
        const messageDiv = document.getElementById('loginMessage');

        try {
            const response = await fetch('http://localhost:3000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, senha })
            });

            const result = await response.json();

            if (response.ok && result.user) {
                // 1. Salva os dados do usuário no navegador
                localStorage.setItem('loggedInUser', JSON.stringify(result.user));

                // ✅ 2. REDIRECIONA PARA A PÁGINA PRINCIPAL APÓS O SUCESSO
                window.location.href = 'index.html';

            } else {
                messageDiv.innerHTML = `<div class="alert alert-danger">${result.message || 'Erro desconhecido.'}</div>`;
            }

        } catch (error) {
            console.error('Erro na requisição de login:', error);
            messageDiv.innerHTML = `<div class="alert alert-danger">Não foi possível conectar ao servidor.</div>`;
        }
    });
});