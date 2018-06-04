---
---
$(function() {

  var
    {% include js/api.js %},
    {% include js/ranks.js %},
    bungieId = checkParams('bungieId'),
    destinyId = checkParams('destinyId'),
    joined = checkParams('joined'),
    rank = checkParams('rank'),
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

  if (bungieId && destinyId && joined && rank) {
    $.ajax({
      url: "https://www.bungie.net/Platform/Destiny2/4/Account/" + destinyId + "/Character/0/Stats/",
      headers: {
        "X-API-Key": apiKey
      },
      success: function(data) {
				if (data.ErrorStatus === 'Success') {
					var
          // pvp stats
	        stats = data.Response.allPvP.allTime,
	        efficiency = stats.efficiency.basic.displayValue,
	        kd = stats.killsDeathsRatio.basic.displayValue,
	        kda = stats.killsDeathsAssists.basic.displayValue,
	        kills = stats.kills.basic.displayValue,
	        deaths = stats.deaths.basic.displayValue,
	        assists = stats.assists.basic.displayValue,
	        precisionKills = stats.precisionKills.basic.displayValue,
	        combatRating = stats.combatRating.basic.displayValue,
	        mostKills = stats.bestSingleGameKills.basic.displayValue,
	        killSpree = stats.longestKillSpree.basic.displayValue,
	        mostPrecision = stats.mostPrecisionKills.basic.displayValue,
	        weapon = stats.weaponBestType.basic.displayValue,
          // pve stats
          // raid stats
          raid = data.Response.raid.allTime,
          raidClears = raid.activitiesCleared.basic.displayValue,
          raidKd = raid.killsDeathsRatio.basic.displayValue,
          raidKills = raid.kills.basic.displayValue,
          raidAvgKills = raid.kills.pga.displayValue,
          raidBestKills = raid.bestSingleGameKills.basic.displayValue,
          // strikes stats
          strikes = data.Response.allStrikes.allTime,
          strikesClears = strikes.activitiesCleared.basic.displayValue,
          strikesKd = strikes.killsDeathsRatio.basic.displayValue,
          strikesKills = strikes.kills.basic.displayValue,
          strikesAvgKills = strikes.kills.pga.displayValue,
          strikesBestKills = strikes.bestSingleGameKills.basic.displayValue,
	        clock = stats.allParticipantsTimePlayed.basic.displayValue,
	        hours = clock.match(/\d+/g);

	        totalHours = (Number(hours[0]) * 24) + Number(hours[1]);

	        console.log('Player stats:', data);

	        // Populate stats
          // pvp
	        $('#player-clock').text(totalHours + 'h');
	        $('#player-efficiency').text(efficiency);
	        $('#player-kd').text(kd);
	        $('#player-kda').text(kda);
	        $('#player-kills').text(kills);
	        $('#player-assists').text(assists);
	        $('#player-precision-kills').text(precisionKills);
	        $('#player-weapon').text(weapon);
	        $('#player-kill-spree').text(killSpree);
	        $('#player-most-kills').text(mostKills);
	        $('#player-most-precision').text(mostPrecision);
          // pve
          // raid
          $('#player-raid-clears').text(raidClears);
          $('#player-raid-kd').text(raidKd);
          $('#player-raid-kills').text(raidKills);
          $('#player-raid-kills-pga').text(raidAvgKills);
          $('#player-raid-best-kills').text(raidBestKills);
          // strikes
          $('#player-strike-clears').text(strikesClears);
          $('#player-strike-kd').text(strikesKd);
          $('#player-strike-kills').text(strikesKills);
          $('#player-strike-kills-pga').text(strikesAvgKills);
          $('#player-strike-best-kills').text(strikesBestKills);
				} else {
					alert('Uh oh, failed to load player stats! Looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
				  console.log(data);
				}

      },
      error: function(data) {
				alert('Uh oh, failed to load player stats! Looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
        console.log('Error loading player stats:', data);
      }
    });

    $.ajax({ // get Bungie Profile
      url: "https://www.bungie.net/Platform/User/GetBungieNetUserById/" + bungieId + "/",
      headers: {
        "X-API-Key": apiKey
      },
      success: function(data) {
				if (data.ErrorStatus === 'Success') {
					console.log('Player profile:', data);
					var
					response = data.Response,
					about = response.about,
					banner = response.profileThemeName,
					blizzard = response.blizzardDisplayName,
					icon = response.profilePicturePath,
					name = blizzard.substring(0, blizzard.indexOf('#'));

					// Populate profile
					$('.hero#player-hero').css({
						'background-image': 'url("https://bungie.net/img/UserThemes/' + banner + '/header.jpg")'
					})
					$('#player-title').text(blizzard);
					$('.player-icon').attr({
						'src': 'https://www.bungie.net' + icon
					});
					$('#player-join-date').text(joined.replace(/-/g, '/'));
					// Check clan rank
					if (rank === '1') {
						// players with "beginner" rank in Bungie are Initaites
						$('#player-rank').text('Iron Initiate').css('color', '#ccc');
					} else {
						// check for name in promoted lists
						if (checkName(name, honored)) {
							$('#player-rank').text('Honored Brigadier').css('color', '#6cbdd1');
						} else if (checkName(name, exalted)) {
							$('#player-rank').text('Exalted Brigadier').css('color', '#a95fb5');
						} else if (checkName(name, lords)) {
							$('#player-rank').text('Iron Lord').css('color', '#dac057');
						} else if (checkName(name, founder)) {
							$('#player-rank').text('The Founder').css('color', '#dac057');
						} else {
							// if not in any other list, they're a Sentry
							$('#player-rank').text('Iron Sentry').css('color', '#72c173');
						}
					}
				} else {
					console.log('Error loading player profile:', data);
	        alert('Uh oh, failed to load player info! Looks like Bungie\'s doing server maintenance or having problems. Stats will be back up when Bungie\'s servers are. Please check back again soon!');
				}
      },
      error: function(data) {
        console.log('Error loading player profile:', data);
        alert('Uh oh, looks like Bungie\'s doing server maintenance or having problems. Stats will be back up when Bungie\'s servers are. Please check back again soon!');
      }
    });
  }

  function checkParams(param) {

    var
    pageURL = window.location.search.substring(1),
    urlParams = pageURL.split('&');

    if (urlParams.length > 0) {
      for (var i = 0; i < urlParams.length; i++) {
        var pair = urlParams[i].split('=');
        if (pair[0] == param) {
          return pair[1];
        }
      }
    }
  }

});
