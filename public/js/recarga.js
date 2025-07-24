// recarga.js
document.addEventListener('DOMContentLoaded', () => {

    // Função para carregar veículos no seletor
    window.carregarVeiculos = function () {
        fetch('/api/veiculos')
            .then(response => response.json())
            .then(dados => {
                const veiculoSelect = document.getElementById('veiculo_id');
                dados.forEach(veiculo => {
                    const option = document.createElement('option');
                    option.value = veiculo.id;
                    option.textContent = veiculo.descricao;
                    veiculoSelect.appendChild(option);
                });
            });
    }

    document.getElementById('veiculo_id').addEventListener('change', function () {
        const veiculo_id = this.value;
        console.log(veiculo_id);
        if (veiculo_id) {
            carregarKmInicial(veiculo_id);
        }
    });

    function carregarKmInicial(veiculo_id) {
        fetch(`/api/recargas/carregar-km-inicial/${veiculo_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar recargas iniciadas');
                }
                return response.json();
            })
            .then(dados => {
                document.getElementById('km_inicial').value = dados.km_final ?? '';
            })
            .catch(error => {
                console.error('Erro na requisição:', error);
            });
    }

    // Função para carregar recargas iniciadas
    function carregarRecargasIniciadas() {
        const operador_id = localStorage.getItem('operador_id');
        fetch(`/api/recargas/iniciadas/${operador_id}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Erro ao carregar recargas iniciadas');
                }
                return response.json();
            })
            .then(dados => {
                const select = document.getElementById('recarga_id');

                while (select.options.length > 1) {
                    select.remove(1);
                }

                dados.forEach(recarga => {
                    const option = document.createElement('option');
                    option.value = recarga.id;
                    option.textContent = `ID: ${recarga.id} | Veículo: ${recarga.veiculo_id} | Bateria: ${recarga.percentual_inicio}%`;
                    select.appendChild(option);
                });
            })
            .catch(error => console.error('Erro ao carregar recargas iniciadas:', error));
    }

    // Obter dados do formulário início da recarga
    document.getElementById('form1').addEventListener('submit', function (event) {
        event.preventDefault();

        const dadosFormulario = Object.fromEntries(new FormData(this).entries());

        const dadosSessao = Object.fromEntries(
            Object.entries(localStorage).map(([key, value]) => {
                try {
                    return [key, JSON.parse(value)];
                } catch {
                    return [key, value];
                }
            })
        );

        const dados = {
            ...dadosFormulario,
            ...dadosSessao
        };

        console.table(dados);
        iniciarRecarga(dados);
    });

    // Função para iniciar a recarga
    function iniciarRecarga(dados) {
        fetch('/api/recargas/iniciar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
            .then(async response => {
                const contentType = response.headers.get("Content-Type");
                const isJson = contentType && contentType.includes("application/json");

                const responseBody = isJson ? await response.json() : await response.text();

                if (!response.ok) {
                    const errorMessage = isJson
                        ? responseBody.message || JSON.stringify(responseBody)
                        : responseBody;

                    throw new Error(errorMessage);
                }

                console.log('Recarga iniciada:', responseBody);
                carregarRecargasIniciadas();
            })
            .catch(error => {
                console.error('Erro ao iniciar recarga:', error.message);
            });
    }

    // Obter dados do formulário finalizar recarga
    document.getElementById('form2').addEventListener('submit', function (event) {
        event.preventDefault();

        const dados = Object.fromEntries(new FormData(this).entries());
        console.table(dados);
        finalizarRecarga(dados);
    });

    // Função para finalizar a recarga
    // recarga.js
    function finalizarRecarga(dados) {

        fetch('/api/recargas/finalizar', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(dados),
        })
            .then(response => response.json())
            .then(data => {
                console.log('Recarga finalizada:', data);
                alert('Recarga finalizada!');
                window.location.reload();
            })
            .catch(error => console.error('Erro ao finalizar recarga:', error));
    }

    carregarVeiculos();
    carregarRecargasIniciadas();
});