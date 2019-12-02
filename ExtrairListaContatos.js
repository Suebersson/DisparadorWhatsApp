//########################## Atualizado em 02/12/2019 ######################################################################
//Versão do WhatsApp 0.3.9308

var ListChats = new Array(), cont = 0, nome, numero, nTratado, nTratado2, sem55, Qt;

function ExtrairListaContatos(){
	
	console.clear();

	if (window.Store){
		
		for (q = 0; q < window.Store.Contact.length; q++){	
			//Se for um chat, se estiver salvo na lista de contatos, senão estiver bloqueado
			if (window.Store.Contact._models[q].__x_id.server == "c.us" && window.Store.Contact._models[q].__x_isMyContact == true){

				//console.log(window.Store.Contact._models[q].__x_name); //Nome
				//console.log(window.Store.Contact._models[q].__x_id.user); //Número completo
				
				numero = window.Store.Contact._models[q].__x_id.user;
				nome = removerAcentos(window.Store.Contact._models[q].__x_name);
				
				Qt = numero.length;				
				if (Qt == 13){
					nTratado = numero.slice(2,13)
					nTratado2 = numero.slice(0,9) + '-' + numero.slice(9,13);
					sem55 = numero.slice(2,9) + '-' + numero.slice(9,13);
				}else{
					nTratado = numero.slice(2,12)
					nTratado2 = numero.slice(0,8) + '-' + numero.slice(8,12);
					sem55 = numero.slice(2,8) + '-' + numero.slice(8,12);
				}
				
				ListChats[cont] = 'Nome: ' + nome +';numero: ' + numero + ';' + nome + ';' + numero + ';' +  nTratado + ';'  + nTratado2 + ';' + sem55; 					
				cont++
				
				Nome = ''; numero = ''; nTratado = ''; nTratado2 = ''; sem55 = '';
			}
		}

		ListChats = ListChats.filter(function(este,q){return ListChats.indexOf(este) == q;})
		console.log('Total de: ' + ListChats.length + ' Contatos')
		
		var data = new Date(); data = data.getDate() + "." + (data.getMonth()+1) + "." + data.getFullYear();
		printTxt(ListChats, 'Lista de Contatos' + ' - ' +  data + '.csv')
		ListChats = new Array();

	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida');
	}

}

function removerAcentos(newStringComAcento) {return newStringComAcento.normalize('NFD').replace(/[\u0300-\u036f]/g, "");}


