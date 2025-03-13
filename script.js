document.addEventListener('DOMContentLoaded', function() {
    const formRegistro = document.getElementById('formRegistro');
    const tabelaRegistros = document.getElementById('tabelaRegistros').getElementsByTagName('tbody')[0];
    const botaoLimpar = document.getElementById('limparRegistros');
    const tabelaMedias = document.getElementById('tabelaMedias').getElementsByTagName('tbody')[0];

    carregarRegistros();
    atualizarMedias();

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
        const linha = botao.parentNode.parentNode;
        linha.parentNode.removeChild(linha);
        salvarRegistros();
        atualizarMedias();
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
        while (tabelaRegistros.firstChild) {
            tabelaRegistros.removeChild(tabelaRegistros.firstChild);
        }
        localStorage.removeItem('registrosPesagem');
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
});