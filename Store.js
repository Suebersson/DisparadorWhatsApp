
//########################## Atualizado em 01/11/2021 ######################################################################
//Versão do WhatsApp 2.2142.12

//Referências
//https://gist.github.com/phpRajat/a6422922efae32914f4dbd1082f3f412
//https://raw.githubusercontent.com/smashah/sulla/master/src/lib/wapi.js

 
if (!window.Store) {
	(function () {
		function getStore(modules) {
			let foundCount = 0;
			let neededObjects = [
				{ id: "Store", conditions: (module) => (module.default && module.default.Chat && module.default.Msg) ? module.default : null},
				{ id: "MediaCollection", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.processAttachments !== undefined) ? module.default : null },
				{ id: "ChatClass", conditions: (module) => (module.default && module.default.prototype && module.default.prototype.Collection !== undefined && module.default.prototype.Collection === "Chat") ? module : null },
				{ id: "MediaProcess", conditions: (module) => (module.BLOB) ? module : null },
				{ id: "Archive", conditions: (module) => (module.setArchive) ? module : null },
                { id: "Block", conditions: (module) => (module.blockContact && module.unblockContact) ? module : null },
				{ id: "Wap", conditions: (module) => (module.createGroup) ? module : null },
				{ id: "ServiceWorker", conditions: (module) => (module.default && module.default.killServiceWorker) ? module : null },
				{ id: "State", conditions: (module) => (module.STATE && module.STREAM) ? module : null },
				{ id: "Presence", conditions: (module) => (module.setPresenceAvailable && module.setPresenceUnavailable) ? module : null },
				{ id: "WapDelete", conditions: (module) => (module.sendConversationDelete && module.sendConversationDelete.length == 2) ? module : null },
				{ id: "Conn", conditions: (module) => (module.default && module.default.ref && module.default.refTTL) ? module.default : null },
				//{ id: "WapQuery", conditions: (module) => (module.queryExist) ? module : ((module.default && module.default.queryExist) ? module.default : null) },
				{ id: "WapQuery", conditions: (module) => (module.default && module.default.queryExist) ? module.default : null},
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
				{ id: "BinaryProtocol", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('bp_unknown_version')) ? module.default : null },
				{ id: "MsgKey", conditions: (module) => (module.default && module.default.toString && module.default.toString().includes('MsgKey error: obj is null/undefined')) ? module.default : null },
				{ id: "Parser", conditions: (module) => (module.convertToTextWithoutSpecialEmojis) ? module.default : null },
                { id: "Builders", conditions: (module) => (module.TemplateMessage && module.HydratedFourRowTemplate) ? module : null },
				{ id: "Me", conditions: (module) => (module.PLATFORMS && module.Conn) ? module.default : null },
                { id: "Identity", conditions: (module) => (module.queryIdentity && module.updateIdentity) ? module : null },
                { id: "MyStatus", conditions: (module) => (module.getStatus && module.setMyStatus) ? module : null },
				{ id: "ChatStates", conditions: (module) => (module.sendChatStatePaused && module.sendChatStateRecording && module.sendChatStateComposing) ? module : null },
				{ id: "Features", conditions: (module) => (module.FEATURE_CHANGE_EVENT && module.features) ? module : null },
                { id: "MessageUtils", conditions: (module) => (module.storeMessages && module.appendMessage) ? module : null },
                { id: "WebMessageInfo", conditions: (module) => (module.WebMessageInfo && module.WebFeatures) ? module.WebMessageInfo : null },
                { id: "createMessageKey", conditions: (module) => (module.createMessageKey && module.createDeviceSentMessage) ? module.createMessageKey : null },
                { id: "Participants", conditions: (module) => (module.addParticipants && module.removeParticipants && module.promoteParticipants && module.demoteParticipants) ? module : null },
                { id: "WidFactory", conditions: (module) => (module.numberToWid && module.createWid && module.createWidFromWidLike) ? module : null },
                { id: "Base", conditions: (module) => (module.setSubProtocol && module.binSend && module.actionNode) ? module : null },
                { id: "Base2", conditions: (module) => (module.supportsFeatureFlags && module.parseMsgStubProto && module.binSend && module.subscribeLiveLocation) ? module : null },
                //{ id: "Versions", conditions: (module) => (module.loadProtoVersions && module.default["15"] && module.default["16"] && module.default["17"]) ? module : null },
				{ id: "OpenChatFromUnread", conditions: (module) => (module.default && module.default.openChatFromUnread) ? module : null}
			];
			
			for (let idx in modules) {
            	if ((typeof modules[idx] === "object") && (modules[idx] !== null)) {
                    neededObjects.forEach((needObj) => {
                    	if (!needObj.conditions || needObj.foundedModule)
                            return;
                    	let neededModule = needObj.conditions(modules[idx]);
                    	if (neededModule !== null) {
                            foundCount++;
                            needObj.foundedModule = neededModule;
                    	}
					});

                    if (foundCount == neededObjects.length) {
                    	break;
                    }
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
			
			console.log("Versão do WhatsApp: " + Store.AboutWhatsApp.default.VERSION_STR);

			return window.Store;
	
		}

		const parasite = `parasite${Date.now()}`
        if (typeof webpackJsonp === 'function'){
			webpackJsonp([], {[parasite]: (x, y, z) => getStore(z)}, [parasite])
		}else{
			//webpackChunkbuild.push([[parasite], {}, function (o, e, t) {let modules = []; for (let idx in o.m) {modules.push(o(idx));}	getStore(modules);}]); 
			webpackChunkwhatsapp_web_client.push([[parasite], {}, function (o, e, t) {let modules = []; for (let idx in o.m) {modules.push(o(idx));} getStore(modules);}]); 
		}

	})();
}

