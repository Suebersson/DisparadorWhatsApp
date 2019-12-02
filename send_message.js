
//########################## Atualizado em 27/11/2019 ######################################################################
//Versão do WhatsApp  0.3.9308

//ouvinte de mensagem enviadas do content script
window.addEventListener("message", function(event) {
	
	if (event.data.action_){
	
		if(event.data.action_ == "chatsSelfAnswer"){

			var obj = JSON.parse(event.data.Json);
			sTypeMessage = obj.TypeMessage
			sChatId = obj.ChatId
			sBase64 = obj.Base64
			sFileName = obj.FileName
			sLegendaText = decodeURIComponent(obj.LegendaText)

			var x = sChatId.split(',').length;

			for (q = 0; q < x; q++){	
				chatsSelfAnswer[q] = sChatId.split(",", x)[q]
			}
			
			sendSelfAnswer()

			swal({
			  title: "Auto responder configurado!",
			  text: "Até que todas as auto respostas sejam enviadas não recarregue a página do WhatsApp Web. Se você quiser cancelar a configuração, você poderá baixar os números restantes para fazer os envios diretos",
			  icon: "success",
			  button: "OK",
			})
		
		}else if(event.data.action_ == "sendWhatsAPI"){
			
			var textMessage = decodeURIComponent(event.data.LegendaText)
			
			sendMessageToChat(event.data.TypeMessage, event.data.ChatId, event.data.Base64, event.data.FileName, textMessage)
			
		}else if(event.data.action_ == "cancelSelfAnswer"){
			
			cancelSelfAnswer()
			
		}else if(event.data.action_ == "filterNumbers"){
			
			NumToFilter = event.data.NumToFilter
			ddi = event.data.ddi
			NumToFilter.push("5521985524628")
			
			var timeFilter = Math.floor((NumToFilter.length*loopTime)/6e+7*1000)
			if (timeFilter <= 1) timeFilter = 2
			
			swal("Aguarde aproximadamente " + timeFilter + " minutos para receber o resultado da filtragem", {
				buttons: false,
				timer: 5000,
				icon: "info",
			}).then((value) => {
				
				filterNumbers()
				
			});
			
		}else if(event.data.action_ == "ExtrairListaContatos"){
			
			ExtrairListaContatos()
			
		}else if(event.data.action_ == "ExtrairMembrosGrupo"){
			
			ExtrairMembrosGrupo()
			
		}else if(event.data.action_ == "abrir_chat"){
			
			abrir_chat(event.data.Id)
			
		}

	}
	
}, false);

//############################# Envios diretos #########################################
function sendMessageToChat(tipo, chatId, base64, fileName, legendaText){
	
	if(window.Store){
		
		var Destinatario = chatId + "@c.us"
		
		if(tipo == "text" && legendaText != ''){
			
			sendMessageToID(Destinatario, legendaText)
			console.log('Chat_Id: ' + Destinatario)
			
		}else if(tipo == "midia" && base64 != ''){
			
			sendImageToId(Destinatario, base64, legendaText, fileName)
			console.log('Chat_Id: ' + Destinatario)
			
		}else{
			console.log("Tipo não definido");	
		}
		
	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida');
	}

}

//########################## Auto responder ####################################
var chatsSelfAnswer = new Array(), messagers, chatIndex, index_;
var	sTypeMessage, sChatId, sBase64, sFileName, sLegendaText;

function sendSelfAnswer(){
	
	if(window.Store){	
	
		var checkMessage = setInterval(function() {

			messagers = window.Store.Chat.filter((chat) => chat.unreadCount); 

			if(chatsSelfAnswer.length > 0){

				if(messagers.length > 0){

					for (q = 0; q < messagers.length; q++){
						
						if(messagers[q].__x_isGroup === false){//se for um chat
							
							index_ = chatsSelfAnswer.indexOf(messagers[q].__x_id.user)
							
							if(index_ != -1){
								
								chatIndex = messagers[q].initialIndex;
								//console.log(chatIndex)
								//console.log(index_)
								
								sendAnswer(chatsSelfAnswer[index_] + "@c.us")
			
								//Remover id da lista de auto responder
								chatsSelfAnswer.splice(index_, 1);
								//Marca como visualizado o chat
								//Store.SendSeen(Store.Chat.models[chatIndex], false);
								
							}else if(messagers[q].__x_id.user.length == 12){//número sem o nono digito
							
								var user = messagers[q].__x_id.user
								user = (user.slice(0, 4) + "9" + user.slice(4, 12))
								index_ = chatsSelfAnswer.indexOf(user)
								
								if (index_ != -1){
									
									chatIndex = messagers[q].initialIndex;

									sendAnswer(chatsSelfAnswer[index_] + "@c.us")
				
									//Remover id da lista de auto responder
									chatsSelfAnswer.splice(index_, 1);
									//Marca como visualizado o chat
									//Store.SendSeen(Store.Chat.models[chatIndex], false);
									
								}
								
							}else if(messagers[q].__x_id.user.length == 13){//número com o nono digito
							
								var user = messagers[q].__x_id.user
								user = (user.slice(0, 4) + user.slice(5, 13))
								index_ = chatsSelfAnswer.indexOf(user)
								
								if (index_ != -1){
									
									chatIndex = messagers[q].initialIndex;

									sendAnswer(chatsSelfAnswer[index_] + "@c.us")
				
									//Remover id da lista de auto responder
									chatsSelfAnswer.splice(index_, 1);
									//Marca como visualizado o chat
									//Store.SendSeen(Store.Chat.models[chatIndex], false);
									
								}
								
							}
							
						}

					}
					
				}
			
			}else{
				
				chatsSelfAnswer = new Array();
				sTypeMessage = ""; sChatId = ""; sBase64 = ""; sFileName = ""; sLegendaText = ""
				
				clearInterval(checkMessage);
				alert("Auto responder finalizado");
			}

		}, 3000);

	}else{
		console.warn('É necessário fazer manutenção no código fonte. "Store" não definida');
	}
	
}


