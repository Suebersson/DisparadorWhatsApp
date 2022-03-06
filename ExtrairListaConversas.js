
//########################## Atualizado em 06/03/2022 ######################################################################
//Versão do WhatsApp 2.2206.9

function ExtrairListaConversas(){
	
	console.clear();

	if (window.Store){
		
		var c = window.Store.Chat.length;
		
		for (q = 0; q < c; q++){
			//Se for um chat, se estiver salvo na lista de contatos, senão estiver bloqueado
			if (Store.Chat._models[q].__x_isGroup === false){
				
				numero = Store.Chat._models[q].__x_id.user;
				
				if(Store.Chat._models[q].__x_contact.__x_name !== undefined){
					nome = removerAcentos(Store.Chat._models[q].__x_contact.__x_name)
				}else{
					nome = removerAcentos(Store.Chat._models[q].__x_contact.__x_pushname)
				}
				
				//console.log(nome); //Nome
				//console.log(numero); //Número completo
				
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
		printTxt(ListChats, 'Lista de conversas' + ' - ' +  data + '.csv')
		ListChats = new Array();

	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida');
	}

}