//############################# Envios diretos #########################################
function sendMessageToID(id, message){

	openChatIfThereIs(id).then((c) => {
		if(c.isChat) Store.SendTextMsgToChat(c.obj , message);
	});
	
}

function sendImageToId(id, imgBase64, legenda, fileName) {
	
	openChatIfThereIs(id).then((c) => {
		if(c.isChat) {
			process_Files(c.obj, base64ImageToFile(imgBase64, fileName)).then(mc => {
				mc.models[0].sendToChat(c.obj, { caption: legenda })
			});
		}
	});
	
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

	Store.Chat.find(id).then((chat) => {
		Store.SendTextMsgToChat(chat , message)
	});
	
}

function SelfAnswer_sendImageToId(id, imgBase64, legenda, fileName) {

	Store.Chat.find(id).then((chat) => {
		
		process_Files(chat, base64ImageToFile(imgBase64, fileName)).then(mc => {
			mc.models[0].sendToChat(chat, { caption: legenda })
		});
		
	});
	
}

//############################### Abrir uma conversa ######################################
function abrir_chat(id) {

	openChatIfThereIs(id).then((c) => {
		if(!c.isChat){
			swal("O número de telefone não possuí uma conta de WhatsApp", {
				buttons: false,
				timer: 7000,
				icon: "info",
			});
		}
	});
	
}


//abrir conversa/chat se ele existir
async function openChatIfThereIs(id) {

	return Store.Chat.find(id).then((chat) => {

		//abrir chat
		//Store.OpenChat.prototype.openChat(id)//gerando erro
		Store.OpenChatFromUnread.default._openChat(chat)
		
		return {
			isChat: true,
			obj: chat
		};

	}).catch(error => {
		console.log('Chat não localizado no histórico de conversas')
		
		 return Store.WapQuery.queryExist(id).then((result) => {//verificar se destinatario existe

			if (result.status == 200){

				var newChat = result.jid._serialized;
				
				//Adicionar o chat no registro de chats
				Store.Chat.add(
					{id: new Store.UserConstructor(
						newChat, 
						{intentionallyUsePrivateConstructor: true}
					)}, 
					{merge: true, add: true}
				);
				
				var chat = Store.Chat.get(newChat);
				//abrir chat
				//Store.OpenChat.prototype.openChat(newChat)//gerando erro
				Store.OpenChatFromUnread.default._openChat(chat)
				
				return {
					isChat: true,
					obj: chat
				};
			
			}else{
				console.log('O endereço informado não possuí uma conta de WhatsApp')
				return {
					isChat: false,
					obj: null
				};
			}

		})
	});
}

