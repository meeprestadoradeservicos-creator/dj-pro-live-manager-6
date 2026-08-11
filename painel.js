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
// CONVERTER PROGRAMAÇÃO
// =====================================

function normalizarProgramacao(programacao) {

    if (Array.isArray(programacao)) {
        return programacao;
    }

    if (typeof programacao === "string") {

        try {
            const convertido = JSON.parse(programacao);

            if (Array.isArray(convertido)) {
                return convertido;
            }

        } catch (erro) {

            console.log(
                "Não foi possível converter a programação:",
                erro
            );

        }

    }

    return [];
}


// =====================================
// CONVERTER HORÁRIO PARA MINUTOS
// =====================================

function horarioParaMinutos(horario) {

    if (!horario) {
        return null;
    }

    let texto =
        String(horario)
            .trim()
            .substring(0, 5);

    let partes =
        texto.split(":");

    if (partes.length !== 2) {
        return null;
    }

    let horas =
        Number(partes[0]);

    let minutos =
        Number(partes[1]);

    if (
        Number.isNaN(horas) ||
        Number.isNaN(minutos)
    ) {
        return null;
    }

    return (
        horas * 60 +
        minutos
    );
}


// =====================================
// CARREGAR DADOS DO SUPABASE
// =====================================

async function carregarPainelOnline() {

    try {

        const resposta =
            await fetch(
                SUPABASE_URL +
                "/rest/v1/painel?select=*&order=id.desc&limit=1",
                {
                    method: "GET",

                    headers: {
                        "apikey": SUPABASE_KEY,
                        "Authorization":
                            "Bearer " + SUPABASE_KEY
                    }
                }
            );


        if (!resposta.ok) {

            console.log(
                "Erro API Supabase:",
                resposta.status
            );

            return;

        }


        const lista =
            await resposta.json();


        if (
            !Array.isArray(lista) ||
            lista.length === 0
        ) {

            console.log(
                "Nenhum registro encontrado no Supabase."
            );

            return;

        }


        const data =
            lista[0];


        dadosPainel = {

            festa:
                data.festa || "",

            noticias:
                data.noticias || "",

            programacao:
                normalizarProgramacao(
                    data.programacao
                )

        };


        console.log(
            "Programação recebida:",
            dadosPainel.programacao
        );


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


        // Atualiza imediatamente o DJ
        atualizarDJAgora();


    } catch (erro) {

        console.log(
            "Erro de conexão com Supabase:",
            erro
        );

        carregarPainelLocal();

    }

}


// =====================================
// BACKUP LOCAL
// =====================================

function carregarPainelLocal() {

    let festa =
        localStorage.getItem(
            "festa"
        );


    let noticias =
        localStorage.getItem(
            "noticias"
        );


    let lista =
        localStorage.getItem(
            "listaDJ"
        );


    let programacao = [];


    if (lista) {

        try {

            programacao =
                JSON.parse(lista);

        } catch (erro) {

            programacao = [];

        }

    }


    dadosPainel = {

        festa:
            festa || "",

        noticias:
            noticias || "",

        programacao:
            normalizarProgramacao(
                programacao
            )

    };


    mostrarDadosPainel();

    atualizarDJAgora();

}


// =====================================
// MOSTRAR FESTA / NOTÍCIAS
// =====================================

function mostrarDadosPainel() {

    let evento =
        document.getElementById(
            "evento"
        );


    let noticias =
        document.getElementById(
            "noticias"
        );


    if (evento) {

        evento.innerHTML =
            dadosPainel.festa ||
            "NOME DA FESTA";

    }


   if (noticias) {

    noticias.innerHTML =
        '<marquee behavior="scroll" direction="left" scrollamount="6">' +
        (
            dadosPainel.noticias ||
            "🍻 Bem-vindos • Família Pagode • Equipe Tenebrosa"
        ) +
        '</marquee>';

}
    mostrarLista(
        dadosPainel.programacao
    );

}


// =====================================
// MOSTRAR PROGRAMAÇÃO
// =====================================

function mostrarLista(listaDJ) {

    let lista =
        document.getElementById(
            "lista"
        );


    if (!lista) {
        return;
    }


    listaDJ =
        normalizarProgramacao(
            listaDJ
        );


    if (listaDJ.length === 0) {

        lista.innerHTML =
            "SEM PROGRAMAÇÃO";

        return;

    }


    let texto = "";


    listaDJ.forEach(function(dj) {

        texto +=
            String(
                dj.horario || ""
            ) +
            " - " +
            String(
                dj.nome || "DJ"
            ) +
            "<br>";

    });


    lista.innerHTML =
        texto;

}


