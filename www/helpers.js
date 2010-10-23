var calendars = [
	'gregorian',
	'julian',
	'modifiedjulian',
	'juliancalendar',
];
var calendarDescriptions = {
	gregorian: 'Gregorian',
	julian: 'Julian',
	modifiedjulian: 'Modified Julian',
	juliancalendar: 'Julian Calendar'
}

var thedate = getTodaysDate();

function makeList(appendTo,name,excludeItem) {
	var html = '';
	html += '<ul class="rounded">';
	html += '	<li><select name="'+ name +'" id="'+ name +'">';
	var len = calendars.length;
	for (var i=0; i<len; i++) {
		if (calendars[i] != excludeItem) {
			html += '		<option value="'+ calendars[i] +'">'+ calendarDescriptions[calendars[i]] +'</option>';
		}
	}
	html += '	</select></li>';
	html += '</ul>';
	$(appendTo).children().remove();
	$(appendTo).append($(html));
}

function setForm(appendTo,calendar) {
	$(appendTo).children().remove();
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

// modify these three sections to add a new date conversion type:
// to compute functions {{{
function togregorian(date) {
	var j = getJulianDay(date);
	var weekday = jwday(j);
	var description = Weekdays[weekday];
	var html = '   <li>'+ $('#gmonth option:selected').text() +' '+ $('#gday').val() +', '+ $('#gyear').val() +' - '+ description +'</li>';
	return html;
}
function tojulian(date) {
	var html = '   <li>'+ $('#jday').val() +'</li>';
	return html;
}
var JMJD  = 2400000.5;                // Epoch of Modified Julian Date system
function tomodifiedjulian(date) {
	var html = '   <li>'+ $('#mjday').val() +'</li>';
	return html;
}
function tojuliancalendar(date) {
	var html = '   <li>'+ $('#jcmonth option:selected').text() +' '+ $('#jcday').val() +', '+ $('#jcyear').val() +'</li>';
	return html;
}
//}}}
// the set functions {{{
// number of days +/- the weekday to display
var weekdaywiggle = 5;
function addWeekdayTags(appendTo,j,descfunc) {
	var currentjday = j;
	$(appendTo).children().remove();
	for (var i=j-weekdaywiggle; i<=j+weekdaywiggle; i++) {
		if (i == currentjday) {
			$(appendTo).append('<option selected value="'+ i +'">'+ descfunc(i) +'</option>');
		}
		else {
			$(appendTo).append('<option value="'+ i +'">'+ descfunc(i) +'</option>');
		}
	}
}
var gregDesc = function(i) {
	var weekday = jwday(i);
	var description = Weekdays[weekday];
	var gd = jd_to_gregorian(i);
	return gd[2] +' | '+ description;
}
var jDesc = function(i) {
	var weekday = jwday(i);
	var description = Weekdays[weekday];
	return i +' | '+ description;
}
var mjDesc = function(i) {
	var weekday = jwday(i);
	var description = Weekdays[weekday];
	var modifiedjulian = i - JMJD;
	return modifiedjulian +' | '+ description;
}
var jcDesc = function(i) {
	var weekday = jwday(i);
	var description = Weekdays[weekday];
	var julcal = jd_to_julian(i);
	return julcal[2] +' | '+ description;
}
function getJulianDay(gregorianDate) {
	return gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day) + (Math.floor(gregorianDate.sec + 60 * (gregorianDate.min + 60 * gregorianDate.hour) + 0.5) / 86400.0);
}
function setAllCalendars(gregorianDate) {
	var len = calendars.length;
	for (var i=0; i<len; i++) {
		window['set'+ calendars[i]](gregorianDate);
	}
	setResults($('#results'),gregorianDate,$('#toSelection').find(':selected').attr('value'));
	thedate = gregorianDate;
}
function setgregorian(gregorianDate) {
	var j = getJulianDay(gregorianDate);
	$('#gyear').val(gregorianDate.year);
	$('#gmonth').val(Number(gregorianDate.month));
	$('#gday').val(gregorianDate.day);
	addWeekdayTags($('#gweekday'),j,gregDesc);
}
function setjulian(gregorianDate) {
	var julian = getJulianDay(gregorianDate);
	$('#jday').val(julian);
	addWeekdayTags($('#jweekday'),julian,jDesc);
}
function setmodifiedjulian(gregorianDate) {
	var julian = getJulianDay(gregorianDate);
	var modifiedjulian = julian - JMJD;
	$('#mjday').val(modifiedjulian);
	addWeekdayTags($('#mjweekday'),julian,mjDesc);
}
function setjuliancalendar(gregorianDate) {
	var julian = getJulianDay(gregorianDate);
	var julcal = jd_to_julian(julian);
	$('#jcyear').val(julcal[0]);
	$('#jcmonth').val(Number(julcal[1]));
	$('#jcday').val(julcal[2]);
	addWeekdayTags($('#jcweekday'),julian,jcDesc);
}
//}}}
// handlers for various types {{{
function gregorianfunction() {
	var gd;
	var j = getJulianDay(thedate);
	if ($('#gyear').val() == thedate.year && $('#gmonth').val() == thedate.month && $('#gday').val() == thedate.day && $('#gweekday[value]').val() != j) {
		// the weekday changed, recompute from this julian day
		gd = jd_to_gregorian($('#gweekday').val());
	}
	else {
		gd = Array(Number($('#gyear').val()),Number($('#gmonth').val()),Number($('#gday').val()));
	}
	var gregorian = {
		year:gd[0],
		month:gd[1],
		day:gd[2],
		hour:0,
		min:0,
		sec:0
		};
	setAllCalendars(gregorian);
	return false;
}
function julianfunction() {
	var gd;
	var newgreg = jd_to_gregorian($('#jday').val());
	if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jweekday[value]').val() != $('#jday').val()) {
		gd = jd_to_gregorian($('#jweekday').val());
	}
	else {
		gd = newgreg;
	}
	var gregorian = {
		year:gd[0],
		month:gd[1],
		day:gd[2],
		hour:0,
		min:0,
		sec:0
		};
	setAllCalendars(gregorian);
	return false;
}
function modifiedjulianfunction() {
	var newgreg = jd_to_gregorian(Number($('#mjday').val())+JMJD);
	if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#mjweekday[value]').val() != $('#mjday').val()) {
		gd = jd_to_gregorian($('#mjweekday').val());
	}
	else {
		gd = newgreg;
	}
	var gregorian = {
		year:gd[0],
		month:gd[1],
		day:gd[2],
		hour:0,
		min:0,
		sec:0
		};
	setAllCalendars(gregorian);
	return false;
}
function juliancalendarfunction() {
	var julianday = julian_to_jd(Number($('#jcyear').val()),Number($('#jcmonth').val()),Number($('#jcday').val()));
	var newgreg = jd_to_gregorian(julianday);
	if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jcweekday[value]').val() != julianday) {
		gd = jd_to_gregorian($('#jcweekday').val());
	}
	else {
		gd = newgreg;
	}
	var gregorian = {
		year:gd[0],
		month:gd[1],
		day:gd[2],
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
