class NegociacaoService {

    obterNegociacoesDaSemana(callback){

        let xhr = new XMLHttpRequest();
        xhr.open('GET','negociacoes/semana');
        xhr.onreadystatechange = () => {
            if(xhr.readyState == 4){
                if(xhr.status == 200){
                    callback(null,JSON.parse(xhr.responseText)
                    .map(obj => new Negociacao(new Date(obj.data), obj.quantidade,obj.valor)));                    
                }else{
                    console.log(xhr.responseText);
                    callback('Não foi possivel obter as negociações', null);
                }
            }
        };
        xhr.send();
    }
}