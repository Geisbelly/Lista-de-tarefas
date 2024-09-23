function salvarListaNoLocalStorage(nome, lista) {
    localStorage.setItem(nome, JSON.stringify(lista));
}

function obterListaDoLocalStorage(nome) {
    var lista = localStorage.getItem(nome);
    return lista ? JSON.parse(lista) : [];
}

var pendentes = obterListaDoLocalStorage("tarefasPendentes");
var concluidas = obterListaDoLocalStorage("tarefasConcluidas");

function adicionarItem() {
    var lista = document.getElementById('tarefas-pendentes');
    var input = document.getElementById('nova-tarefa');
    var data = document.getElementById('nova-prazo');
    var desc = document.getElementById('nova-descricao');

    var novaTarefa = {
        nome: input.value,
        data: data.value,
        descricao: desc.value
    }
    
    var novoItem = criarItemTarefa(novaTarefa);
    lista.appendChild(novoItem);

    pendentes.push(novaTarefa);
    salvarListaNoLocalStorage("tarefasPendentes", pendentes);

    input.value = '';
    data.value = '';
    desc.value = '';
}

function moverItemParaConcluidas(checkbox) {
    var lista2 = document.getElementById('tarefas-concluidas');
    var item = checkbox.closest('li');
    lista2.appendChild(item);
    item.classList.add('completas');


    var texto = checkbox.closest('li').querySelector('.nomeTarefa').textContent.trim();
    var tarefaConcluida = pendentes.find(t => t.nome === texto);

    if(tarefaConcluida){
        pendentes = pendentes.filter(t => t.nome !== texto);
        concluidas.push(tarefaConcluida);
    }

    salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
}

function moverItemParaPendentes(checkbox) {
    var lista = document.getElementById('tarefas-pendentes');
    var item = checkbox.closest('li');
    lista.appendChild(item);
    item.classList.remove('completas');

    var texto = checkbox.closest('li').querySelector('.nomeTarefa').textContent.trim();
    var tarefaPendente = concluidas.find(t => t.nome === texto);

    if(tarefaPendente){
        concluidas = concluidas.filter(t => t.nome !== texto);
        pendentes.push(tarefaPendente);
    }

    salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
}

function carregarTask() {
    var listaPendentes = document.getElementById('tarefas-pendentes');
    var listaConcluidas = document.getElementById('tarefas-concluidas');

    listaPendentes.innerHTML = '';
    listaConcluidas.innerHTML = '';

    pendentes.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa, false);
        listaPendentes.appendChild(novoItem);
    });

    concluidas.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa, true);
        listaConcluidas.appendChild(novoItem);
    });
}

function formatarDataHora(horario){
    var partes = horario.split('T');

    var listaData = partes[0].split('-');
    var dia = parseInt(listaData[2],10);
    var mes = parseInt(listaData[1],10);
    var ano = parseInt(listaData[0],10);

    var horario = partes[1];
    
    return dia+'/'+mes+'/'+ano+'  '+horario
}


function editarItem(novoItem, tarefa, concluida) {
    var inputEditar = document.createElement('input');
    inputEditar.classList.add('inputEdicao')
    inputEditar.type = 'text';
    inputEditar.value = tarefa.nome;

    var inputData = document.createElement('input');
    inputData.classList.add('inputData')
    inputData.type = 'datetime-local';
    inputData.value = tarefa.data;

    var divPri = document.createElement('div')
    divPri.classList.add('divPri')
    divPri.appendChild(inputEditar)
    divPri.appendChild(inputData)

    var inputDesc = document.createElement('input');
    inputDesc.classList.add('inputDesc')
    inputDesc.type = 'text';
    inputDesc.value = tarefa.descricao;

    var botaoSalvar = document.createElement('button');
    botaoSalvar.textContent = 'Salvar';
    botaoSalvar.style.marginLeft = '10px';
    botaoSalvar.classList.add('botaoSalvar');

    var divSec = document.createElement('div')
    divSec.classList.add('divSec')
    divSec.appendChild(inputDesc)
    divSec.appendChild(botaoSalvar)

    var divPrin = document.createElement('div')
    divPrin.classList.add('divPrin')
    divPrin.appendChild(divPri)
    divPrin.appendChild(divSec)

    novoItem.innerHTML = '';
    novoItem.appendChild(divPrin);

    botaoSalvar.addEventListener('click', function () {
        tarefa.nome = inputEditar.value;
        tarefa.data = inputData.value;
        tarefa.descricao = inputDesc.value;

        if (concluida) {
            concluidas = concluidas.map(t => t.nome === tarefa.nome ? tarefa : t);
            salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
        } else {
            pendentes = pendentes.map(t => t.nome === tarefa.nome ? tarefa : t);
            salvarListaNoLocalStorage("tarefasPendentes", pendentes);
        }
        carregarTask(); 
    });

    
}


function criarItemTarefa(tarefa, concluida) {
    var novoItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = concluida;

    var tituloTask = document.createElement('p');
    tituloTask.classList.add('nomeTarefa');
    tituloTask.textContent = tarefa.nome;

    var prazoTask = document.createElement('p');
    prazoTask.classList.add('prazoTarefa');
    prazoTask.textContent = 'Prazo: '+formatarDataHora(tarefa.data);

    var descricaoTask = document.createElement('p');
    descricaoTask.classList.add('descTarefa');
    descricaoTask.textContent = "Descrição: "+tarefa.descricao;

    var divDadosTask = document.createElement('div')
    divDadosTask.classList.add('Dados-Task')
    divDadosTask.appendChild(prazoTask)
    divDadosTask.appendChild(descricaoTask)

    var botaoEditar = document.createElement('button');
    botaoEditar.innerHTML = '<i class="fas fa-pencil-alt"></i>';
    botaoEditar.style.marginLeft = '10px';
    botaoEditar.classList.add('botaoEditar');

    botaoEditar.addEventListener('click', function () {
        editarItem(novoItem, tarefa, concluida);
    });

    var botaoRemover = document.createElement('button');
    botaoRemover.innerHTML = '<i class="fas fa-trash"></i>';
    botaoRemover.style.marginLeft = '10px';
    botaoRemover.classList.add('botaoRemover');

    botaoRemover.addEventListener('click', function () {
        if (concluida) {
            concluidas = concluidas.filter(t => t !== tarefa);
            salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
        } else {
            pendentes = pendentes.filter(t => t !== tarefa);
            salvarListaNoLocalStorage("tarefasPendentes", pendentes);
        }
        novoItem.remove();
    });

    var elementoDiv = document.createElement('div')
    elementoDiv.classList.add('Container-Botao-Li')
    elementoDiv.appendChild(botaoEditar)
    elementoDiv.appendChild(botaoRemover)

    var divCabTask = document.createElement('div')
    divCabTask.classList.add('Cab-Task')
    divCabTask.appendChild(checkbox)
    divCabTask.appendChild(tituloTask)
    divCabTask.appendChild(elementoDiv)

    var divTask = document.createElement('div')
    divTask.classList.add('Div-Task')
    divTask.appendChild(divCabTask)
    divTask.appendChild(divDadosTask)

    novoItem.appendChild(divTask);

    if (concluida) {
        novoItem.classList.add('completas');
    }

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            moverItemParaConcluidas(this);
        } else {
            moverItemParaPendentes(this);
        }
    });

    return novoItem;
}

window.onload = function() {
    carregarTask();
};
