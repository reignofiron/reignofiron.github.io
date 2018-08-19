---
---
{% include js/api.js %},
{% include js/brigade.js %},
days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
sheetURL = 'https://script.google.com/macros/s/AKfycbzd7JwMek_PEK_X2anmO7fRPaWbY06uf3OLD-x6BJWlB-cYKls/exec',
today = new Date().getDay(),
sortedDays = days.slice(today).concat(days.slice(0, today)),
roster = [],
checkName = function(name, list) {

  var m = false; // flag
  console.log('Checking for ' + name + '...');

  // loop through clan usernames and check for a match
  $.each(list, function(i) {
    // make case insensitve
    if (name.toLowerCase() === list[i].toLowerCase()) {
      console.log('Confirmed: ' + list[i]);
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
  console.log(json);
});

// reorder signup sheets so today's shows up first
$('.pvpSignup').sort(function(a, b) {
	return sortedDays.indexOf($(a).attr('id')) > sortedDays.indexOf($(b).attr('id'));
}).appendTo('#crucible-signup');

/* Load Data for Signups */
$('.pvpSignup').each(function() {
	var
	day = $(this).attr('id'),
	pvpOpen = 'https://spreadsheets.google.com/feeds/list/' + $(this).data('open') + '/od6/public/basic?alt=json',
	pvpBrigade = 'https://spreadsheets.google.com/feeds/list/' + $(this).data('brigade') + '/od6/public/basic?alt=json',
	openSignups = [],
	brigadeSignups = [],
	$this = $(this),
	populateSignups = function(list, level) {
		if (list.length > 0) {
			// hide the "no one signed up" thing
			$this.find('.pvpSignup-level.pvpSignup-level--' + level).find('.pvpSignup-empty').hide();
			// populate data for signup
			$.each(list, function(i) {
				console.log('Player signed up for ' + day + ':', list[i]);
				$this.find('.pvpSignup-level--' + level).find('.pvpSignup-content').append(
					'<div class="j-row pvpSignup-entry">' +
					'<div class="j-col j-col-6" data-th="Player"><span class="pvpSignup-player">' + list[i].name + '</span></div>' +
					'<div class="j-col j-col-6" data-th="Available"><span class="pvpSignup-availability">' + list[i].available + '</span></div>' +
					'</div>'
				);
			});
		}
	};

	$.ajax({
		url: pvpOpen,
		success: function(response) {
			var data = response.feed.entry;
			// parse Google sheets data into more manageable format
			$.each(data, function(i) {
				openSignups.push({
					name: data[i].title.$t,
					available: data[i].content.$t.replace('availability: ', ''),
				});
			});
			populateSignups(openSignups, 'open');
		},
    error: function(response) {
      console.log('Error for ' + day, response);
      alert('Uh oh, looks like something went wrong loading the signup sheets. Please report this issue to kuro in Discord.');
    }
	});

	$.ajax({
		url: pvpBrigade,
		success: function(response) {
			var data = response.feed.entry;
			// parse Google sheets data into more manageable format
			$.each(data, function(i) {
				brigadeSignups.push({
					name: data[i].title.$t,
					available: data[i].content.$t.replace('availability: ', ''),
				});
			});
			populateSignups(brigadeSignups, 'brigade');
		},
    error: function(response) {
      console.log('Error for ' + day, response);
      alert('Uh oh, looks like something went wrong loading the signup sheets. Please report this issue to kuro in Discord.');
    }
	});

});

/* Signup Form Submission */
$('form.pvpSignupForm').submit(function(e) {
	var
		$form = $(this),
    available = [],
    name = $form.find('input[name="name"]').val(),
    postTo = $form.data('postto'),
    availability = $form.find('input[name="availability"]');
    postSignup = function() {
      // find the raid time(s) the user has selected and push their values to an array
  		$form.find('input[type="checkbox"]').each(function() {
  			if ($(this).is(':checked')) {
  				available.push($(this).val());
  			}
  		});
  		// turn the array into a string to and put it in the input that goes to Google
  		available = available.join(', ');
  		availability.val(available);

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
  					+ $form.closest('.pvpSignup').attr('id') +
  					', ' + name + '!'
  				);
          $('.pvpSignup-form').removeClass('is-visible').fadeOut();
  				// add new data to table immediately
          $form.closest('.pvpSignup-level')
  				.find('.pvpSignup-empty')
  				.hide()
  				.end()
  				.find('.pvpSignup-content')
  				.append(
            '<div class="j-row pvpSignup-entry">' +
    				'<div class="j-col j-col-6" data-th="Player"><span class="pvpSignup-player">' + name + '</span></div>' +
    				'<div class="j-col j-col-6" data-th="Available"><span class="pvpSignup-availability">' + available + '</span></div>'
  				);
  			},
  			error: function(response) {
  				console.log(response);
  				alert('Sorry, looks like there was an error signing you up. Please try again, and if the issue persists, get a hold of kuro.');
  			}
  		});
    };

  // stop form from reloading the page
  e.preventDefault();
  // Show loading screen
  $('#loading').fadeIn();
  // enable scrolling again
	$('html,body').css('overflow', '');

	if (checkName(name, roster)) { // if entered name exists in current roster

    if ($form.is('.pvpSignupForm--brigade')) {

      if(checkName(name, brigade)) {

        postSignup();

      } else {

        alert('Sorry, ' + name + ', this signup sheet is restricted to the Iron Brigade rank. Please use the Open signups until you reach Brigadier.');
        $('#loading').hide();

      }

    } else {

      postSignup();

    }

	} else { // if user entered an invalid name

		console.log('Error: no record of ' + name + ' in Exalted roster.');
		alert('Sorry, no record of ' + name + ' in the Exalted roster. Please make sure you\'re using your Battletag and that you\'ve spelled it correctly.');
		$('#loading').hide();
	}

});

$(function() {

  $('.js-signup-button').click(function() {
    $(this).closest('.pvpSignup-level').find('.pvpSignup-form').fadeIn().addClass('is-visible');
    $('html, body').css('overflow', 'hidden');
  });

  $('.pvpSignupForm-close').click(function() {
    $(this).closest('.pvpSignup-form').fadeOut().removeClass('is-visible');
    $('html, body').css('overflow', '');
  });

  $(document).keydown(function(e) {
    if (e.keyCode == '27') {
      $('.pvpSignup-form').fadeOut().removeClass('is-visible');
      $('html, body').css('overflow', '');
    }
  });

  $('select[name="level"]').change(function(e) {

		var
		parentSheet = $(this).closest('.pvpSignup'),
		openSheet = parentSheet.find('.pvpSignup-level--open'),
		brigadeSheet = parentSheet.find('.pvpSignup-level--brigade'),
		selection = $(this).val();

		if (selection === 'Open') {
			brigadeSheet.removeClass('is-visible').hide();
			openSheet.addClass('is-visible').show();
		} else if (selection === 'Brigade') {
			openSheet.removeClass('is-visible').hide();
			brigadeSheet.addClass('is-visible').show();
		}

	});

});
