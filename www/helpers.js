var calendars = [
	'gregorian',
	'julian'
];

function makeList(appendTo,name,excludeItem) {
	var html = '';
	html += '<ul class="rounded">';
	html += '	<li><select name="'+ name +'" id="'+ name +'">';
	var len = calendars.length;
	for (var i=0; i<len; i++) {
		if (calendars[i] != excludeItem) {
			html += '		<option value="'+ calendars[i] +'">'+ calendars[i].substr(0,1).toUpperCase() + calendars[i].substr(1,calendars[i].length) +'</option>';
		}
	}
	html += '	</select></li>';
	html += '</ul>';
	$(appendTo).append($(html));
}

function setForm(appendTo,calendar) {
	$(appendTo).children().log("detaching from").remove();
	$(appendTo).append($('#'+ calendar +'form').clone(true));
	//$('#'+ calendar +'form').log("added this");
	// TODO setup the comboboxes appropriately
}

jQuery.fn.log = function (msg) {
	console.log("%s: %o", msg, this);
	return this;
};
