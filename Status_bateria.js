
var class_Name;
Atualizar_Status();
setInterval(Atualizar_Status, 120000);

function Atualizar_Status(){
	
	if (window.Store){
		if(Store.Conn.battery != undefined){
			if (class_Name == undefined){
				for (q=0;q<document.querySelectorAll("div").length;q++){
					
					if (document['getElementsByTagName']('div')[q]['innerHTML'] == 'Pesquisar ou começar uma nova conversa'
					|| document['getElementsByTagName']('div')[q]['innerHTML'] == 'Buscar o empezar un chat nuevo'
					|| document['getElementsByTagName']('div')[q]['innerHTML'] == 'Search or start new chat'){
					
						class_Name = document['getElementsByTagName']('div')[q].className
						document['getElementsByClassName'](class_Name)[0]['innerHTML'] = 'Status da Bateria: ' + Store.Conn.battery + '%';
						//console.log('Status da Bateria: ' + Store.Conn.battery + '%');
						break;
					}
				}
			}else{
				if (document['getElementsByClassName'](class_Name)[0]){
					document['getElementsByClassName'](class_Name)[0]['innerHTML'] = 'Status da Bateria: ' + Store.Conn.battery + '%';
					//console.log('Status da Bateria: ' + Store.Conn.battery + '%')
				}
			}
		}
	}else{
		console.log('É necessário fazer manutenção no código fonte. "Store" não definida');
	}
	
}
