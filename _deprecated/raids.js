---
---
var
	{% include js/api.js %},
	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	sheetURL = 'https://script.google.com/macros/s/AKfycbzd7JwMek_PEK_X2anmO7fRPaWbY06uf3OLD-x6BJWlB-cYKls/exec',
	today = new Date().getDay(),
	sortedDays = days.slice(today).concat(days.slice(0, today)),
	roster = [],
	checkName = function(name) {

		var m = false; // flag
		console.log('Checking to see if ' + name + ' is a Exalted Member...');

		// loop through clan roster and check for a match
		$.each(roster, function(i) {
			// make case insensitve
			if (name.toLowerCase() === roster[i].toLowerCase()) {
				console.log('Confirmed, ' + roster[i] + ' is in Exalted');
				m = true;
			}
		});

		if (m) {
			return true;
		} else {
			return false;
		}

	};

$.fn.serializeObject = function() {
	var o = {};
	var a = this.serializeArray();
	$.each(a, function() {
		if (o[this.name]) {
			if (!o[this.name].push) {
				o[this.name] = [o[this.name]];
			}
			o[this.name].push(this.value || '');
		} else {
			o[this.name] = this.value || '';
		}
	});
	return o;
};

// Store member list immediately so we only make one AJAX request to Bungie API
$.ajax({
	url: "https://www.bungie.net/platform/GroupV2/" + groupID + "/Members/",
	headers: {
		"X-API-Key": apiKey
	}
}).success(function(json) {
	if (json.ErrorStatus === 'Success') {
		var members = json.Response.results;
		$.each(members, function(i) {
	    roster.push(members[i].destinyUserInfo.displayName);
	  });
	} else {
		alert('Uh oh, failed to load RoI roster. Looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
	  console.log(json);
	}
}).error(function(json) {
  alert('Uh oh, failed to load RoI roster. Looks like Bungie\'s doing server maintenance or having problems. Signups will resume when Bungie\'s servers do. Please check back again soon!');
  console.log(json.Response.results);
});

// reorder signup sheets so today's shows up first
$('.signupSheet').sort(function(a, b) {
	return sortedDays.indexOf($(a).attr('id')) > sortedDays.indexOf($(b).attr('id'));
}).appendTo('#raid-signup');

/* Load Data for Signups */
$('.signupSheet').each(function() {
	var
	day = $(this).attr('id'),
	eow = 'https://spreadsheets.google.com/feeds/list/' + $(this).data('eow') + '/od6/public/basic?alt=json',
	leviathan = 'https://spreadsheets.google.com/feeds/list/' + $(this).data('leviathan') + '/od6/public/basic?alt=json',
	eowSignups = [],
	levSignups = [],
	$this = $(this),
	populateSignups = function(list, raid) {
		if (list.length > 0) {
			// hide the "no one signed up" thing
			$this.find('.signupSheet-wrap.' + raid + '-signup').find('.signupSheet-empty').hide();
			// populate data for signup
			$.each(list, function(i) {
				console.log('Player signed up for ' + day + ':', list[i]);
				$this.find('.signupSheet-wrap.' + raid + '-signup').find('.signupSheet-content').append(
					'<div class="j-row signupSheet-entry">' +
					'<div class="j-col j-col-6" data-th="Player"><span class="signupSheet-player">' + list[i].name + '</span></div>' +
					'<div class="j-col j-col-6" data-th="Available"><span class="signupSheet-availability">' + list[i].available + '</span></div>' +
					'</div>'
				);
			});
		}
	};

	$.ajax({
		url: leviathan,
		success: function(response) {
			var data = response.feed.entry;
			// parse Google sheets data into more manageable format
			$.each(data, function(i) {
				levSignups.push({
					name: data[i].title.$t,
					available: data[i].content.$t.replace('timeframe: ', ''),
				});
			});
			populateSignups(levSignups, 'leviathan');
		}
	});

	$.ajax({
		url: eow,
		success: function(response) {
			var data = response.feed.entry;
			// parse Google sheets data into more manageable format
			$.each(data, function(i) {
				eowSignups.push({
					name: data[i].title.$t,
					available: data[i].content.$t.replace('timeframe: ', ''),
				});
			});
			populateSignups(eowSignups, 'eow');
		}
	});

});

/* Signup Form Submission */
$('form.signupForm').submit(function(e) {
	// stop form from reloading the page
	e.preventDefault();
	// Show loading screen
	$('#loading').fadeIn();
	// enable scrolling again
	$('html,body').css('overflow', '');
	var
		available = [],
		name = $(this).find('input[name="player_name"]').val(),
		postTo = $(this).data('postto'),
		timeFrame = $(this).find('input[name="time_frame"]'),
		$form = $(this);

	if (checkName(name)) { // if entered name exists in current roster

		// find the raid time(s) the user has selected and push their values to an array
		$form.find('input[type="checkbox"]').each(function() {
			if ($(this).is(':checked')) {
				available.push($(this).val());
			}
		});
		// turn the array into a string to and put it in the input that goes to Google
		available = available.join(', ');
		timeFrame.val(available);

		// Turn form into object and send to Google
		$.ajax({
			url: 'https://script.google.com/macros/s/' + postTo + '/exec',
			method: "GET",
			dataType: "json",
			data: $form.serializeObject(),
			success: function(response) {
				console.log(response);
				// get rid of loading animation
				$('#loading').fadeOut();
				// alert user of successful registration
				alert(
					'Nice, you\'ve been added to the list for '
					+ $form.closest('.signupSheet').attr('id') +
					', ' + name + '!'
				);
				// add new data to table immediately
				$form.closest('.signupSheet-wrap')
				.find('.signupSheet-empty')
				.hide()
				.end()
				.find('.signupSheet-content')
				.append(
					'<div class="j-row signupSheet-entry">' +
					'<div class="j-col j-col-6" data-th="Player"><span class="signupSheet-player">' + name + '</span></div>' +
					'<div class="j-col j-col-6" data-th="Available"><span class="signupSheet-availability">' + available + '</span></div>'
				);
			},
			error: function(response) {
				console.log(response);
				alert('Sorry, looks like there was an error signing you up. Please try again, and if the issue persists, get a hold of kuro.');
			}
		});

	} else { // if user entered an invalid name

		console.log('Error: no record of ' + name + ' in Exalted roster.');
		alert('Sorry, no record of ' + name + ' in the Exalted roster. Please make sure you\'re using your Battletag and that you\'ve spelled it correctly.');
		$('#loading').fadeOut();
	}

});

/* DOM Manipulation and Event Listeners */
$(function() {

	$('.signupSheet-raid-select').change(function(e) {

		var
		parentSheet = $(this).closest('.signupSheet'),
		leviathanSheet = parentSheet.find('.leviathan-signup'),
		eowSheet = parentSheet.find('.eow-signup'),
		selection = $(this).val();

		if (selection === 'Eater of Worlds') {
			leviathanSheet.removeClass('is-visible').hide();
			eowSheet.addClass('is-visible').show();
		} else if (selection === 'Leviathan') {
			eowSheet.removeClass('is-visible').hide();
			leviathanSheet.addClass('is-visible').show();
		}

	});

});
