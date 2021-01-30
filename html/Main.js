var jsonTmp = {};
var ordTyps = [ 'stkMds', 'fries', 'combos', 'rpMds', 'frdSds', 'wraps','cold','des' ];

function reqDatChk(form) {
	var reqDat = [ 'Style', 'Size', 'Meat', 'Fries', 'Mods', 'Name', 'Phone','Time' ];
	for (i = 0; i < reqDat.length; i++) {
		var inpGrp = form.elements[reqDat[i]];
		if (inpGrp != undefined) {
			var c = 0;
			for (j = 0; j < inpGrp.length; j++) {
				if (inpGrp[j].checked == false) c++;
				if (j == inpGrp.length - 1 && c == inpGrp.length) {
					alert('Choose ' + inpGrp[0].name + ' to Complete Order');
					return false;
				}
			}
		}
	}
}


function addCrt(form) {
	if (reqDatChk(form)==false) return;
	tAr = serialize(form);
	data = tAr[0];
	id = tAr[1];
	if (jsonTmp.id !== undefined) {
		jsonTmp[id].push(data);
	} else {
		jsonTmp[id] = data;
	}
	appendToStorage(form.id, JSON.stringify(data));

	document.getElementById('loader').style.display = 'block';
	document.getElementById('ldBkg').style.display = 'block';
	setTimeout(function() {
		stpAnim(form);
	}, 500);
}

function getOrd(name) {
	if (localStorage.getItem(name) !== null) {
		//if exist
		var retDat = localStorage.getItem(name) + ']';
		return JSON.parse(retDat);
	} else return null;
}

function appendToStorage(name, data) {
	var old = localStorage.getItem(name);
	if (old === null) {
		old = '';
		localStorage.setItem(name, '[' + old + data);
	} else {
		localStorage.setItem(name, old + ',' + data);
	}
}

function emptCrt() {
	alert('This will clear your cart');
	localStorage.clear();
}

function submitOrd() {
	var form = document.getElementById('frmSub');
	if (reqDatChk(form)==false) return;
	var subDat = {};
	for (var i = 0, len = localStorage.length; i < len; ++i) {
		subDat[localStorage.key(i)] = localStorage.getItem(localStorage.key(i));
	}
	var subDatJson = JSON.stringify(subDat);
	// var subDat = {};
	// subDat['Data'] = document.getElementById("table").outerHTML;
	// subDat['Name'] = document.getElementById('cName').value;
	// subDat['Phone'] = document.getElementById('cPh').value;
	// subDat['Time'] = document.getElementById('cPick').value;
	// console.log(subDat);
	// var str = 'jsDat=' + JSON.stringify(subDat);
	// ajaxPost("../Mail.php", str);
	document.getElementById('frmsubDat').value = document.getElementById('table').outerHTML;
	form.submit();
	emptCrt();
	location.replace('../index.html');
	alert('Order Received Thanks!');
}

function serialize(form) {
	var field,
		l,
		s = [];
	var obj = new Object();

	if (typeof form == 'object' && form.nodeName == 'FORM') {
		var len = form.elements.length;
		for (var i = 0; i < len; i++) {
			field = form.elements[i];
			if (field.type == 'checkbox' && field.checked) {
				if (obj[field.name] == undefined) obj[field.name] = [];
				var ar = obj[field.name];
				var arr = field.value;
				obj[field.name] = ar.concat(arr);
			}
			if ((field.type == 'radio' && field.checked) || field.type == 'text') obj[field.name] = field.value;
		}
	}
	console.log(obj);
	return [ obj, form.id ];
}

function jsonTab() {
	var data = {};
	for (var i = 0; i < ordTyps.length; i++) {
		if (getOrd(ordTyps[i]) !== null) {
			data[ordTyps[i]] = getOrd(ordTyps[i]);
		} else ordTyps[i] = null;
	}
	for (var c = 0; c < ordTyps.length; c++) {
		if (ordTyps[c] !== null) {
			var col = [];
			var curDat = data[ordTyps[c]];
			for (var i = 0; i < curDat.length; i++) {
				for (var key in curDat[i]) {
					if (col.indexOf(key) === -1) {
						col.push(key);
					}
				}
			}
			var table = document.createElement('table');
			var tr = table.insertRow(-1);

			for (var i = 0; i < col.length; i++) {
				var th = document.createElement('th');
				th.innerHTML = col[i];
				tr.appendChild(th);
			}
			for (var i = 0; i < curDat.length; i++) {
				tr = table.insertRow(-1);
				for (var j = 0; j < col.length; j++) {
					var tabCell = tr.insertCell(-1);
					tabCell.innerHTML = curDat[i][col[j]];
				}
			}
			var divContainer = document.getElementById('table');
			divContainer.appendChild(table);
			var br = document.createElement('br');
			divContainer.appendChild(br);
		}
	}
	ordTyps = [ 'stkMds', 'fries', 'cutMds', 'rpMds', 'frdSds', 'wraps', 'cold','des'];
}

