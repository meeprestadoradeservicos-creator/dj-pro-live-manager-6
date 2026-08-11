// ==========================================
// DJ PRO LIVE MANAGER 6.2
// ADMIN - PROGRAMAÇÃO ONLINE
// ==========================================

let listaDJ = [];


// ==========================================
// LOGIN
// ==========================================

function entrar(){

    let senha =
        document.getElementById("senha").value;

    if(senha === "1234"){

        // ADMINISTRADOR
        document.getElementById("login").style.display =
            "none";

        document.getElementById("painelAdmin").style.display =
            "block";

        carregarProgramacao();

    }else if(senha === "5678"){

        // OPERADOR
        document.getElementById("login").style.display =
            "none";

        document.getElementById("painelAdmin").style.display =
            "block";

        carregarProgramacao();

    }else{

        document.getElementById("erro").innerHTML =
            "Senha incorreta";

    }

}

// ==========================================
// VERIFICAR SUPABASE
// ==========================================

function verificarSupabase(){

    if(typeof supabase === "undefined"){

        alert(
            "Erro: conexão com o Supabase não carregou."
        );

        return false;

    }

    return true;

}


// ==========================================
// ADICIONAR DJ
// ==========================================

function adicionarDJ(){

    let horario =
        document.getElementById("novoHorario").value;

    let nome =
        document.getElementById("novoDJ").value;

    if(horario === "" || nome === ""){

        alert(
            "Preencha o horário e o nome do DJ."
        );

        return;

    }

    listaDJ.push({

        horario: horario,
        nome: nome

    });

    listaDJ.sort(function(a,b){

        return String(a.horario)
            .localeCompare(
                String(b.horario)
            );

    });

    atualizarTabela();

    document.getElementById(
        "novoHorario"
    ).value = "";

    document.getElementById(
        "novoDJ"
    ).value = "";

}


// ==========================================
// ATUALIZAR TABELA
// ==========================================

function atualizarTabela(){

    let corpo =
        document.getElementById(
            "corpoTabela"
        );

    if(!corpo) return;

    corpo.innerHTML = "";

    listaDJ.forEach(function(dj,index){

        corpo.innerHTML += `

        <tr>

            <td>
                ${dj.horario}
            </td>

            <td>
                ${dj.nome}
            </td>

            <td>

                <button
                    onclick="removerDJ(${index})">

                    🗑

                </button>

            </td>

        </tr>

        `;

    });

}


// ==========================================
// REMOVER DJ
// ==========================================

function removerDJ(indice){

    listaDJ.splice(
        indice,
        1
    );

    atualizarTabela();

}


// ==========================================
// SALVAR NO SUPABASE
// ==========================================

async function salvar(){

    if(!verificarSupabase()) return;


    let festa =
        document.getElementById(
            "festa"
        ).value;


    let noticias =
        document.getElementById(
            "noticias"
        ).value;


    if(festa === ""){

        alert(
            "Digite o nome da festa."
        );

        return;

    }


    if(listaDJ.length === 0){

        alert(
            "Adicione pelo menos um DJ."
        );

        return;

    }


    // Garantir ordem dos horários

    listaDJ.sort(function(a,b){

        return String(a.horario)
            .localeCompare(
                String(b.horario)
            );

    });


    try{

        // Procurar o registro mais recente

        const resultado =
            await supabase
                .from("painel")
                .select("id")
                .order(
                    "id",
                    {
                        ascending:false
                    }
                )
                .limit(1);


        if(resultado.error){

            console.error(
                resultado.error
            );

            alert(
                "Erro ao consultar o Supabase."
            );

            return;

        }


        let registro =
            resultado.data &&
            resultado.data.length
                ? resultado.data[0]
                : null;


        // ==================================
        // SE JÁ EXISTE REGISTRO, ATUALIZA
        // ==================================

        if(registro){

            const atualizacao =
                await supabase
                    .from("painel")
                    .update({

                        festa: festa,

                        noticias: noticias,

                        programacao: listaDJ

                    })
                    .eq(
                        "id",
                        registro.id
                    );


            if(atualizacao.error){

                console.error(
                    atualizacao.error
                );

                alert(
                    "Erro ao salvar a programação."
                );

                return;

            }

        }

        // ==================================
        // SE NÃO EXISTE, CRIA
        // ==================================

        else{

            const novoRegistro =
                await supabase
                    .from("painel")
                    .insert({

                        festa: festa,

                        noticias: noticias,

                        programacao: listaDJ

                    });


            if(novoRegistro.error){

                console.error(
                    novoRegistro.error
                );

                alert(
                    "Erro ao criar a programação."
                );

                return;

            }

        }


        // Também mantém uma cópia local

        localStorage.setItem(
            "festa",
            festa
        );

        localStorage.setItem(
            "noticias",
            noticias
        );

        localStorage.setItem(
            "listaDJ",
            JSON.stringify(listaDJ)
        );


        alert(
            "✅ Programação salva ONLINE com sucesso!"
        );


    }catch(erro){

        console.error(
            erro
        );

        alert(
            "Erro de conexão com o Supabase."
        );

    }

}


// ==========================================
// CARREGAR PROGRAMAÇÃO DO SUPABASE
// ==========================================

async function carregarProgramacao(){

    if(!verificarSupabase()) return;


    try{

        const resultado =
            await supabase
                .from("painel")
                .select(
                    "festa,noticias,programacao"
                )
                .order(
                    "id",
                    {
                        ascending:false
                    }
                )
                .limit(1);


        if(resultado.error){

            console.error(
                resultado.error
            );

            return;

        }


        if(
            resultado.data &&
            resultado.data.length
        ){

            let dados =
                resultado.data[0];


            if(
                Array.isArray(
                    dados.programacao
                )
            ){

                listaDJ =
                    dados.programacao;

            }


            if(
                document.getElementById("festa")
            ){

                document.getElementById(
                    "festa"
                ).value =
                    dados.festa || "";

            }


            if(
                document.getElementById("noticias")
            ){

                document.getElementById(
                    "noticias"
                ).value =
                    dados.noticias || "";

            }


            atualizarTabela();

        }

    }catch(erro){

        console.error(
            erro
        );

    }

}


// ==========================================
// INICIALIZAÇÃO
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    function(){

        // Primeiro tenta carregar do Supabase

        carregarProgramacao();

    }
);
