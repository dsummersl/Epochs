var thedate = getTodaysDate();

function makeList(appendTo,name,excludeItem) {
	var html = '';
	html += '<ul class="rounded">';
	html += '	<li><select name="'+ name +'" id="'+ name +'">';
	$.each(implementations,function(key,value) {
		if (key != excludeItem) {
			html += '		<option value="'+ key +'">'+ value.name +'</option>';
		}
	});
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
	html += implementations[calendarType].toHTML(gregorianDate);
	html += '</ul>';
	var insert = $(html);
	$(appendTo).children().remove();
	$(appendTo).append(insert);
}

// modify these three sections to add a new date conversion type:
var implementations = {
	gregorian: new function() {//{{{
		this.name = 'Gregorian';
		this.toHTML = function (date) {
			var j = gregorian_to_jd(date.year, date.month, date.day);
			var weekday = jwday(j);
			var description = Weekdays[weekday];
			var html = '<li>'+ $('#gmonth option:selected').text() +' '+ $('#gday').val() +', '+ $('#gyear').val() +' - '+ description +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var j = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			$('#gyear').val(gregorianDate.year);
			$('#gmonth').val(Number(gregorianDate.month));
			$('#gday').val(gregorianDate.day);
			addWeekdayTags($('#gweekday'),j,function(i) {
				var weekday = jwday(i);
				var description = Weekdays[weekday];
				var gd = jd_to_gregorian(i);
				return gd[2] +' | '+ description;
			});
		};
		this.updateFromHTML = function() {
			var gd;
			var j = gregorian_to_jd(thedate.year, thedate.month, thedate.day);
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
		};
	},//}}}
	julian: new function() {//{{{
		this.name = 'Julian';
		this.toHTML = function (date) {
			var html = '<li>'+ $('#jday').val() +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			$('#jday').val(julian);
			addWeekdayTags($('#jweekday'),julian,jDesc);
		};
		this.updateFromHTML = function () {
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
		};
	},//}}}
	modifiedjulian: new function() {//{{{
		this.name = 'Modified Julian';
		this.toHTML = function (date) {
			var html = '<li>'+ $('#mjday').val() +'</li>';
			return html;
		};
		this.updateForm = function(gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var modifiedjulian = julian - JMJD;
			$('#mjday').val(modifiedjulian);
			addWeekdayTags($('#mjweekday'),julian,mjDesc);
		};
		this.updateFromHTML = function() {
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
		};
	},//}}}
	juliancalendar: new function() {//{{{
		this.name = 'Julian Calendar';
		this.toHTML = function (date) {
			var j = gregorian_to_jd(date.year, date.month, date.day);
			var weekday = jwday(j);
			var description = Weekdays[weekday];
			var html = '<li>'+ $('#jcmonth option:selected').text() +' '+ $('#jcday').val() +', '+ $('#jcyear').val() +' - '+ description +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var julcal = jd_to_julian(julian);
			$('#jcyear').val(julcal[0]);
			$('#jcmonth').val(Number(julcal[1]));
			$('#jcday').val(julcal[2]);
			addWeekdayTags($('#jcweekday'),julian,jcDesc);
		};
		this.updateFromHTML = function() {
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
		};
	},//}}}
	hebrew: new function() {//{{{
		this.name = 'Hebrew';
		this.toHTML = function (date) {
			var julian = gregorian_to_jd(date.year, date.month, date.day);
			var hebcal = jd_to_hebrew(julian);
			var monthnumber = hebcal[1];
			var month = $('#hmonth option[value="'+ monthnumber +'"]').log("monthnum = "+ monthnumber +" and year is "+ date.year +" which is leap?" + hebrew_leap(hebcal[0])).text();
			if (hebrew_leap(hebcal[0])) {
				if (monthnumber == 12) {
					month = "Adar I";
				}
				if (monthnumber == 13) {
					month == "Veadar";
				}
			}
			var html = '<li>'+ hebcal[0] +', '+ month +' '+ hebcal[2] +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var hcal = jd_to_hebrew(julian);
			$('#hyear').val(hcal[0]);
			$('#hmonth').val(Number(hcal[1]));
			$('#hday').val(hcal[2]);
			// TODO update the days in the month correctly.
			//addWeekdayTags($('#jcweekday'),julian,frDesc);
		};
		this.updateFromHTML = function() {
			var julianday = hebrew_to_jd(Number($('#hyear').val()),Number($('#hmonth').val()),Number($('#hday').val()));
			var newgreg = jd_to_gregorian(julianday);
			//if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jcweekday[value]').val() != julianday) {
				//gd = jd_to_gregorian($('#jcweekday').val());
			//}
			//else {
				gd = newgreg;
			//}
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
		};
	},//}}}
	islamic: new function() {//{{{
		this.name = 'Islamic';
		this.toHTML = function (date) {
			var julian = gregorian_to_jd(date.year, date.month, date.day);
			var ical = jd_to_islamic(julian);
			var monthnumber = ical[1];
			var month = $('#imonth option[value="'+ monthnumber +'"]').log("monthnum = "+ monthnumber +" and year is "+ date.year +" which is leap?" + hebrew_leap(ical[0])).text();
			var html = '<li>'+ ical[2] +', '+ month +' '+ ical[0] +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var hcal = jd_to_islamic(julian);
			$('#iyear').val(hcal[0]);
			$('#imonth').val(Number(hcal[1]));
			$('#iday').val(hcal[2]);
			// TODO update the days in the month correctly.
			//addWeekdayTags($('#jcweekday'),julian,frDesc);
		};
		this.updateFromHTML = function() {
			var julianday = islamic_to_jd(Number($('#iyear').val()),Number($('#imonth').val()),Number($('#iday').val()));
			var newgreg = jd_to_gregorian(julianday);
			//if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jcweekday[value]').val() != julianday) {
				//gd = jd_to_gregorian($('#jcweekday').val());
			//}
			//else {
				gd = newgreg;
			//}
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
		};
	},//}}}
	persian: new function() {//{{{
		this.name = 'Persian';
		this.toHTML = function (date) {
			var julian = gregorian_to_jd(date.year, date.month, date.day);
			var ical = jd_to_persiana(julian);
			var monthnumber = ical[1];
			var month = $('#pmonth option[value="'+ monthnumber +'"]').log("monthnum = "+ monthnumber +" and year is "+ date.year +" which is leap?" + hebrew_leap(ical[0])).text();
			var html = '<li>'+ ical[2] +', '+ month +' '+ ical[0] +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var hcal = jd_to_persiana(julian);
			$('#pyear').val(hcal[0]);
			$('#pmonth').val(Number(hcal[1]));
			$('#pday').val(hcal[2]);
			// TODO update the days in the month correctly.
			//addWeekdayTags($('#jcweekday'),julian,frDesc);
		};
		this.updateFromHTML = function() {
			var julianday = persiana_to_jd(Number($('#pyear').val()),Number($('#pmonth').val()),Number($('#pday').val()));
			var newgreg = jd_to_gregorian(julianday);
			//if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jcweekday[value]').val() != julianday) {
				//gd = jd_to_gregorian($('#jcweekday').val());
			//}
			//else {
				gd = newgreg;
			//}
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
		};
	},//}}}
	indian: new function() {//{{{
		this.name = 'Indian Civil';
		this.toHTML = function (date) {
			var julian = gregorian_to_jd(date.year, date.month, date.day);
			var ical = jd_to_indian_civil(julian);
			var monthnumber = ical[1];
			var month = $('#icmonth option[value="'+ monthnumber +'"]').log("monthnum = "+ monthnumber +" and year is "+ date.year +" which is leap?" + hebrew_leap(ical[0])).text();
			var html = '<li>'+ ical[2] +', '+ month +' '+ ical[0] +'</li>';
			return html;
		};
		this.updateForm = function (gregorianDate) {
			var julian = gregorian_to_jd(gregorianDate.year, gregorianDate.month, gregorianDate.day);
			var hcal = jd_to_indian_civil(julian);
			$('#icyear').val(hcal[0]);
			$('#icmonth').val(Number(hcal[1]));
			$('#icday').val(hcal[2]);
			// TODO update the days in the month correctly.
			//addWeekdayTags($('#jcweekday'),julian,frDesc);
		};
		this.updateFromHTML = function() {
			var julianday = indian_civil_to_jd(Number($('#icyear').val()),Number($('#icmonth').val()),Number($('#icday').val()));
			var newgreg = jd_to_gregorian(julianday);
			//if (newgreg[0] == thedate.year && newgreg[1] == thedate.month && newgreg[2] == thedate.day && $('#jcweekday[value]').val() != julianday) {
				//gd = jd_to_gregorian($('#jcweekday').val());
			//}
			//else {
				gd = newgreg;
			//}
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
		};
	},//}}}
}

// the set functions {{{
// number of days +/- the weekday to display
var weekdaywiggle = 15;
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
var frDesc = function(i) {
	return "GODO";
}
function setAllCalendars(gregorianDate) {
	$.each(implementations,function(key,value) {
		value.updateForm(gregorianDate);
	});
	setResults($('#results'),gregorianDate,$('#toSelection').find(':selected').attr('value'));
	thedate = gregorianDate;
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
