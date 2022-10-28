const enviar = ()=>{
    var respostaJson,
    stringJson;

    // reseta o campo de resultado
    document.querySelector('#result').innerHTML = "Resultado:";

    // pega os valores dos inputs
    var cpf = document.getElementById('campo-cpf').value,
    nome = document.getElementById('campo-nome').value,
    filiacao = document.getElementById('campo-filiacao').value;

    var paramNome = "",
    paramFiliacao = "",
    paramCPF = "";

    // cria as variáveis de parâmetros de busca para cada campo de texto preenchido
    if (nome.length > 0) {
        paramNome = "nomeFalecido="+nome
    }
    if (filiacao.length > 0) {
        paramFiliacao = "nomeFiliacao="+filiacao
    }
    if (cpf.length > 0) {
        paramCPF = "cpf="+cpf
    }

    // compor a URL que será usada na requisição à API
    var fetchURL = `https://api-sp.dataprev.gov.br/registro-civil/v1.0.0/obitos?${paramCPF+"&"+paramNome+"&"+paramFiliacao}&buscaNomeExato=true`;
    
    // faz uma request na API e registra o retorno
    fetch(fetchURL, {
        headers: {
            'accept': 'application/json',
            'Authorization': 'Bearer 01f13133-c2ca-3c50-a801-ce0d8faa1829'
        }
    })
    .then(res => responseInfo = res)
    .then( () => {
        document.querySelector('#status').innerHTML = "Status da consulta: "+responseInfo.statusText;
    } )
    .then( () => responseInfo.json() )
    .then( respostaObj => respostaJson = respostaObj )
    .then( () => console.log( respostaJson ) )
    .then( () => stringJson  = JSON.stringify(respostaJson, null, 4) )
    .then( () => {
        document.querySelector('#result').innerHTML = stringJson;
    } )
    .catch( error => console.log(error))

    // reseta todos os campos de texto da aplicação
    var elements = document.getElementsByTagName("input");
        for (var ii=0; ii < elements.length; ii++) {
        if (elements[ii].type == "text") {
            elements[ii].value = "";
        }
    } // mudar isso depois para não acabar removendo a token (usar cookies?)
}


