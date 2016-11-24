class NegociacaoService {
    constructor(){
        this._http = new HttpService();
    }

    obterNegociacoesDaSemana(){
        
        return new Promise((resolve, reject) => {
            this._http
            .get('negociacoes/semana')
            .then(negociacoes => {
                resolve(negociacoes.map(obj => new Negociacao(new Date(obj.data), obj.quantidade,obj.valor)));
            })
            .catch(erro => {
                console.log(erro);
                reject('Não foi possivel obter as negociações da semana')
            });

        });

    }

    obterNegociacoesDaSemanaAnterior(){

        return new Promise((resolve, reject) => {
            this._http
            .get('negociacoes/anterior')
            .then(negociacoes => {
                  resolve(negociacoes.map(obj => new Negociacao(new Date(obj.data), obj.quantidade,obj.valor)));
            })
            .catch(erro => {
                console.log(erro);
                reject('Não foi possivel obter as negociações da semana anterior')
            });

        });
    }

    obterNegociacoesDaSemanaRetrasada(){
        return new Promise((resolve, reject) => {
            this._http
            .get('negociacoes/retrasada')
            .then(negociacoes => {
                  resolve(negociacoes.map(obj => new Negociacao(new Date(obj.data), obj.quantidade,obj.valor)));
            })
            .catch(erro => {
                console.log(erro);
                reject('Não foi possivel obter as negociações da semana retrasada')
            });
        });
    } 

    cadastra(negociacao){

         return ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.adiciona(negociacao))
                .then(() => 'Negociação adicionada com sucesso')
                .catch(() => {
                    console.log(erro);
                    throw new Error('Não foi possível adicionar a negociação')
                });
    }
    lista(){
        return ConnectionFactory
                .getConnection()
                .then(connection => new NegociacaoDao(connection))
                .then(dao => dao.listaTodos())
                .catch(erro => {
                    console.log(erro);
                    throw new Error('Não foi possivel obter as negociações');
                });
    }
    apaga(){
      return ConnectionFactory
            .getConnection()
            .then(connection => new NegociacaoDao(connection))
            .then(dao => dao.apagaTodos())
            .then(mensagem => 'Negociações apagadas com sucesso')
            .catch(erro => {
                    console.log(erro);
                    throw new Error('Não foi possivel apagar as negociações');
            })
           
    }
    importa(listaAtual){
        
      return Promise.all([
                this.obterNegociacoesDaSemana(),
                this.obterNegociacoesDaSemanaAnterior(),
                this.obterNegociacoesDaSemanaRetrasada()]
            ).then(negociacoes => {
                return  negociacoes
                        .reduce((arrayAchatado, array) => arrayAchatado.concat(array),[])
                        .filter(negociacao => 
                            !listaAtual.some(negociacaoExistente => 
                            JSON.stringify(negociacao) == JSON.stringify(negociacaoExistente)))   
                       
            }).catch(erro => {
                console.log(erro);
                throw new Error('Não foi possivel buscar negociações para importar');
            })
    }       
}