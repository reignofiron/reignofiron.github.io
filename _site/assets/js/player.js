$(function() {

  var
    apiKey = "39424dade4d141af9a0807725a14ed20", // production
    // apiKey = "6987280b74b24575a4e805277bb5baa6", // local
    groupID = "2974952",
    destinyId = checkParams('destinyId'),
    memberType = checkParams('memberType'),
    name = checkParams('name'),
    icon = checkParams('icon'),
    joined = checkParams('joined'),
    rank = checkParams('rank');

  if (destinyId && memberType && name && icon) {
    $.ajax({
      url: "https://www.bungie.net/Platform/Destiny2/" + memberType + "/Account/" + destinyId + "/Character/0/Stats/",
      headers: {
        "X-API-Key": apiKey
      },
      success: function(data) {
        var
        stats = data.Response.allPvP.allTime,
        efficiency = stats.efficiency.basic.displayValue,
        kd = stats.killsDeathsRatio.basic.displayValue,
        kda = stats.killsDeathsAssists,
        kills = stats.kills.basic.displayValue,
        deaths = stats.deaths.basic.displayValue,
        assists = stats.assists.basic.displayValue,
        combatRating = stats.combatRating.basic.displayValue,
        weapon = stats.weaponBestType.basic.displayValue,
        clock = stats.allParticipantsTimePlayed.basic.displayValue;
        console.log(data);

        // Populate profile
        $('#player-title').text(name);
        $('.player-icon').attr({
          'src': icon
        });
        $('#player-join-date').text(joined.replace(/-/g, '/'));
        switch(rank) {

          case '3': $('#player-rank').text('Iron Officer')
          break;

          case '5': $('#player-rank').text('Iron General');
          break;

          default: $('#player-rank').text('Iron Brigaider');
        }
        $('#player-clock').text(clock);
        // Populate stats
        $('#player-efficiency').text(efficiency);
        $('#player-kd').text(kd);
        $('#player-kills').text(kills);
        $('#player-assists').text(assists);
        $('#player-combat-rating').text(combatRating);
        $('#player-weapon').text(weapon);
      },
      error: function(data) {
        console.log(data);
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