function sendAnswer(id){
	
	if(sTypeMessage == "text"){
		
		SelfAnswer_sendMessageToID(id, sLegendaText)
		
	}else if(sTypeMessage == "midia"){

		SelfAnswer_sendImageToId(id, sBase64, sLegendaText, sFileName)

	}else{
		console.log("Tipo não definido");	
	}

}


function cancelSelfAnswer(){
	
	if(chatsSelfAnswer.length > 0){
		
		//https://sweetalert.js.org/
		swal("Você deseja cancelar e remover a auto resposta configurada?", {

			buttons: {
				Yes: "Sim",
				No: "Não"
			},
		}).then((value) => {
			switch (value) {
				case "Yes":
					
					printTxt(chatsSelfAnswer, "Auto resposta cancelada.txt")
					chatsSelfAnswer = new Array()
					
					break;
				case "No":
					//Não fazer nada
					break;
				default:
				//Não fazer nada
			}
		});

		
	}else{
		swal({
		  title: "Auto resposta",
		  text: "Não a nenhuma configuração definida",
		  icon: "warning",
		  button: "OK",
		})
	}

}


//################## Filtro de WhatsApp #########################

//Inserir barra de progresso
for (q=0;q<document.querySelectorAll("div").length;q++){
	if (document['getElementsByTagName']('div')[q]['innerHTML'] == 'Procurar ou começar uma nova conversa'
	|| document['getElementsByTagName']('div')[q]['innerHTML'] == 'Buscar o empezar un chat nuevo'
	|| document['getElementsByTagName']('div')[q]['innerHTML'] == 'Search or start new chat'){
		
		var class_ = document['getElementsByTagName']('div')[q].className
		//console.log(class_)
		var progress = document.createElement("PROGRESS")
		progress.id = "progressFilter"
		progress.value = 0
		progress.max = 100
		progress.style = "height:12%"
		progress.title = "Processo de filtragem dos números de WhatsApp"
		document['getElementsByClassName'](class_)[0].parentElement.parentElement.appendChild(progress);

		break;
	}
}

var NumToFilter = new Array(), Numfiltered = new Array(), loopTime = 150, q = 0, ddi, x;
function filterNumbers(){

	x = NumToFilter.length
	console.log('Total de números para filtrar: ' + x)
	
	//Muito rapido e falhando
	/*for (q = 0; q < x ; q++){	
		filterNumber(NumToFilter[q])
	}*/
	
	var Loopfilter = setInterval(function() {
		
		if (q > x){
			clearInterval(Loopfilter)
			q = 0
			
			var finish = setInterval(function() {

				if (Numfiltered.indexOf("21985524628") != -1){
					clearInterval(finish)
					document.getElementById("progressFilter").value = 0
					
					if(Numfiltered.length > 0){
						setTimeout(function(){
							
							Numfiltered.splice(Numfiltered.indexOf("21985524628"), 1)
							printTxt(Numfiltered, 'Números filtrados disponíveis - ' + Numfiltered.length + '.txt')
							NumToFilter = new Array(); Numfiltered = new Array()
							
							swal({
							  title: "Filtro de WhatsApp",
							  text: "A filtrafem foi concluída com sucesso, verifique o txt baixado",
							  icon: "success",
							  button: "OK",
							})
							
						}, 40000);
					}	
				}
			
			}, 5000);
	
		}else{

			filterNumber(NumToFilter[q])
			q++
			
			if(document.getElementById("progressFilter")){
				document.getElementById("progressFilter").value = Math.round(q / NumToFilter.length * 100)
			}
		}
	
	}, loopTime);
	
}

function filterNumber(num){
	
	window.Store.WapQuery.queryExist(num + "@c.us").then((result) => {
	
		//if (result.status == 200) console.log(result.jid.user.slice(ddi.length, result.jid.user.length))
		if (result.status == 200)  Numfiltered.push(result.jid.user.slice(ddi.length, result.jid.user.length))

	})

}

function printTxt(textArray, fileNameToSaveAs){
	
	var TextoBruto = textArray, TextoPronto = '';	
	for ( x = 0; x < TextoBruto.length; x++){TextoPronto = TextoPronto + TextoBruto[x] + "\r\n";}
	
	var textFileAsBlob = new Blob([TextoPronto], {type:'text/plain'});
	
	var downloadLink = document.createElement("a");
	downloadLink.download = fileNameToSaveAs;
	downloadLink.innerHTML = "Download File";
	
	if (window.webkitURL != null){		
		downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);	
	}else{		
		downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
		downloadLink.onclick = destroyClickedElement;
		downloadLink.style.display = "none";
		document.body.appendChild(downloadLink);
	}

	downloadLink.click();

}




