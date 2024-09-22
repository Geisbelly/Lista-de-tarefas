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
    
    var novoItem = criarItemTarefa(input.value);
    lista.appendChild(novoItem);

    pendentes.push(input.value);
    salvarListaNoLocalStorage("tarefasPendentes", pendentes);

    input.value = '';
}

function moverItemParaConcluidas(checkbox) {
    var lista2 = document.getElementById('tarefas-concluidas');
    var item = checkbox.parentNode;
    lista2.appendChild(item);
    item.classList.add('completas');

    var texto = item.textContent.replace('Remover', '').trim();
    pendentes = pendentes.filter(t => t !== texto);
    concluidas.push(texto);
    salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
}

function moverItemParaPendentes(checkbox) {
    var lista = document.getElementById('tarefas-pendentes');
    var item = checkbox.parentNode;
    lista.appendChild(item);
    item.classList.remove('completas');

    var texto = item.textContent.replace('Remover', '').trim();
    concluidas = concluidas.filter(t => t !== texto);
    pendentes.push(texto);
    salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
}

function carregarTask() {
    var listaPendentes = document.getElementById('tarefas-pendentes');
    var listaConcluidas = document.getElementById('tarefas-concluidas');

    listaPendentes.innerHTML = '';
    listaConcluidas.innerHTML = '';

    pendentes.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa);
        listaPendentes.appendChild(novoItem);
    });

    concluidas.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa, true);
        listaConcluidas.appendChild(novoItem);
    });
}

function editarItem(novoItem, tarefa, concluida) {
    var inputEditar = document.createElement('input');
    inputEditar.classList.add('inputEdicao')
    inputEditar.type = 'text';
    inputEditar.value = tarefa;
    novoItem.innerHTML = '';
    novoItem.appendChild(inputEditar); 

    var botaoSalvar = document.createElement('button');
    botaoSalvar.textContent = 'Salvar';
    botaoSalvar.style.marginLeft = '10px';
    botaoSalvar.classList.add('botaoSalvar');

    botaoSalvar.addEventListener('click', function () {
        var textoEditado = inputEditar.value;
        if (concluida) {
            concluidas = concluidas.map(t => t === tarefa ? textoEditado : t);
            salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
        } else {
            pendentes = pendentes.map(t => t === tarefa ? textoEditado : t);
            salvarListaNoLocalStorage("tarefasPendentes", pendentes);
        }
        carregarTask(); 
    });

    novoItem.appendChild(botaoSalvar); 
}


function criarItemTarefa(tarefa, concluida = false) {
    var novoItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = concluida;

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

    var elementoDiv = createElement('div')
    elementoDiv.classList.add('Container-Botao-Li')
    elementoDiv.appendChild(botaoEditar)
    elementoDiv.appendChild(botaoRemover)

    novoItem.appendChild(checkbox);
    var texto = document.createTextNode(tarefa);
    novoItem.appendChild(texto);
    novoItem.appendChild(elementoDiv);

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
