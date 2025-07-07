document.addEventListener('DOMContentLoaded', () => {
    const userDataString = localStorage.getItem('loggedInUser');
    const navLogin = document.getElementById('nav-login');
    const navCadastro = document.getElementById('nav-cadastro');
    const navUsuario = document.getElementById('nav-usuario');
    const navSobre = document.getElementById('nav-sobre')
    if (!navLogin || !navCadastro || !navUsuario) return;

    if (userDataString) {
        const userData = JSON.parse(userDataString);
        const navUsuarioNome = document.getElementById('nav-usuario-nome');
        const logoutButton = document.getElementById('logout-button');
        
        navLogin.style.display = 'none';
        navCadastro.style.display = 'none';
        navSobre.style.display = 'block';
        if (navUsuarioNome) navUsuarioNome.textContent = `Olá, ${userData.nome}`;
        navUsuario.style.display = 'block';
        if (logoutButton) {
            logoutButton.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('loggedInUser');
                window.location.href = 'index.html';
            });
        }
    } else {
        navLogin.style.display = 'block';
        navCadastro.style.display = 'block';
        navUsuario.style.display = 'none';
    }
});