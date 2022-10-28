// guardar informação
var arrayObitos = [],
resultTable = document.querySelector('#result-table');

// processar a request ao clicar em 'enviar'
const enviarBulk = ()=>{

    // pega o valor do input
    var list = document.getElementById('campo-bulk').value.split(' ');
    var total = list.map(function(item) {
        return item.trim();
    });

    //reseta a interface
    resultTable.innerHTML = "",
    arrayObitos = [];
    document.querySelector('#btn-excel').classList.add('hidden');
    document.querySelector('#filter-result').classList.remove('hidden');
    document.querySelector('#filter-result').classList.add('hidden');
    document.querySelector('#result').classList.remove('hidden');

    // loop que corre os CPF e guarda informações dos que forem encontrados
    var fetchURL,
    respostaItem,
    stringJson,
    arrayJson;

    total.forEach(function (item, index) {
        fetchURL = `https://api-sp.dataprev.gov.br/registro-civil/v1.0.0/obitos?cpf=${item}&buscaNomeExato=true`;

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
        .then( respostaObj => respostaItem = respostaObj )
        .then( ()=> console.log(respostaItem) )
        .then( ()=> arrayObitos.push(respostaItem) )
        .then( ()=> console.log(arrayObitos) )
        .then( ()=> arrayJson = {arrayObitos})
        .then( () => stringJson  = JSON.stringify(arrayJson, null, 4) )
        .then( () => {
            document.querySelector('#result').innerHTML = stringJson;
        } )
    });
}

// variáveis dos elementos dos botões de visualização dos resultados
var resultGeral = document.querySelector('#result'),
resultFiltro = document.querySelector('#filter-result');

// mostrar o resultado geral
const showGeral = ()=>{
    resultFiltro.classList.add('hidden');
    resultGeral.classList.remove('hidden');
}

// mostrar o resultado filtrado
const showFiltrado = ()=>{
    resultGeral.classList.add('hidden');
    resultFiltro.classList.remove('hidden');
    document.querySelector('#btn-excel').classList.remove('hidden');

    if ( resultTable.innerHTML === "" ){
        resultTable.innerHTML = 
        `
        <tr>
            <th>Nome</th>
            <th>Documento</th>
            <th>Num. Documento</th>
            <th>Matrícula</th>
            <th>Data da Lavratura</th>
            <th>Sexo</th>
            <th>Data de Nascimento</th>
            <th>Data do Óbito (ano-mês-dia)</th>
        </tr>
        `;
        arrayObitos.map(function(registro, index) {
            resultTable.innerHTML += 
            `
            <tr>
                <td>${registro.nomeFalecido}</td>
                <td>${registro.documentos[0].tipo}</td>
                <td>${registro.documentos[0].numero}</td>
                <td>${registro.matricula}</td>
                <td>${registro.dataLavratura}</td>
                <td>${registro.sexoFalecido}</td>
                <td>${registro.dataNascimento}</td>
                <td>${registro.dataObito.slice(0, 10)}</td>
            </tr>
            `
        });
    }

    console.log(arrayObitos);
}

// fazer download de arquivo .xls da tabela de resultado
function exportToExcel(){
    var htmls = "";
                var uri = 'data:application/vnd.ms-excel;base64,';
                var template = '<html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40"><head><!--[if gte mso 9]><xml><x:ExcelWorkbook><x:ExcelWorksheets><x:ExcelWorksheet><x:Name>{worksheet}</x:Name><x:WorksheetOptions><x:DisplayGridlines/></x:WorksheetOptions></x:ExcelWorksheet></x:ExcelWorksheets></x:ExcelWorkbook></xml><![endif]--> <meta charset="UTF-8"> </head><body><table>{table}</table></body></html>'; 
                var base64 = function(s) {
                    return window.btoa(unescape(encodeURIComponent(s)))
                };
    
                var format = function(s, c) {
                    return s.replace(/{(\w+)}/g, function(m, p) {
                        return c[p];
                    })
                };
    
                htmls = document.querySelector('#result-list').innerHTML;
    
                var ctx = {
                    worksheet : 'Worksheet',
                    table : htmls
                }
    
    
                var link = document.createElement("a");
                link.download = "export.xls";
                link.href = uri + base64(format(template, ctx));
                link.click();
    }