// =====================================
// RELÓGIO
// =====================================

function atualizarRelogio() {

    const agora =
        new Date();


    let h =
        String(
            agora.getHours()
        ).padStart(2, "0");


    let m =
        String(
            agora.getMinutes()
        ).padStart(2, "0");


    let s =
        String(
            agora.getSeconds()
        ).padStart(2, "0");


    let relogio =
        document.getElementById(
            "relogio"
        );


    if (relogio) {

        relogio.innerHTML =
            h + ":" +
            m + ":" +
            s;

    }


    atualizarDJAgora();

}


// =====================================
// ESCOLHER DJ ATUAL
// =====================================

function atualizarDJAgora() {

    let listaDJ =
        normalizarProgramacao(
            dadosPainel.programacao
        );


    if (
        listaDJ.length === 0
    ) {

        atualizarCamposDJ(
            "AGUARDANDO",
            "AGUARDANDO",
            null
        );

        return;

    }


    // Ordena pelo horário
    listaDJ =
        [...listaDJ].sort(
            function(a, b) {

                let horaA =
                    horarioParaMinutos(
                        a.horario
                    );

                let horaB =
                    horarioParaMinutos(
                        b.horario
                    );


                if (horaA === null) {
                    return 1;
                }


                if (horaB === null) {
                    return -1;
                }


                return horaA - horaB;

            }
        );


    const agora =
        new Date();


    const minutosAgora =
        agora.getHours() * 60 +
        agora.getMinutes();


    let indiceAtual = -1;


    // Procura o último DJ
    // cujo horário já chegou
    for (
        let i = 0;
        i < listaDJ.length;
        i++
    ) {

        let minutosDJ =
            horarioParaMinutos(
                listaDJ[i].horario
            );


        if (
            minutosDJ !== null &&
            minutosDJ <= minutosAgora
        ) {

            indiceAtual = i;

        }

    }


    // =================================
    // AINDA NÃO CHEGOU O PRIMEIRO DJ
    // =================================

    if (indiceAtual === -1) {

        let primeiro =
            listaDJ[0];


        atualizarCamposDJ(
            "AGUARDANDO",
            primeiro.nome || "DJ",
            primeiro.horario || null
        );


        return;

    }


    // =================================
    // DJ ATUAL
    // =================================

    let atual =
        listaDJ[indiceAtual];


    // =================================
    // PRÓXIMO DJ
    // =================================

    let indiceProximo =
        indiceAtual + 1;


    let proximo = null;


    if (
        indiceProximo <
        listaDJ.length
    ) {

        proximo =
            listaDJ[indiceProximo];

    }


    let nomeAtual =
        atual.nome ||
        "DJ";


    let nomeProximo =
        proximo
            ? (
                proximo.nome ||
                "DJ"
            )
            : "SEM PROGRAMAÇÃO";


    let horarioProximo =
        proximo
            ? (
                proximo.horario ||
                null
            )
            : null;


    atualizarCamposDJ(
        nomeAtual,
        nomeProximo,
        horarioProximo
    );


    // =================================
    // DETECTAR TROCA
    // =================================

    if (
        nomeAtual !== ultimoDJ
    ) {

        let eraOutroDJ =
            ultimoDJ !== "" &&
            ultimoDJ !== nomeAtual;


        ultimoDJ =
            nomeAtual;


        if (eraOutroDJ) {

            mostrarTroca(
                nomeAtual
            );


            anunciarDJ(
                nomeAtual
            );

        }

    }

}


// =====================================
// ATUALIZAR CAMPOS DO PAINEL
// =====================================

function atualizarCamposDJ(
    atual,
    proximo,
    horarioProximo
) {

    let campoAtual =
        document.getElementById(
            "djAtual"
        );


    let campoProximo =
        document.getElementById(
            "proximoDJ"
        );


    if (campoAtual) {

        campoAtual.innerHTML =
            atual;

    }


    if (campoProximo) {

        campoProximo.innerHTML =
            proximo;

    }


    atualizarContador(
        horarioProximo
    );

}


// =====================================
// CONTADOR
// =====================================

