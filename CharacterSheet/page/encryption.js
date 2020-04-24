var encryptionMenu = document.getElementById("encryptionMenu");
var encryptionTypeSelector = document.getElementById("encryptionType");
if(Math.random()*12<1)
	encryptionMenu.children[0].style.display = "";
makeFloaterDraggable(encryptionMenu, "Encryption");

var saveFileVersionNumber = 1;

var passwordField = document.getElementById("password");
var usernameField = document.getElementById("encryptionUsername");
var keyField = document.getElementById("encryptionKey");
var encryptionDetails = {version:-1};

function encrypt(data, gmSalt){
	var encryptionType = 1*(encryptionTypeSelector.value);
	var encDetailsValid = encryptionDetails.version == encryptionType;
	var result = {version:saveFileVersionNumber, encryptionType:encryptionType};
	if(gmSalt)
		result.gmSalt = CryptoJS.enc.Base64.stringify(gmSalt);
	setContent(keyField, "");
	if(encryptionType==0)
		result.data = data;
	else if(encryptionType==1){
		var password = getContent(passwordField);
		var salt = encDetailsValid? encryptionDetails.salt : CryptoJS.lib.WordArray.random(16);
		var key = CryptoJS.PBKDF2(password, salt, {keySize:16});
		var iv = CryptoJS.lib.WordArray.random(8);
		var plaintext = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
		var ciphertext = CryptoJS.Rabbit.encrypt(plaintext, key, {iv:iv.clone()});
		result.encryption = {iv:CryptoJS.enc.Base64.stringify(iv),salt:CryptoJS.enc.Base64.stringify(salt)};
		result.data = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext);
	}else if(encryptionType==2){
		if(!encDetailsValid){
			key = CryptoJS.lib.WordArray.random(16);
			encryptionDetails = {version:2, key:key, personal:{}};
		}
		var name = getContent(usernameField);
		key = encryptionDetails.key;
		if(!(name in encryptionDetails.personal)){
			addPasswordToEncDetails(key, encryptionDetails);
		}
		var personal = encryptionDetails.personal[name];
		salt = personal.salt;
		iv = CryptoJS.lib.WordArray.random(8);
		plaintext = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
		ciphertext = CryptoJS.Rabbit.encrypt(plaintext, key.clone(), {iv:iv.clone()});
		result.encryption = {iv:CryptoJS.enc.Base64.stringify(iv),personal:{}};
		result.data = CryptoJS.enc.Base64.stringify(ciphertext.ciphertext);
		var names = Object.keys(encryptionDetails.personal);
		for(var i=0; i<names.length; i++){
			personal = encryptionDetails.personal[names[i]];
			result.encryption.personal[names[i]] = {
				salt:CryptoJS.enc.Base64.stringify(personal.salt),
				key :CryptoJS.enc.Base64.stringify(personal.key )
			};
		}
		setContent(keyField, CryptoJS.enc.Base64.stringify(key));
	}
	return result;
}

function decrypt(data){
	if(data.encryptionType >= decryptionAlgorithms.length){
		alert("Unsupported encryption type: "+fullData.encryptionType);
		return;
	}
	var newEncryptionDetails = {version:data.encryptionType};
	if("gmSalt" in data)
		newEncryptionDetails.gmSalt = CryptoJS.enc.Base64.parse(data.gmSalt);
	var result = decryptionAlgorithms[data.encryptionType](data.data, data.encryption, newEncryptionDetails);
	if(result){
		encryptionDetails = newEncryptionDetails;
		encryptionTypeSelector.value = data.encryptionType;
	}
	return result;
}

var decryptionAlgorithms = [
	identity,//data.encryption is undefined for unencrypted files.
	function(data, encryption, encryptionDetails){
		var password = getContent(passwordField);
		var salt = CryptoJS.enc.Base64.parse(encryption.salt);
		encryptionDetails.salt = salt;
		var key = CryptoJS.PBKDF2(password, salt, {keySize:16});
		var iv = CryptoJS.enc.Base64.parse(encryption.iv);
		var ciphertext = CryptoJS.enc.Base64.parse(data);
		var plaintext = CryptoJS.Rabbit.decrypt({ciphertext:ciphertext}, key, {iv:iv});
		try{
			return JSON.parse(CryptoJS.enc.Utf8.stringify(plaintext));
		}catch(e){
			if(password)
				alert("Incorrect passsword or corrupted file");
			else
				alert("The passsword must be entered in the encryption menu.");
			return false;
		}
	},
	function(data, encryption, encryptionDetails){
		encryptionDetails.personal = {};
		var names = Object.keys(encryption.personal);
		for(var i=0; i<names.length; i++){
			var name = names[i];
			encryptionDetails.personal[name] = {};
			encryptionDetails.personal[name].salt = CryptoJS.enc.Base64.parse(encryption.personal[name].salt);
			encryptionDetails.personal[name].key = CryptoJS.enc.Base64.parse(encryption.personal[name].key);
		}
		var username = getContent(usernameField);
		var password = getContent(passwordField);
		var personalEncryption = encryptionDetails.personal[username];
		if(personalEncryption){
			var personalKey = CryptoJS.PBKDF2(password, personalEncryption.salt, {keySize:4});
			var key = wordArrayXor(personalKey, personalEncryption.key);
		}else{
			key = requestManualKeyEntry();
			if(key)
				addPasswordToEncDetails(key, encryptionDetails);
		}
		if(!key)
			return false;
		encryptionDetails.key = key;
		var iv = CryptoJS.enc.Base64.parse(encryption.iv);
		var ciphertext = CryptoJS.enc.Base64.parse(data);
		var plaintext = CryptoJS.Rabbit.decrypt({ciphertext:ciphertext}, key.clone(), {iv:iv});
		try{
			return JSON.parse(CryptoJS.enc.Utf8.stringify(plaintext));
		}catch(e){
			if(password)
				alert("Incorrect passsword or corrupted file");
			else
				alert("The passsword must be entered in the encryption menu.");
			return false;
		}
	}
];

function wordArrayXor(a, b){
	if(a.sigBytes != b.sigBytes)
		throw "Word arrays must have equal length for the bitwise xor operation: "+a.sigBytes+" != "+b.sigBytes;
	var words = [];
	for(var i=0; i<a.words.length; i++)
		words[i] = a.words[i] ^ b.words[i];
	return new CryptoJS.lib.WordArray.init(words, a.sigBytes);
}

function requestManualKeyEntry(){
	if(!confirm("The username you entered is not registered with this file. Do you want to add it?"))
		return false;
	return CryptoJS.enc.Base64.parse(prompt("Please enter this character-sheet's key."));
}

function addPasswordToEncDetails(key, encryptionDetails){
	var name = getContent(usernameField);
	var password = getContent(passwordField);
	if(!name || !password){
		alert("The name and password fields in the encryption menu must be filled in for this encryption type.<br>Your password will not be added to the file.");
	}else if(name in encryptionDetails.personal){
		alert("That username is already in use for this file.");
	}else{
		var salt = CryptoJS.lib.WordArray.random(16);
		var personalKey = CryptoJS.PBKDF2(getContent(passwordField), salt, {keySize:4});
		encryptionDetails.personal[name] = {salt:salt, key:wordArrayXor(key, personalKey)};
	}
}
