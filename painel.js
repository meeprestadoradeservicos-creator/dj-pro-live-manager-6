// =====================================
// DJ PRO LIVE MANAGER 6.1
// PAINEL PRINCIPAL
// =====================================


let ultimoDJ = "";


// =====================================
// RELÓGIO PRINCIPAL
// =====================================

function atualizarRelogio(){

    const agora = new Date();

    let h = String(agora.getHours()).padStart(2,"0");
    let m = String(agora.getMinutes()).padStart(2,"0");
    let s = String(agora.getSeconds()).padStart(2,"0");


    let relogio = document.getElementById("relogio");

    if(relogio){

        relogio.innerHTML =
        h + ":" + m + ":" + s;

    }


    verificarDJ(h + ":" + m);

}


// =====================================
// CARREGAR INFORMAÇÕES
// =====================================

function carregarPainel(){

    let festa =
    localStorage.getItem("festa");


    let noticias =
    localStorage.getItem("noticias");


    let lista =
    localStorage.getItem("listaDJ");



    if(festa){

        document.getElementById("evento").innerHTML =
        festa;

    }



    if(noticias){

        document.getElementById("noticias").innerHTML =
        noticias;

    }



    if(lista){

        let listaDJ =
        JSON.parse(lista);


        mostrarLista(listaDJ);

    }

}



// =====================================
// MOSTRAR PROGRAMAÇÃO
// =====================================

function mostrarLista(listaDJ){

    let texto = "";


    listaDJ.forEach(function(dj){

        texto +=
        dj.horario +
        " - " +
        dj.nome +
        "<br>";

    });



    let lista =
    document.getElementById("lista");


    if(lista){

        lista.innerHTML = texto;

    }

}
// =====================================
// DJ ATUAL + PRÓXIMO DJ + CONTADOR
// =====================================


function verificarDJ(horaAtual){

    let dados =
    localStorage.getItem("listaDJ");


    if(!dados){

        return;

    }


    let listaDJ =
    JSON.parse(dados);



    let atual = "AGUARDANDO";

    let proximo = "SEM PROGRAMAÇÃO";

    let proximoHorario = null;



    for(let i = 0; i < listaDJ.length; i++){


        if(horaAtual >= listaDJ[i].horario){


            atual =
            listaDJ[i].nome;



            if(i + 1 < listaDJ.length){


                proximo =
                listaDJ[i + 1].nome;


                proximoHorario =
                listaDJ[i + 1].horario;


            }


        }


    }



    let campoAtual =
    document.getElementById("djAtual");


    let campoProximo =
    document.getElementById("proximoDJ");



    if(campoAtual){

        campoAtual.innerHTML =
        atual;

    }



    if(campoProximo){

        campoProximo.innerHTML =
        proximo;

    }




    // CONTADOR

    if(proximoHorario){


        let agora =
        new Date();



        let partes =
        proximoHorario.split(":");



        let destino =
        new Date();



        destino.setHours(
            partes[0],
            partes[1],
            0
        );



        let diferenca =
        destino - agora;



        if(diferenca > 0){


            let total =
            Math.floor(diferenca / 1000);



            let minutos =
            Math.floor(total / 60);



            let segundos =
            total % 60;



            let contador =
            document.getElementById("contador");



            if(contador){

                contador.innerHTML =
                String(minutos).padStart(2,"0")
                + ":" +
                String(segundos).padStart(2,"0");

            }


        }


    }



    // TROCA DE DJ

    if(atual !== ultimoDJ
       && atual !== "AGUARDANDO"){


        ultimoDJ = atual;


        mostrarTroca(atual);


        anunciarDJ(atual);


    }


}
// =====================================
// TELA DE TROCA DO DJ
// =====================================


function mostrarTroca(nome){


    let nomeTela =
    document.getElementById("nomeTroca");


    let tela =
    document.getElementById("telaTroca");



    if(nomeTela){

        nomeTela.innerHTML =
        nome;

    }



    if(tela){


        tela.style.display = "flex";



        setTimeout(function(){


            tela.style.display = "none";


        },3000);


    }


}



// =====================================
// VOZ DO DJ
// =====================================


function anunciarDJ(nome){


    if(!("speechSynthesis" in window)){

        return;

    }



    speechSynthesis.cancel();



    let mensagem =

    "Atenção ouvintes! Entrando agora no comando, DJ "
    + nome;



    let fala =
    new SpeechSynthesisUtterance(mensagem);



    fala.lang = "pt-BR";

    fala.rate = 0.9;

    fala.pitch = 1;

    fala.volume = 1;



    speechSynthesis.speak(fala);


}
// =====================================
// DATA E HORA DA BARRA SUPERIOR
// =====================================


function atualizarBarra(){


    let agora = new Date();



    let dia =
    String(agora.getDate()).padStart(2,"0");


    let mes =
    String(agora.getMonth()+1).padStart(2,"0");


    let ano =
    agora.getFullYear();



    let hora =
    String(agora.getHours()).padStart(2,"0")
    + ":" +
    String(agora.getMinutes()).padStart(2,"0")
    + ":" +
    String(agora.getSeconds()).padStart(2,"0");



    let dataHoje =
    document.getElementById("dataHoje");


    let horaBarra =
    document.getElementById("horaBarra");



    if(dataHoje){

        dataHoje.innerHTML =
        dia + "/" + mes + "/" + ano;

    }



    if(horaBarra){

        horaBarra.innerHTML =
        hora;

    }


}



// =====================================
// INICIAR SISTEMA
// =====================================


carregarPainel();


atualizarRelogio();


atualizarBarra();



setInterval(function(){

    atualizarRelogio();

},1000);



setInterval(function(){

    atualizarBarra();

},1000);