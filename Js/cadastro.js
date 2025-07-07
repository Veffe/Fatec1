// Js/cadastro.js - Versão final com integração ViaCEP

document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('usuario');
    if (!form) {
        // Se não encontrar o formulário, não faz nada. Evita erros em outras páginas.
        return;
    }

    // --- PARTE 1: LÓGICA DO VIA CEP ---

    // Pega as referências dos campos de endereço do seu HTML
    const cepInput = document.getElementById('cep');
    const ruaInput = document.getElementById('rua');
    const bairroInput = document.getElementById('bairro');
    const cidadeInput = document.getElementById('cidade');
    const ufInput = document.getElementById('uf');
    const numeroInput = document.getElementById('numero');

    // Função para limpar os campos de endereço, caso o CEP seja inválido
    const limparCamposEndereco = () => {
        ruaInput.value = "";
        bairroInput.value = "";
        cidadeInput.value = "";
        ufInput.value = "";
    };

    // Adiciona um "escutador" que dispara quando o usuário digita o CEP e clica fora do campo
    cepInput.addEventListener('blur', async () => {
        const cep = cepInput.value.replace(/\D/g, ''); // Limpa o CEP, deixando apenas números

        // Validação básica do CEP
        if (cep.length !== 8) {
            limparCamposEndereco();
            return;
        }

        // Mostra "Buscando..." para o usuário saber que algo está acontecendo
        ruaInput.value = "Buscando...";
        bairroInput.value = "Buscando...";
        cidadeInput.value = "Buscando...";
        ufInput.value = "...";

        try {
            // Chama a API do ViaCEP
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            // Se o ViaCEP retornar um erro, avisa o usuário
            if (data.erro) {
                alert("CEP não encontrado. Por favor, verifique.");
                limparCamposEndereco();
                return;
            }

            // Preenche os campos de endereço com os dados retornados
            ruaInput.value = data.logradouro;
            bairroInput.value = data.bairro;
            cidadeInput.value = data.localidade;
            ufInput.value = data.uf;

            // Move o cursor para o campo "Número", que é o próximo a ser preenchido
            numeroInput.focus();

        } catch (error) {
            console.error('Erro ao buscar CEP:', error);
            alert("Não foi possível buscar o CEP. Verifique sua conexão ou tente novamente.");
            limparCamposEndereco();
        }
    });


    // --- PARTE 2: LÓGICA DE ENVIO DO FORMULÁRIO (A SUA LÓGICA, ATUALIZADA) ---

    form.addEventListener('submit', async function (e) {
        e.preventDefault();

        // Pega os valores de todos os campos do formulário no momento do envio
        const dados = {
            nome: document.getElementById('nome').value,
            email: document.getElementById('email').value,
            senha: document.getElementById('senha').value,
            cep: cepInput.value,
            porte_animal: document.getElementById('porte').value,
            // Adiciona os novos campos de endereço
            logradouro: ruaInput.value,
            bairro: bairroInput.value,
            cidade: cidadeInput.value,
            uf: ufInput.value
        };

        const confirmarSenha = document.getElementById('confirmaSenha').value;
        if (dados.senha !== confirmarSenha) {
            alert("As senhas não coincidem!");
            return;
        }

        if (dados.porte_animal === "") {
            alert("Por favor, selecione o porte do seu pet.");
            return;
        }

        // Removemos o alert de verificação para a versão final
        // alert("Dados que serão enviados para o servidor:\n\n" + JSON.stringify(dados, null, 2));

        try {
            const resposta = await fetch('http://localhost:3000/usuarios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(dados)
            });

            const resultado = await resposta.json();

            if (resposta.ok) {
                alert(resultado.message || "Usuário cadastrado com sucesso! Você será redirecionado para a página de login.");
                window.location.href = 'login.html';
            } else {
                alert("Erro: " + resultado.message);
            }

        } catch (erro) {
            alert("Erro de conexão com o servidor. Verifique o console para mais detalhes.");
            console.error(erro);
        }
    });
});