// function ajaxPost(url, data) {
// 	var xhr = new XMLHttpRequest();
// 	xhr.open('GET', url, true);
// 	xhr.setRequestHeader('Content-Type', 'application/json');
// 	xhr.onreadystatechange = function() {
// 		if (xhr.readyState === 4 && xhr.status === 200) {
// 			console.log(xhr.responseText);
// 		}
// 	};
// 	xhr.send(data);
// }

function stpAnim(form) {
	document.getElementById('loader').style.display = 'none';
	document.getElementById('ldBkg').style.display = 'none';
	form.reset();
}

function defSel(frm, ids) {
	var form = document.getElementById(frm).form;
	var namRes = [ 'Cheese', 'Toppings', 'Mods' ];
	for (i = 0; i < namRes.length; i++) {
		if (form.elements[namRes[i]] !== undefined) {
			var resVal = form.elements[namRes[i]];
			console.log(resVal);
			resVal.forEach((element) => {
				element.checked = false;
			});
		}
		console.log(resVal);
	}
	for (i = 0; i < ids.length; i++) {
		form.elements[ids[i]].checked = true;
	}
}

function sidMds(id, md) {
	if (document.getElementById(id).checked == false) {
		console.log('check');
		var win =
			'<input class="inp" type="radio" id="mwin" name="Mods" value="Mild"> <label for="mwin">Mild</label> <input class="inp" type="radio" id="hwin" name="Mods" value="Hot"> <label for="hwin">Hot</label>';
		var tots =
			'<input class="inp" type="radio" id="ptot" name="Mods" value="Plain"> <label for="ptot">Plain</label> <input class="inp" type="radio" id="ltot" name="Mods" value="Loaded"> <label for="ltot">Loaded (Bacon/Whiz)</label>';
		var bwin =
			'<input class="inp" type="radio" id="mmwin" name="Mods" value="Mango Habenero"> <label for="mmwin">Mango Habenero</label> <input class="inp" type="radio" id="gpwin" name="Mods" value="Garlic Parm"> <label for="gpwin">Garlic Parm</label> <input class="inp" type="radio" id="toss" name="Style" value="Tossed"> <label for="toss">Sauce Tossed</label> <input class="inp" type="radio" id="ntoss" name="Style" value="Sauce On Side"> <label for="ntoss">Sauce On Side</label>';
		var jpat =
			'<input class="inp" type="radio" id="bjpat" name="Mods" value="Beef"> <label for="bjpat">Beef</label> <input class="inp" type="radio" id="cjpat" name="Mods" value="Chicken"> <label for="cjpat">Chicken</label>';
		var mdAr = [win, tots, bwin, jpat, hd];

		document.getElementById('sidMds').innerHTML = mdAr[md];
		document.getElementById('sidMds').style.display = 'grid';
	} else {
		document.getElementById('sidMds').innerHTML = '';
		document.getElementById('sidMds').style.display = 'none';
	}
}

function unMd() {
	document.getElementById('sidMds').innerHTML = '';
	document.getElementById('sidMds').style.display = 'none';
}

function initMap() {
	const store = { lat: 40.236459062133825, lng: -75.5699065655097 };
	const map = new google.maps.Map(document.getElementById('map'), {
		zoom: 15,
		center: store,
		// restriction: {
		// 	latLngBounds: {
		// 		north: -75.56994,
		// 		south: -75.57107,
		// 		east: 40.23917,
		// 		west: 40.23797
		// 	}
		// }
	});
	// The marker, positioned at Uluru
	const marker = new google.maps.Marker({
		position: store,
		map: map
	});
	google.maps.event.trigger(map, 'resize');
}

// var field,
// 	l,
// 	s = [];
// var obj = new Object();

// if (typeof form == 'object' && form.nodeName == 'FORM') {
// 	var len = form.elements.length;

// 	var cBs = form.querySelectorAll('input[type="checkbox"]');
// 	var chkdBxs = [];
// 	var chkdBxsNms = [];
// 	for (var i = 0; i < len; i++) {
// 		field = form.elements[i];
// 		console.log(field);
// 		//if (document.getElementById('itemLab') !== null) obj['Name/Label'] = document.getElementById('itemLab').value;
// 		if (
// 			field.name &&
// 			!field.disabled &&
// 			field.type != 'button' &&
// 			field.type != 'file' &&
// 			field.type != 'hidden' &&
// 			field.type != 'reset' &&
// 			field.type != 'submit'
// 		) {
// 			if ((field.type != 'checkbox' && field.type != 'radio') || field.checked) {
// 				if (field.type == 'checkbox') {
// 					for (var c = 0; c < cBs.length; c++) {
// 						if (cBs[c].checked) {
// 							chkdBxs.push(cBs[c].value);
// 							chkdBxsNms.push(cBs[c].name);
// 						}
// 					}
// 					i = i + cBs.length;
// 				} else {
// 					obj[field.name] = field.value;
// 				}
// 			}
// 		}
// 	}
// }
// if (form.id == 'stkMds' || form.id == 'rpMds' || form.id == 'wraps') obj.Toppings = chkdBxs;
// else obj[field.name] = chkdBxs;
// return [ obj, form.id ];
