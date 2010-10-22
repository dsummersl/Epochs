var calendars = [
	'gregorian',
	'julian'
];

var thedate = getTodaysDate();

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
	$(appendTo).children().remove();
	$(appendTo).append($(html));
}

function setForm(appendTo,calendar) {
	$(appendTo).children().log("detaching from").remove();
	$(appendTo).append($('#'+ calendar +'form').clone(true));
	makeList($('#convertTo'),'toSelection',calendar);
}

function setResults(appendTo,gregorianDate,calendarType) {
	var html = '';
	html += '<ul class="rounded">';
	html += window['to'+ calendarType](gregorianDate);
	html += '</ul>';
	var insert = $(html);
	$(appendTo).children().remove();
	$(appendTo).append(insert);
}

// to compute functions {{{
function tojulian(date) {
	var julian = gregorian_to_jd(date.year, date.month, date.day) + (Math.floor(date.sec + 60 * (date.min + 60 * date.hour) + 0.5) / 86400.0);
	return '   <li>'+ julian +'</li>';
}
function togregorian(date) {
	return '   <li>'+ $('#gmonth option:selected').text() +' '+ $('#gday').val() +', '+ $('#gyear').val() +'</li>';
}
//}}}
// the set functions {{{
function setAllCalendars(gregorianDate) {
	var len = calendars.length;
	for (var i=0; i<len; i++) {
		window['set'+ calendars[i]](gregorianDate);
	}
	setResults($('#results'),gregorianDate,$('#toSelection').find(':selected').attr('value'));
	thedate = gregorianDate;
}
function setgregorian(gregorianDate) {
	$('#gyear').val(gregorianDate.year);
	$('#gmonth').val(Number(gregorianDate.month));
	$('#gday').val(gregorianDate.day);
}
function setjulian(gregorianDate) {
	var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day) + (Math.floor(gregorianDate.sec + 60 * (gregorianDate.min + 60 * gregorianDate.hour) + 0.5) / 86400.0);
	$('#jday').val(julian);
}
//}}}
// handlers for various types {{{
function gregorianfunction() {
	var gregorian = {
		year:Number($('#gyear').val()),
		month:Number($('#gmonth').val()),
		day:Number($('#gday').val()),
		hour:0,
		min:0,
		sec:0
		};
	setAllCalendars(gregorian);
	return false;
}
function julianfunction() {
	var newgreg = jd_to_gregorian($('#jday').val());
	var gregorian = {
		year:Number(newgreg[0]),
		month:Number(newgreg[1]),
		day:Number(newgreg[2]),
		hour:0,
		min:0,
		sec:0
		};
	setAllCalendars(gregorian);
	return false;
}
//}}}
// Date related functions {{{
// Get today's date in gregorian
function getTodaysDate() {
    var today = new Date();

    /*  The following idiocy is due to bizarre incompatibilities
        in the behaviour of getYear() between Netscrape and
        Exploder.  The ideal solution is to use getFullYear(),
        which returns the actual year number, but that would
        break this code on versions of JavaScript prior to
        1.2.  So, for the moment we use the following code
        which works for all versions of JavaScript and browsers
        for all year numbers greater than 1000.  When we're willing
        to require JavaScript 1.2, this may be replaced by
        the single line:

            document.gregorian.year.value = today.getFullYear();

        Thanks to Larry Gilbert for pointing out this problem.
    */

    var y = today.getYear();
    if (y < 1000) {
        y += 1900;
    }

		return {
			year: y,
			month: today.getMonth()+1,
			day: today.getDate(),
			hour: 0,
			min: 0,
			sec: 0
		};
}
//}}}


jQuery.fn.log = function (msg) {
	console.log("%s: %o", msg, this);
	return this;
};

// vim: set fdm=marker ai:
