
//########################## Atualizado em 05/11/2020 ######################################################################
//Versão do WhatsApp: 2.2045.15

var ListaContatos = new Array(), Nacional, num, j = 0, chats;

function ExtrairMembrosGrupo(){

	console.clear();

	if (window.Store){
		//Ler o grupo ativo, ler os contatos do grupo e imprimir
		var chatActive = Store.Chat.active();
		
		if(chatActive.__x_isGroup == true){
			
			console.log('Chat_nome: ' + chatActive.__x_formattedTitle);
			console.log('Chat_server: ' + chatActive.__x_id.server);
			console.log('Chat_user: ' + chatActive.__x_id.user);
			console.log('Chat_Id: ' + chatActive.__x_id._serialized);
			
			chats = chatActive.__x_groupMetadata.participants._models;
			
			console.log('Total de participantes: ' + chats.length);
			
			if(chats.length > 2){
				
				//if (confirm("Deseja capturar apenas números nacionais?") == true){Nacional = 1;}else{Nacional = 0;}
				
				//https://sweetalert.js.org/
				swal("Deseja capturar apenas números nacionais?", {
					buttons: {
						Yes: "Sim",
						No: "Não"
					},
				}).then((value) => {
					switch (value) {
						case "Yes":
							Nacional = 1
							get_members()
							break;
						case "No":
							Nacional = 0
							get_members()
							break;
						default:
						//Não fazer nada
					}
				});

				function get_members(){
					for (q = 0; q < chats.length; q++){
						
						if(Store.Conn.__x_me.user == chats[q].__x_id.user){
							//Excluir o número da conta logada que também participa do grupo
						}else{
							//console.log(chats[q].__x_id.user);
							num = chats[q].__x_id.user
							
							if(Nacional == 1){
								if(num.slice(0, 2) == "55"){//remover o código 55
									ListaContatos[j] = num.slice(2, num.length)
									j++
								}
							}else{//Capturar todos os números, nacionais e internacionais
							
								if(num.slice(0, 2) == "55"){//remover o código 55
									ListaContatos[j] = num.slice(2, num.length)
									j++
								}else{
									ListaContatos[j] = num
									j++
								}
								
							}
						}
					}
					
					var fileNameToSaveAs = prompt('Digite ou verifique o nome do grupo (Excluindo emojis):', chatActive.__x_formattedTitle) + '.txt'; //Nome do txt

					if(fileNameToSaveAs != '' && fileNameToSaveAs != 'null.txt'){
	
						printTxt(ListaContatos, fileNameToSaveAs)
						ListaContatos = new Array()
					
					}else{
						alert("Nome do arquivo não inserido")
					}
	
				}
			
			}else{
				alert('Nesse grupo não à participantes suficiente para extrair os contatos')
			}
		
			
		}else{
			alert("O Chat selecionado não é um grupo")
		}

	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida')
	}

}

//Store.Chat.active().__x_groupMetadata.participants._models[0].__x_id.user.slice(0, 2);


