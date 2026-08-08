// =====================================
// DJ PRO LIVE MANAGER 7.0
// PAINEL PRINCIPAL ONLINE
// =====================================

// =====================================
// CONEXÃO SUPABASE
// =====================================

const SUPABASE_URL =
    "https://ioltmxperuplbrpccffo.supabase.co";

const SUPABASE_KEY =
    "sb_publishable_CjJOUaV2x_taN_DorNADOA_q2chsO9U";

const supabaseClient =
    supabase.createClient(
        SUPABASE_URL,
        SUPABASE_KEY
    );


// =====================================
// VARIÁVEIS
// =====================================

let ultimoDJ = "";

let dadosPainel = {
    festa: "",
    noticias: "",
    programacao: []
};


// =====================================
// CARREGAR DADOS DO SUPABASE
// =====================================

async function carregarPainelOnline(){

    try {

       const { data, error } =
    await supabaseClient
        .from("painel")
        .select("*")
        .order("id", { ascending: false })
        .limit(1)
        .single();


        if(error){

            console.log(
                "Erro Supabase:",
                error
            );

            carregarPainelLocal();

            return;
        }


        if(data){

            dadosPainel = {

                festa:
                    data.festa || "",

                noticias:
                    data.noticias || "",

                programacao:
                    Array.isArray(data.programacao)
                        ? data.programacao
                        : []

            };


            // BACKUP LOCAL

            localStorage.setItem(
                "festa",
                dadosPainel.festa
            );

            localStorage.setItem(
                "noticias",
                dadosPainel.noticias
            );

            localStorage.setItem(
                "listaDJ",
                JSON.stringify(
                    dadosPainel.programacao
                )
            );


            mostrarDadosPainel();

        }

    } catch(erro) {

        console.log(
            "Erro de conexão:",
            erro
        );

        carregarPainelLocal();

    }

}


// =====================================
// BACKUP LOCAL
// =====================================

function carregarPainelLocal(){

    let festa =
        localStorage.getItem("festa");

    let noticias =
        localStorage.getItem("noticias");

    let lista =
        localStorage.getItem("listaDJ");


    dadosPainel = {

        festa:
            festa || "",

        noticias:
            noticias || "",

        programacao:
            lista
                ? JSON.parse(lista)
                : []

    };


    mostrarDadosPainel();

}


// =====================================
// MOSTRAR FESTA, NOTÍCIA E PROGRAMAÇÃO
// =====================================

function mostrarDadosPainel(){

    let evento =
        document.getElementById("evento");


    let noticias =
        document.getElementById("noticias");


    if(evento){

        evento.innerHTML =
            dadosPainel.festa ||
            "NOME DA FESTA";

    }


    if(noticias){

        noticias.innerHTML =

            '<div class="noticiaRolando">' +

            (
                dadosPainel.noticias ||
                "🍻 Bem-vindos • Família Pagode • Equipe Tenebrosa"
            ) +

            '</div>';

    }


    mostrarLista(
        dadosPainel.programacao
    );

}


// =====================================
// MOSTRAR PROGRAMAÇÃO
// =====================================

function mostrarLista(listaDJ){

    let texto = "";


    if(!Array.isArray(listaDJ)){

        listaDJ = [];

    }


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

        lista.innerHTML =
            texto;

    }

}


// =====================================
// RELÓGIO
// =====================================

function atualizarRelogio(){

    const agora =
        new Date();


    let h =
        String(
            agora.getHours()
        ).padStart(2,"0");


    let m =
        String(
            agora.getMinutes()
        ).padStart(2,"0");


    let s =
        String(
            agora.getSeconds()
        ).padStart(2,"0");


    let relogio =
        document.getElementById(
            "relogio"
        );


    if(relogio){

        relogio.innerHTML =
            h + ":" +
            m + ":" +
            s;

    }


    verificarDJ(
        h + ":" + m
    );

}


// =====================================
// DJ ATUAL / PRÓXIMO DJ
// =====================================

function verificarDJ(horaAtual){

    let listaDJ =
        dadosPainel.programacao;


    if(
        !Array.isArray(listaDJ) ||
        listaDJ.length === 0
    ){

        return;

    }


    let atual =
        "AGUARDANDO";


    let proximo =
        "SEM PROGRAMAÇÃO";


    let proximoHorario =
        null;


    for(
        let i = 0;
        i < listaDJ.length;
        i++
    ){

        if(
            horaAtual >=
            listaDJ[i].horario
        ){

            atual =
                listaDJ[i].nome;


            if(
                i + 1 <
                listaDJ.length
            ){

                proximo =
                    listaDJ[i + 1].nome;


                proximoHorario =
                    listaDJ[i + 1].horario;

            }

        }

    }


    let campoAtual =
        document.getElementById(
            "djAtual"
        );


    let campoProximo =
        document.getElementById(
            "proximoDJ"
        );


    if(campoAtual){

        campoAtual.innerHTML =
            atual;

    }


    if(campoProximo){

        campoProximo.innerHTML =
            proximo;

    }


    atualizarContador(
        proximoHorario
    );


    // =================================
    // TROCA DE DJ
    // =================================

    if(
        atual !== ultimoDJ &&
        atual !== "AGUARDANDO"
    ){

        ultimoDJ =
            atual;


        mostrarTroca(
            atual
        );


        anunciarDJ(
            atual
        );

    }

}


