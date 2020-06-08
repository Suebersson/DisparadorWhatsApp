
//########################## Atualizado em 30/03/2020 ######################################################################
//Versão do WhatsApp 0.4.2180

//https://gist.github.com/phpRajat/a6422922efae32914f4dbd1082f3f412
//https://raw.githubusercontent.com/smashah/sulla/master/src/lib/wapi.js

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
				{ id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null},
				{ id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments !== undefined) ? module.default : null },
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
				{ id: "SendMsgToChat", conditions: (module) => (module.sendMsgToChat) ? module.sendMsgToChat : null },
				{ id: "SendSeen", conditions: (module) => (module.sendSeen) ? module : null },
				{ id: "SendDelete", conditions: (module) => (module.sendDelete) ? module.sendDelete : null },
				{ id: "AboutWhatsApp", conditions: (module) => (module.default && module.default.VERSION_STR) ? module : null },
				{ id: "AddAndSendMsgToChat", conditions: (module) => (module.addAndSendMsgToChat) ? module.addAndSendMsgToChat : null },
                { id: "Catalog", conditions: (module) => (module.Catalog) ? module.Catalog : null },
                { id: "BinaryProtocol", conditions: (module) => (module.default && module.default.toString().includes('binaryProtocol deprecated version')) ? module.default : null },
                { id: "MsgKey", conditions: (module) => (module.default&&module.default.toString().includes('MsgKey error: id is already a MsgKey')) ? module.default : null },
                { id: "Parser", conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
                { id: "Builders", conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
                { id: "Identity", conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
                { id: "MyStatus", conditions: (module) => (module.getStatus && module.setMyStatus) ? module : null },
                { id: "Features", conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
                { id: "MessageUtils", conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
                { id: "WebMessageInfo", conditions: (module) => (module.WebMessageInfo && module.WebFeatures) ? module.WebMessageInfo : null },
                { id: "createMessageKey", conditions: (module) => (module.createMessageKey && module.createDeviceSentMessage) ? module.createMessageKey : null },
                { id: "Participants", conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null },
                { id: "WidFactory", conditions: (module) => (module.numberToWid && module.createWid && module.createWidFromWidLike) ? module : null },
                { id: "Base", conditions: (module) => (module.setSubProtocol && module.binSend && module.actionNode) ? module : null },
                { id: "Base2", conditions: (module) => (module.supportsFeatureFlags && module.parseMsgStubProto && module.binSend && module.subscribeLiveLocation) ? module : null },
                { id: "Versions", conditions: (module) => (module.loadProtoVersions && module.default["15"] && module.default["16"] && module.default["17"]) ? module : null }	
			];
			
			for (let idx in modules) {
				if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
					let first = Object.values(modules[idx])[0];
					if ((typeof first === "object") && (first.exports)) {
						for (let idx2 in modules[idx]) {
							
							let module = modules(idx2);
							if (!module) continue;
							
							neededObjects.forEach((needObj) => {
								
								if (!needObj.conditions || needObj.foundedModule) return;
								
								let neededModule = needObj.conditions(module);
								if (neededModule !== null) {
									foundCount++;
									needObj.foundedModule = neededModule;
								}
								
							});
							
							if (foundCount == neededObjects.length) break
							
						}

						let neededStore = neededObjects.find((needObj) => needObj.id === "Store");
						window.Store = neededStore.foundedModule ? neededStore.foundedModule : {};
						neededObjects.splice(neededObjects.indexOf(neededStore), 1);
						neededObjects.forEach((needObj) => {
							if (needObj.foundedModule) {
								window.Store[needObj.id] = needObj.foundedModule;
							}
						});
						
						//console.log("Versão do WhatsApp: " + Store.AboutWhatsApp.VERSION_STR);
						
						//Versão do WhatsApp
						var Primary = Store.ServiceWorker.default.activeVersion.primary;
						var Secondary = Store.ServiceWorker.default.activeVersion.secondary;
						var Tertiary = Store.ServiceWorker.default.activeVersion.tertiary;

						console.log('Versão do WhatsApp: ' + Primary + '.' + Secondary + '.' + Tertiary);
						
						return window.Store;
					}
				}
			}
		}

		//webpackJsonp([], {'parasite': (x, y, z) => getStore(z)}, ['parasite'])
		
		const parasite = `parasite${Date.now()}`
        if (typeof webpackJsonp === 'function'){
			webpackJsonp([], {[parasite]: (x, y, z) => getStore(z)}, [parasite])
		}else{
			webpackJsonp.push([[parasite],{[parasite]: (x, y, z) => getStore(z)},[[parasite]]])
		}
		
	})();
}

