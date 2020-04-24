var gmNotesStyles = document.getElementById("gmNodeHiding");
for(var i=0; i<document.styleSheets.length; i++){
	if(document.styleSheets[i].ownerNode==gmNotesStyles){
		gmNotesStyles = document.styleSheets[i].cssRules[0].style;
		break;
	}
}
var gmPassword = "";
var gmKey;

document.getElementById("gmPassword").addEventListener("input", updateGmPassword);
function updateGmPassword(ev){
	gmPassword = this.textContent;
	if(gmPassword)
		gmNotesStyles.display = "";
	else
		gmNotesStyles.display = "none";
}

function prepareGmKey(data){
	var salt;
	if(gmPassword){
		salt = CryptoJS.lib.WordArray.random(16);
		gmKey = CryptoJS.PBKDF2(gmPassword, salt, {keySize:4});
		return salt;
	}else if(encryptionDetails && encryptionDetails.gmSalt)
		return encryptionDetails.gmSalt;
}

function getContentForSave(el){
	var result = getContent(el);
	if(el.gmHidden)
		result = gmEncrypt(result, el);
	return result;
}

function gmEncrypt(data, fallback){
	if(gmPassword)
		return CryptoJS.enc.Base64.stringify(CryptoJS.Rabbit.encrypt(CryptoJS.enc.Utf8.parse(JSON.stringify(data)), gmKey).ciphertext);
	else if("hiddenGmData" in fallback)
		return fallback.hiddenGmData;
	else
		return "";
}

function setContentForLoad(el, value){
	if(el.gmHidden)
		value = gmDecrypt(value, el);
	setContent(el, value);
}

function gmDecrypt(data, fallback){
	fallback.hiddenGmData = data;
	if(gmKey){
		try{
			return JSON.parse(CryptoJS.Rabbit.decrypt({ciphertext:CryptoJS.enc.Base64.parse(data)}, gmKey).toString(CryptoJS.enc.Utf8));
		}catch(e){
			if(e instanceof SyntaxError || e.message=="Malformed UTF-8 data")
				return "";
			else
				throw e;//I don't know if there even are any more exceptions that could happen, but I don't want to catch them.
		}
	}else
		return "";
}
