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
    var novoItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';

    var botaoRemover = document.createElement('button');
    botaoRemover.textContent = 'Remover';
    botaoRemover.style.marginLeft = '10px';

    botaoRemover.addEventListener('click', function () {
        lista.removeChild(novoItem);
        pendentes = pendentes.filter(t => t !== input.value);
        salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    });

    checkbox.addEventListener('change', function () {
        if (this.checked) {
            moverItemParaConcluidas(this);
        } else {
            moverItemParaPendentes(this);
        }
    });

    novoItem.appendChild(checkbox);
    var texto = document.createTextNode(input.value);
    novoItem.appendChild(texto);
    novoItem.appendChild(botaoRemover);
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

    var texto = item.textContent;
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

    var texto = item.textContent;
    concluidas = concluidas.filter(t => t !== texto);
    pendentes.push(texto);
    salvarListaNoLocalStorage("tarefasPendentes", pendentes);
    salvarListaNoLocalStorage("tarefasConcluidas", concluidas);
}


function carregarTask() {
    var listaPendentes = document.getElementById('tarefas-pendentes');
    var listaConcluidas = document.getElementById('tarefas-concluidas');

    pendentes.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa);
        listaPendentes.appendChild(novoItem);
    });

    concluidas.forEach(function (tarefa) {
        var novoItem = criarItemTarefa(tarefa, true);
        listaConcluidas.appendChild(novoItem);
    });
}

function criarItemTarefa(tarefa, concluida = false) {
    var novoItem = document.createElement('li');
    var checkbox = document.createElement('input');
    checkbox.type = 'checkbox';
    checkbox.checked = concluida;

    novoItem.appendChild(checkbox);
    var texto = document.createTextNode(tarefa);
    novoItem.appendChild(texto);

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
