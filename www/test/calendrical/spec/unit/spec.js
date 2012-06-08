
describe 'GUI Things: '
	before_each
		appendTo = $(fixture('appendable.html'))
		len = Object.keys(implementations).length;
	end

  describe 'the makeList function'
		it 'show all calendars when none are excluded'
			makeList(appendTo,'named');
			appendTo.should.have_tag 'ul'
      for (var key in implementations) {
				appendTo.find('option[value='+ key +']').should.have_tag "<option>"
			}
    end

		it 'show all but excluded calendars'
			makeList(appendTo,'named','julian');
			appendTo.should.have_tag 'ul'
      for (var key in implementations) {
				if (key != 'julian') {
					appendTo.find('option[value='+ key +']').should.have_tag "<option>"
				}
				else {
					appendTo.find('option[value='+ key +']').length.should.eql 0
				}
			}
		end
  end
end


describe 'Dates: '
	describe 'to human readable types'
		it 'check hebrew'
			implementations['hebrew'].toHTML({year:2010, month:10, day:24}).should.eql "<li>5771, Heshvan 16</li>"
			implementations['hebrew'].toHTML({year:-1238, month:2, day:6}).should.eql "<li>2522, Adar I 16</li>"
		end
	end
end

// TODO test dates:
// gregorian: oct 23, 2010 -> Oct 10, 2010 julian calendar -> 2455493 julian -> 55492 modified julian
// gregorian: may 5, 1752 ->  Apr 24, 1752 julian calendar -> 2361090 julian -> -38911 modified julian