//############################# Envios diretos #########################################
function sendMessageToID(id, message){
	
	window.Store.WapQuery.queryExist(id).then((result) => {
	
		if (result.status == 200) {
			
			var _id = result.jid._serialized
			
			//var idUser = new window.Store.UserConstructor(_id);
			//var idUser = new Store.WidFactory.createWid(_id);
			var idUser = new window.Store.UserConstructor(_id, {intentionallyUsePrivateConstructor: true});
			
			Store.OpenChat.prototype.openChat(_id)//abrir chart
			
			Store.Chat.find(idUser).then((chat) => {
				Store.SendTextMsgToChat(chat , message)
			});

		}

	})
	
}

function sendImageToId(id, imgBase64, legenda, fileName) {
	
	window.Store.WapQuery.queryExist(id).then((result) => {
	
		if (result.status == 200) {
			
			var _id = result.jid._serialized
			
			//var idUser = new window.Store.UserConstructor(_id);
			//var idUser = new Store.WidFactory.createWid(_id);
			var idUser = new window.Store.UserConstructor(_id, {intentionallyUsePrivateConstructor: true});
			
			Store.OpenChat.prototype.openChat(_id)//abrir chart
			
			Store.Chat.find(idUser).then((chat) => {

				process_Files(chat, base64ImageToFile(imgBase64, fileName)).then(mc => {
					mc.models[0].sendToChat(chat, { caption: legenda })
				});
		
			});
	
		}

	})
	
}

var process_Files = async function(chat, blobs) {
	if (!Array.isArray(blobs)) {
		blobs = [blobs];
	}
	mc = new Store.MediaCollection(chat);
	await mc.processAttachments((Debug.VERSION === '0.4.613')?blobs:blobs.map(blob=>{return{file:blob}}) , chat, 1);
	return mc
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

//########################## Auto responder ####################################
function SelfAnswer_sendMessageToID(id, message){
	
	//var idUser = new window.Store.UserConstructor(id);
	//var idUser = new Store.WidFactory.createWid(id);
	var idUser = new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
	
	Store.Chat.find(idUser).then((chat) => {
		Store.SendTextMsgToChat(chat , message)
	});
	
}

function SelfAnswer_sendImageToId(id, imgBase64, legenda, fileName) {

	//var idUser = new window.Store.UserConstructor(id);
	//var idUser = new Store.WidFactory.createWid(id);
	var idUser = new window.Store.UserConstructor(id, {intentionallyUsePrivateConstructor: true});
	
	Store.Chat.find(idUser).then((chat) => {
		
		process_Files(chat, base64ImageToFile(imgBase64, fileName)).then(mc => {
			mc.models[0].sendToChat(chat, { caption: legenda })
		});
		
	});
	
}

//############################### Abrir uma conversa ######################################
function abrir_chat(id){
	
	window.Store.WapQuery.queryExist(id).then((result) => {
	
		if (result.status == 200) {
			
			Store.OpenChat.prototype.openChat(result.jid._serialized)
			
		}else{
		
			swal("O número de telefone compartilhado através da url é inválido.", {
				buttons: false,
				timer: 7000,
				icon: "info",
			});
		
		}		

	})
	
}
