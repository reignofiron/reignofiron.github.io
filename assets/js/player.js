---
---
$(function() {

  var
    {% include js/api.js %},
    bungieId = checkParams('bungieId'),
    destinyId = checkParams('destinyId'),
    joined = checkParams('joined'),
    rank = checkParams('rank');

  if (bungieId && destinyId && joined && rank) {
    $.ajax({
      url: "https://www.bungie.net/Platform/Destiny2/4/Account/" + destinyId + "/Character/0/Stats/",
      headers: {
        "X-API-Key": apiKey
      },
      success: function(data) {
        var
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
        clock = stats.allParticipantsTimePlayed.basic.displayValue,
        hours = clock.match(/\d+/g);

        totalHours = (Number(hours[0]) * 24) + Number(hours[1]);

        console.log('Player stats:', data);

        // Populate stats
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
      },
      error: function(data) {
        console.log('Error loading player stats:', data);
      }
    });

    $.ajax({ // get Bungie Profile
      url: "https://www.bungie.net/Platform/User/GetBungieNetUserById/" + bungieId + "/",
      headers: {
        "X-API-Key": apiKey
      },
      success: function(data) {
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
        $('#player-title').text(name);
        $('.player-icon').attr({
          'src': 'https://www.bungie.net' + icon
        });
        $('#player-join-date').text(joined.replace(/-/g, '/'));
        switch(rank) {

          case '3': $('#player-rank').text('Iron Officer')
          break;

          case '5': $('#player-rank').text('Iron General');
          break;

          default: $('#player-rank').text('Iron Brigaider');
        }
      },
      error: function(data) {
        console.log('Error loading player profile:', data);
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
