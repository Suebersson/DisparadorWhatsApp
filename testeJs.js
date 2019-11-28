//alert('teste Github');
//console.log('teste Github');

/*
var GitHub = document.createElement("script");
GitHub.id = '_gitHub';
GitHub.type = 'text/javascript';
//GitHub.async = true; //Executar script junto com o carregamento da página
GitHub.src = "https://Suebersson.github.io/DisparadorWhatsApp/testeJs.js";
GitHub.onload = function() {this.parentNode.removeChild(this);}
document.body.appendChild(GitHub); //será carregado no body da página
*/


//########################## Atualizado em 27/11/2019 ######################################################################
//Versão do WhatsApp  0.3.9308

//https://gist.github.com/phpRajat/a6422922efae32914f4dbd1082f3f412
//https://github.com/danielcardeenas/sulla/blob/master/src/lib/wapi.js

/**
 * This script contains WAPI functions that need to be run in the context of the webpage
 */

/**
 * Auto discovery the webpack object references of instances that contains all functions used by the WAPI
 * functions and creates the Store object.
 */

if (!window.Store) {
	(function () {
		function getStore(modules) {
			let foundCount = 0;
			let neededObjects = [
				{ id: "Store", conditions: (module) => (module.Chat && module.Msg) ? module : null },
				{ id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processFiles !== undefined) ? module.default : null },
				{ id: "ChatClass", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat") ? module : null },
				{ id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
				{ id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
				{ id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
				{ id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
				{ id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
				{ id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
				{ id: "WapQuery", conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
				{ id: "CryptoLib", conditions: (module) => (module.decryptE2EMedia) ? module : null },
				{ id: "OpenChat", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.openChat) ? module.default : null },
				{ id: "UserConstructor", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.isServer && module.default.prototype.isUser) ? module.default : null },
				{ id: "SendTextMsgToChat", conditions: (module) => (module.sendTextMsgToChat) ? module.sendTextMsgToChat : null },
				{ id: "SendSeen", conditions: (module) => (module.sendSeen) ? module.sendSeen : null },
				{ id: "sendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null }
			];
			for (let idx in modules) {
				if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
					let first = Object.values(modules[idx])[0];
					if ((typeof first === "object") && (first.exports)) {
						for (let idx2 in modules[idx]) {
							let module = modules(idx2);
							if (!module) {
								continue;
							}
							neededObjects.forEach((needObj) => {
								if (!needObj.conditions || needObj.foundedModule)
									return;
								let neededModule = needObj.conditions(module);
								if (neededModule !== null) {
									foundCount++;
									needObj.foundedModule = neededModule;
								}
							});
							if (foundCount == neededObjects.length) {
								break;
							}
						}

						let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
						window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
						neededObjects.splice(neededObjects.indexOf(neededStore), 1);
						neededObjects.forEach((needObj) => {
							if (needObj.foundedModule) {
								window.Store[needObj.id] = needObj.foundedModule;
							}
						});
						
						return window.Store;
					}
				}
			}
		}

		webpackJsonp([], { 'parasite': (x, y, z) => getStore(z) }, ['parasite']);
	})();
	
}

function sendMessageToID(id, message){
	
	window.Store.WapQuery.queryExist(id).then((result) => {
	
		if (result.status == 200) {

			//var idUser = new window.Store.UserConstructor(id);
			var idUser = new window.Store.UserConstructor(id, { intentionallyUsePrivateConstructor: true });
			
			Store.Chat.find(idUser).then((chat) => {
				Store.SendTextMsgToChat(chat , message)
			});

		}

	})
	
}

function sendImageToId(id, imgBase64, legenda, fileName) {
	
	window.Store.WapQuery.queryExist(id).then((result) => {
	
		if (result.status == 200) {
			
			//var idUser = new window.Store.UserConstructor(id);
			var idUser = new window.Store.UserConstructor(id, { intentionallyUsePrivateConstructor: true });

			Store.Chat.find(idUser).then((chat) => {
				
				var mediaBlob = base64ImageToFile(imgBase64, fileName)
				var mc = new Store.MediaCollection();
				mc.processFiles([mediaBlob], chat, 1).then(() => {
					var media = mc.models[0];
					media.sendToChat(chat, {caption: legenda});
				})
				
			})
	
		}

	})
	
}

function base64ImageToFile(b64Data, fileName) {
	var arr   = b64Data.split(',');
	var mime  = arr[0].match(/:(.*?);/)[1];
	var bstr  = atob(arr[1]);
	var n     = bstr.length;
	var u8arr = new Uint8Array(n);

	while (n--) {
		u8arr[n] = bstr.charCodeAt(n);
	}
	return new File([u8arr], fileName, {type: mime});
}




