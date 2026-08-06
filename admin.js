function entrar(){

    let senha = document.getElementById("senha").value;


    if(senha === "1234"){

        document.getElementById("login").style.display = "none";

        document.getElementById("painelAdmin").style.display = "block";

    }else{

        document.getElementById("erro").innerHTML =
        "Senha incorreta";

    }

}



function salvar(){

    localStorage.setItem(
        "festa",
        document.getElementById("festa").value
    );

    let textoProgramacao = "";

    listaDJ.forEach(dj => {

        textoProgramacao +=
        dj.horario + " " + dj.nome + "\n";

    });

    localStorage.setItem(
        "programacao",
        textoProgramacao
    );

    localStorage.setItem(
        "noticias",
        document.getElementById("noticias").value
    );
localStorage.setItem(
    "listaDJ",
    JSON.stringify(listaDJ)
);

    alert("Programação salva com sucesso!");

}


    
let listaDJ = [];

function adicionarDJ(){

    let horario = document.getElementById("novoHorario").value;
    let nome = document.getElementById("novoDJ").value;

    if(horario === "" || nome === ""){
        alert("Preencha o horário e o nome do DJ.");
        return;
    }

    listaDJ.push({
        horario: horario,
        nome: nome
    });

    listaDJ.sort((a,b)=>a.horario.localeCompare(b.horario));

    atualizarTabela();

    document.getElementById("novoHorario").value="";
    document.getElementById("novoDJ").value="";
}

function atualizarTabela(){

    let corpo = document.getElementById("corpoTabela");

    corpo.innerHTML="";

    listaDJ.forEach((dj,index)=>{

        corpo.innerHTML += `
        <tr>
            <td>${dj.horario}</td>
            <td>${dj.nome}</td>
            <td>
                <button onclick="removerDJ(${index})">
                    🗑
                </button>
            </td>
        </tr>`;
    });

}

function removerDJ(indice){

    listaDJ.splice(indice,1);

    atualizarTabela();

}
function carregarTabela(){

    let dados = localStorage.getItem("listaDJ");

    if(!dados) return;

    listaDJ = JSON.parse(dados);

    atualizarTabela();

}
carregarTabela();