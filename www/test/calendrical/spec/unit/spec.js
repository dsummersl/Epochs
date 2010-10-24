
describe 'GUI Things'
	before_each
		appendTo = $(fixture('appendable'))
		len = calendars.length;
	end

  describe 'makeList'
		it 'show all calendars when none are excluded'
			makeList(appendTo,'named');
			appendTo.should.have_tag 'ul'
			for (var i=0; i<len; i++) {
				appendTo.find('option[value='+ calendars[i] +']').should.have_tag "<option>"
			}
    end

		it 'show all but excluded calendars'
			makeList(appendTo,'named','julian');
			appendTo.should.have_tag 'ul'
			for (var i=0; i<len; i++) {
				if (calendars[i] != 'julian') {
					appendTo.find('option[value='+ calendars[i] +']').should.have_tag "<option>"
				}
				else {
					appendTo.find('option[value='+ calendars[i] +']').length.should.eql 0
				}
			}
		end
  end
end


// TODO test dates:
// gregorian: oct 23, 2010 -> Oct 10, 2010 julian calendar -> 2455493 julian -> 55492 modified julian
// gregorian: may 5, 1752 ->  Apr 24, 1752 julian calendar -> 2361090 julian -> -38911 modified julian