// =====================================
// CONTADOR
// =====================================

function atualizarContador(
    proximoHorario
){

    let contador =
        document.getElementById(
            "contador"
        );


    if(!contador){

        return;

    }


    if(!proximoHorario){

        contador.innerHTML =
            "00:00:00";

        return;

    }


    let agora =
        new Date();


    let partes =
        proximoHorario.split(":");


    let destino =
        new Date();


    destino.setHours(
        Number(partes[0]),
        Number(partes[1]),
        0,
        0
    );


    let diferenca =
        destino - agora;


    if(diferenca < 0){

        contador.innerHTML =
            "00:00:00";

        return;

    }


    let total =
        Math.floor(
            diferenca / 1000
        );


    let horas =
        Math.floor(
            total / 3600
        );


    let minutos =
        Math.floor(
            (total % 3600) / 60
        );


    let segundos =
        total % 60;


    contador.innerHTML =

        String(horas)
            .padStart(2,"0")

        + ":" +

        String(minutos)
            .padStart(2,"0")

        + ":" +

        String(segundos)
            .padStart(2,"0");

}


// =====================================
// TELA DE TROCA
// =====================================

function mostrarTroca(nome){

    let nomeTela =
        document.getElementById(
            "nomeTroca"
        );


    let tela =
        document.getElementById(
            "telaTroca"
        );


    if(nomeTela){

        nomeTela.innerHTML =
            nome;

    }


    if(tela){

        tela.style.display =
            "flex";


        setTimeout(
            function(){

                tela.style.display =
                    "none";

            },
            3000
        );

    }

}


// =====================================
// VOZ DO DJ
// =====================================

function anunciarDJ(nome){

    if(
        !("speechSynthesis" in window)
    ){

        return;

    }


    speechSynthesis.cancel();


    let nomeVoz = nome.replace(/^DJ\s+/i, "");

let mensagem =
    "Atenção galera! " +
    "Entrando no comando,DJ " +
    nomeVoz;

    let fala =
        new SpeechSynthesisUtterance(
            mensagem
        );


    fala.lang =
        "pt-BR";


    fala.rate =
        0.9;


    fala.pitch =
        1;


    fala.volume =
        1;


    speechSynthesis.speak(
        fala
    );

}


// =====================================
// DATA E HORA DA BARRA
// =====================================

function atualizarBarra(){

    let agora =
        new Date();


    let dia =
        String(
            agora.getDate()
        ).padStart(2,"0");


    let mes =
        String(
            agora.getMonth() + 1
        ).padStart(2,"0");


    let ano =
        agora.getFullYear();


    let hora =
        String(
            agora.getHours()
        ).padStart(2,"0")

        + ":" +

        String(
            agora.getMinutes()
        ).padStart(2,"0")

        + ":" +

        String(
            agora.getSeconds()
        ).padStart(2,"0");


    let dataHoje =
        document.getElementById(
            "dataHoje"
        );


    let horaBarra =
        document.getElementById(
            "horaBarra"
        );


    if(dataHoje){

        dataHoje.innerHTML =
            dia + "/" +
            mes + "/" +
            ano;

    }


    if(horaBarra){

        horaBarra.innerHTML =
            hora;

    }

}


// =====================================
// INICIAR SISTEMA
// =====================================

carregarPainelOnline();

atualizarRelogio();

atualizarBarra();


// =====================================
// ATUALIZAÇÃO DO RELÓGIO
// =====================================

setInterval(
    function(){

        atualizarRelogio();

    },
    1000
);


// =====================================
// ATUALIZAÇÃO DA BARRA
// =====================================

setInterval(
    function(){

        atualizarBarra();

    },
    1000
);


// =====================================
// ATUALIZAÇÃO DO SUPABASE
// =====================================

setInterval(
    function(){

        carregarPainelOnline();

    },
    5000
);
// =====================================
// SUPABASE REALTIME
// ATUALIZAÇÃO AUTOMÁTICA DO PAINEL
// =====================================

supabaseClient
    .channel("painel-online")
    .on(
        "postgres_changes",
        {
            event: "*",
            schema: "public",
            table: "painel"
        },
        function(payload){

            console.log(
                "Atualização recebida:",
                payload
            );

            carregarPainelOnline();

        }
    )
    .subscribe();