function atualizarContador(
    proximoHorario
) {

    let contador =
        document.getElementById(
            "contador"
        );


    if (!contador) {
        return;
    }


    if (!proximoHorario) {

        contador.innerHTML =
            "00:00:00";

        return;

    }


    let partes =
        String(
            proximoHorario
        )
        .trim()
        .substring(0, 5)
        .split(":");


    if (
        partes.length !== 2
    ) {

        contador.innerHTML =
            "00:00:00";

        return;

    }


    let horas =
        Number(
            partes[0]
        );


    let minutos =
        Number(
            partes[1]
        );


    if (
        Number.isNaN(horas) ||
        Number.isNaN(minutos)
    ) {

        contador.innerHTML =
            "00:00:00";

        return;

    }


    let agora =
        new Date();


    let destino =
        new Date();


    destino.setHours(
        horas,
        minutos,
        0,
        0
    );


    // Se o próximo horário já passou,
    // significa que é amanhã.
    if (
        destino <= agora
    ) {

        destino.setDate(
            destino.getDate() + 1
        );

    }


    let diferenca =
        destino - agora;


    let total =
        Math.floor(
            diferenca / 1000
        );


    let h =
        Math.floor(
            total / 3600
        );


    let m =
        Math.floor(
            (total % 3600) / 60
        );


    let s =
        total % 60;


    contador.innerHTML =

        String(h)
            .padStart(2, "0")

        + ":" +

        String(m)
            .padStart(2, "0")

        + ":" +

        String(s)
            .padStart(2, "0");

}


// =====================================
// TELA DE TROCA
// =====================================

function mostrarTroca(nome) {

    let nomeTela =
        document.getElementById(
            "nomeTroca"
        );


    let tela =
        document.getElementById(
            "telaTroca"
        );


    if (nomeTela) {

        nomeTela.innerHTML =
            nome;

    }


    if (tela) {

        tela.style.display =
            "flex";


        setTimeout(
            function() {

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

// =====================================
// VOZ DO DJ
// =====================================

function anunciarDJ(nome) {

    if (!("speechSynthesis" in window)) {

        console.log(
            "Voz não disponível neste navegador."
        );

        return;

    }


    // Cancela qualquer fala anterior
    window.speechSynthesis.cancel();


    let nomeVoz =
        String(nome)
            .replace(/^DJ\s+/i, "")
            .trim();


    let mensagem =
        "Atenção galera! " +
        "Entrando agora no comando, DJ " +
        nomeVoz;


    let fala =
        new SpeechSynthesisUtterance(
            mensagem
        );


    fala.lang =
        "pt-BR";


    // Voz mais clara e um pouco mais rápida
    fala.rate =
        1.0;


    fala.pitch =
        1.0;


    // Volume máximo permitido pela API
    fala.volume =
        1.0;


    // Tenta selecionar uma voz brasileira
    let vozes =
        window.speechSynthesis.getVoices();


    let vozBrasileira =
        vozes.find(function(voz) {

            return (
                voz.lang &&
                voz.lang
                    .toLowerCase()
                    .startsWith("pt-br")
            );

        });


    if (vozBrasileira) {

        fala.voice =
            vozBrasileira;

    }


    // Fala imediatamente
    window.speechSynthesis.speak(
        fala
    );


    console.log(
        "🔊 ANUNCIANDO DJ:",
        nomeVoz
    );

}
// =====================================
// DATA E HORA DA BARRA
// =====================================

function atualizarBarra() {

    let agora =
        new Date();


    let dia =
        String(
            agora.getDate()
        ).padStart(2, "0");


    let mes =
        String(
            agora.getMonth() + 1
        ).padStart(2, "0");


    let ano =
        agora.getFullYear();


    let hora =
        String(
            agora.getHours()
        ).padStart(2, "0")

        + ":" +

        String(
            agora.getMinutes()
        ).padStart(2, "0")

        + ":" +

        String(
            agora.getSeconds()
        ).padStart(2, "0");


    let dataHoje =
        document.getElementById(
            "dataHoje"
        );


    let horaBarra =
        document.getElementById(
            "horaBarra"
        );


    if (dataHoje) {

        dataHoje.innerHTML =
            dia + "/" +
            mes + "/" +
            ano;

    }


    if (horaBarra) {

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
    function() {

        atualizarRelogio();

    },
    1000
);


// =====================================
// ATUALIZAÇÃO DA BARRA
// =====================================

setInterval(
    function() {

        atualizarBarra();

    },
    1000
);


// =====================================
// ATUALIZAÇÃO DO SUPABASE
// =====================================

setInterval(
    function() {

        carregarPainelOnline();

    },
    5000
);


console.log(
    "====================================="
);

console.log(
    "PAINEL.JS CARREGADO CORRETAMENTE"
);

console.log(
    "SUPABASE:",
    SUPABASE_URL
);

console.log(
    "PROGRAMACAO:",
    dadosPainel.programacao
);

console.log(
    "====================================="
);
