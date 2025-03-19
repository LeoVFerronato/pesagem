document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    const tabelaRegistros = document.getElementById('tabelaRegistros').getElementsByTagName('tbody')[0];
    const botaoLimpar = document.getElementById('limparRegistros');
    const tabelaMedias = document.getElementById('tabelaMedias').getElementsByTagName('tbody')[0];
    const mediaGeralElemento = document.getElementById('mediaGeral');
    const mensagemWhatsAppSelect = document.getElementById('mensagemWhatsApp');
    const enviarWhatsAppButton = document.getElementById('enviarWhatsApp');
    const opcaoSalva = localStorage.getItem('opcaoMensagemWhatsApp');
    if (opcaoSalva) {
        mensagemWhatsAppSelect.value = opcaoSalva;
    }
    mensagemWhatsAppSelect.addEventListener('change', function() {
        const opcaoSelecionada = this.value;
        localStorage.setItem('opcaoMensagemWhatsApp', opcaoSelecionada);
    });

    carregarRegistros();
    atualizarMedias();

    enviarWhatsAppButton.addEventListener('click', function() {
        const mensagemSelecionada = mensagemWhatsAppSelect.value;
        const mensagem = gerarMensagemWhatsApp(mensagemSelecionada);
        enviarMensagemWhatsApp(mensagem);
    });

    formRegistro.addEventListener('submit', function(event) {
        event.preventDefault();

        const quantidade = document.getElementById('quantidade').value;
        const peso = document.getElementById('peso').value;
        const tara = document.getElementById('tara').value;
        const box = document.getElementById('box').value;

        adicionarRegistro(quantidade, peso, tara, box);
        salvarRegistros();
        atualizarMedias();
    });

    botaoLimpar.addEventListener('click', function() {
        limparRegistros();
        atualizarMedias();
    });

    function adicionarRegistro(quantidade, peso, tara, box) {
        const novaLinha = tabelaRegistros.insertRow();
        const celulaQuantidade = novaLinha.insertCell(0);
        const celulaPeso = novaLinha.insertCell(1);
        const celulaTara = novaLinha.insertCell(2);
        const celulaBox = novaLinha.insertCell(3);
        const celulaAcoes = novaLinha.insertCell(4);

        celulaQuantidade.textContent = quantidade;
        celulaPeso.textContent = peso;
        celulaTara.textContent = tara;
        celulaBox.textContent = box;
        celulaAcoes.innerHTML = '<button onclick="excluirRegistro(this)">Excluir</button>';
    }

    window.excluirRegistro = function(botao) {
        if (confirm('Tem certeza de que deseja excluir este registro?')) {
            const linha = botao.parentNode.parentNode;
            linha.parentNode.removeChild(linha);
            salvarRegistros();
            atualizarMedias();
        }
    };

    function salvarRegistros() {
        const registros = [];
        for (let i = 0; i < tabelaRegistros.rows.length; i++) {
            const linha = tabelaRegistros.rows[i];
            registros.push({
                quantidade: linha.cells[0].textContent,
                peso: linha.cells[1].textContent,
                tara: linha.cells[2].textContent,
                box: linha.cells[3].textContent
            });
        }
        localStorage.setItem('registrosPesagem', JSON.stringify(registros));
    }

    function carregarRegistros() {
        const registrosSalvos = localStorage.getItem('registrosPesagem');
        if (registrosSalvos) {
            const registros = JSON.parse(registrosSalvos);
            registros.forEach(registro => {
                adicionarRegistro(registro.quantidade, registro.peso, registro.tara, registro.box);
            });
        }
    }

    function limparRegistros() {
        if (confirm('Tem certeza de que deseja limpar todos os registros?')) {
            while (tabelaRegistros.firstChild) {
                tabelaRegistros.removeChild(tabelaRegistros.firstChild);
            }
            localStorage.removeItem('registrosPesagem');
        }
    }

    function calcularMediaPorBox() {
        const medias = {};
        for (let i = 0; i < tabelaRegistros.rows.length; i++) {
            const linha = tabelaRegistros.rows[i];
            const quantidade = parseFloat(linha.cells[0].textContent);
            const peso = parseFloat(linha.cells[1].textContent);
            const tara = parseFloat(linha.cells[2].textContent);
            const box = linha.cells[3].textContent;
            const media = (peso - tara) / quantidade;

            if (!medias[box]) {
                medias[box] = { soma: 0, quantidade: 0 };
            }

            medias[box].soma += media;
            medias[box].quantidade++;
        }

        const resultados = {};
        for (const box in medias) {
            resultados[box] = medias[box].soma / medias[box].quantidade;
        }
        return resultados;
    }

    function atualizarMedias() {
        const medias = calcularMediaPorBox();
        tabelaMedias.innerHTML = ''; // Limpa a tabela de médias
        for (const box in medias) {
            const novaLinha = tabelaMedias.insertRow();
            const celulaBox = novaLinha.insertCell(0);
            const celulaMedia = novaLinha.insertCell(1);

            celulaBox.textContent = box;
            celulaMedia.textContent = medias[box].toFixed(3); // Exibe a média com 2 casas decimais
        }
    }
    function atualizarMedias() {
        const medias = calcularMediaPorBox();
        tabelaMedias.innerHTML = '';
        for (const box in medias) {
            const novaLinha = tabelaMedias.insertRow();
            const celulaBox = novaLinha.insertCell(0);
            const celulaMedia = novaLinha.insertCell(1);

            celulaBox.textContent = box;
            celulaMedia.textContent = medias[box].toFixed(3);
        }
        atualizarMediaGeral();
    }

    function calcularMediaGeral() {
        const medias = calcularMediaPorBox();
        let somaMedias = 0;
        let quantidadeBoxes = 0;

        for (const box in medias) {
            somaMedias += medias[box];
            quantidadeBoxes++;
        }

        return quantidadeBoxes > 0 ? somaMedias / quantidadeBoxes : 0;
    }

    function atualizarMediaGeral() {
        const mediaGeral = calcularMediaGeral();
        mediaGeralElemento.textContent = mediaGeral.toFixed(3);
    }

    function gerarMensagemWhatsApp(mensagemSelecionada) {
        switch (mensagemSelecionada) {
            case '7 dias':
                return aviarios.value + ' - 7 dias' + "\nPeso: " + mediaGeralElemento.textContent + "\nMortalidade: ";
            case '14 dias':
                return aviarios.value + ' - 14 dias' + "\nPeso: " + mediaGeralElemento.textContent + "\nMortalidade: ";
            case '21 dias':
                return aviarios.value + ' - 21 dias' + "\nPeso: " + mediaGeralElemento.textContent + "\nMortalidade: ";
            case 'Programação':
                return 'Peso ' + aviarios.value + ': ' + mediaGeralElemento.textContent;
            default:
                return '';
        }
    }

    function enviarMensagemWhatsApp(mensagem) {
        const numeroTelefone = '5554999669270'; // Substitua pelo número de telefone
        const url = `https://wa.me/${numeroTelefone}?text=${encodeURIComponent(mensagem)}`;
        window.open(url, '_blank');
    }


});
