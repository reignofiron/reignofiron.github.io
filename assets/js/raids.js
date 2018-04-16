---
---
var
	{% include js/api.js %},
	days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
	weekMap = {},
	sheetURL = 'https://script.google.com/macros/s/AKfycbzd7JwMek_PEK_X2anmO7fRPaWbY06uf3OLD-x6BJWlB-cYKls/exec',
	today = new Date().getDay(),
	sortedDays = days.slice(today).concat(days.slice(0, today)),
	userNames = [];
	checkName = function(name) {

		var m = false; // flag
		console.log('Checking to see if ' + name + ' is a Reign of Iron Member...');

		// loop through clan usernames and check for a match
		$.each(userNames, function(i) {
			// make case insensitve
			if (name.toLowerCase() === userNames[i].toLowerCase()) {
				console.log('Confirmed, ' + userNames[i] + ' is in Reign of Iron');
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
}).done(function(json) {
	var members = json.Response.results;
	$.each(members, function(i) {
		userNames.push(members[i].destinyUserInfo.displayName);
	});
});

// reorder signup sheets so today's shows up first
$('.signupSheet').sort(function(a, b) {
	return sortedDays.indexOf($(a).attr('id')) > sortedDays.indexOf($(b).attr('id'));
}).appendTo('#raid-signup');

/* Load Data for Signups */
$('.signupSheet').each(function() {
	var
		day = $(this).attr('id'),
		sheet = $(this).data('sheet'),
		$this = $(this),
		url = 'https://spreadsheets.google.com/feeds/list/' + sheet + '/od6/public/basic?alt=json';

	$.ajax({
		url: url,
		success: function(response) {
			var
				data = response.feed.entry,
				parsedData = [];

			// parse Google sheets data into more manageable format
			$.each(data, function(i) {
				parsedData.push({
					name: data[i].title.$t,
					available: data[i].content.$t.replace('timeframe: ', ''),
				});
			});

			// if anyone is signed up
			if (parsedData.length > 0) {
				// hide the "no one signed up" thing
				$this.find('.signupSheet-empty').hide();
				// populate data for signup
				$.each(parsedData, function(i) {
					console.log('Player signed up for ' + day + ':', parsedData[i]);
					$this.find('.signupSheet-content').append(
						'<div class="j-row signupSheet-entry">' +
						'<div class="j-col j-col-6" data-th="Player"><span class="signupSheet-player">' + parsedData[i].name + '</span></div>' +
						'<div class="j-col j-col-6" data-th="Available"><span class="signupSheet-availability">' + parsedData[i].available + '</span></div>' +
						'</div>'
					);
				});
			}
		}

	});
});

/* Signup Form Submission */
$('form.signupForm').submit(function(e) {
	// stop form from reloading the page
	e.preventDefault();
	// Show loading screen
	$('#loading').fadeIn();

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
				// add to signup sheet immediately
				$form.closest('.signupSheet')
					// first get rid of "no one signed up" message if user is first to register
					.find('.signupSheet-empty')
					.hide()
					.end()
					// create new row in table and append entered data
					.find('.signupSheet-content')
					.append(
						'<div class="j-row signupSheet-entry">' +
						'<div class="j-col j-col-6" data-th="Player"><span class="signupSheet-player">' + name + '</span></div>' +
						'<div class="j-col j-col-6" data-th="Available"><span class="signupSheet-availability">' + timeFrame.val() + '</span></div>'
					);
			},
			error: function(response) {
				console.log(response);
				alert('Sorry, looks like there was an error signing you up. Please try again, and if the issue persists, get a hold of kuro.');
			}
		});

	} else { // if user entered an invalid name

		console.log('Error: no record of ' + name + ' in Reign of Iron roster.');
		alert('Sorry, no record of ' + name + ' in the Reign of Iron roster. Please make sure you\'re using your Battletag and that you\'ve spelled it correctly.');

	}

});
