// Js/servicos.js - VERSÃO COM ALERTA DE VERIFICAÇÃO

document.addEventListener('DOMContentLoaded', () => {
    const servicoModal = document.getElementById('servicoModal');
    if (!servicoModal) return;

    servicoModal.addEventListener('show.bs.modal', async function (event) {
        const button = event.relatedTarget;
        const servicoId = button.getAttribute('data-bs-id');

        const modalTitle = servicoModal.querySelector('.modal-title');
        const modalBody = servicoModal.querySelector('.modal-body');
        const modalPreco = document.getElementById('servicoModalPreco');

        modalTitle.textContent = 'Carregando...';
        modalBody.textContent = '';
        modalPreco.textContent = '';

        try {
            const response = await fetch(`http://localhost:3000/servicos/${servicoId}`);
            if (!response.ok) {
                throw new Error('Serviço não encontrado no servidor.');
            }
            const servico = await response.json();

            const precoBase = parseFloat(servico.preco_base);
            let precoFinal = precoBase;
            
            const userDataString = localStorage.getItem('loggedInUser');

            // --- INÍCIO DA LÓGICA DE CÁLCULO ---
            if (userDataString) {
                const userData = JSON.parse(userDataString);
                const porte = userData.porte_animal;
                
                let multiplicador = 1;
                if (porte === 'Medio') {
                    multiplicador = 2;
                } else if (porte === 'Grande') {
                    multiplicador = 4;
                }
                
                precoFinal = precoBase * multiplicador;

                // ✅ --- ALERTA DE VERIFICAÇÃO PARA USUÁRIO LOGADO ---
             
                
            } else {
               
            }
            // --- FIM DA LÓGICA DE CÁLCULO ---

            const precoFormatado = precoFinal.toFixed(2).replace('.', ',');
        
            modalTitle.textContent = servico.nome;
            modalBody.textContent = servico.descricao;
            modalPreco.textContent = `Preço para seu pet: R$ ${precoFormatado}`;

        } catch (error) {
            console.error('Falha ao buscar detalhes do serviço:', error);
            modalTitle.textContent = 'Erro';
            modalBody.textContent = 'Não foi possível carregar os detalhes deste serviço.';
        }
    });
});