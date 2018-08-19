---
---
var form = $('form.apply');

form.submit(function(e) {

  var
  // form data
  battle_string = form.find('input[name="Battletag_string"]').val().toLowerCase(),
  battle_num = form.find('input[name="Battletag_number"]').val().toLowerCase(),
  battletag = battle_string + '#' + battle_num,
  discord_string = form.find('input[name="Discord_string"]').val().toLowerCase(),
  discord_num = form.find('input[name="Discord_number"]').val().toLowerCase(),
  discord = discord_string + '#' + discord_num,
  _gotcha = form.find('input[name="_gotcha"]'),
  referral = form.find('input[name="Referral"]').val();

  var
  // google data
  roiUrl = 'AKfycbzx-AYEY2j8O6fvGdDkvYg3GqbR0gJjR7UBEmzp3Cf3_VEPyBw',
  exaltedUrl = 'AKfycbwzGeXU-tRUrriGFtR2IXZX29CbifLkHFnuPhAXjXWa2W2Goz8';

  var loading = $('#loading');

  // stop page reload
  e.preventDefault();

  // show loading animation and disable scroll
  loading.fadeIn();
	$('html,body').css('overflow', 'hidden');

  // spam check
  if (_gotcha.val() != '') {

    return false;

  } else {

    /* GET PLAYER DATA */
    $.ajax({

      url: 'https://www.bungie.net/Platform/Destiny2/SearchDestinyPlayer/4/' + battle_string + '%23' + battle_num + '/',
      headers: {
        "X-API-Key": apiKey
      },

    })
    .success(function(data) {

      if (data.ErrorCode == 1 && data.Response.length > 0) {

        var url;

        if (form.is('#apply-exalted')) {
          url = exaltedUrl;
        } else {
          url = roiUrl;
        }

        /* GET STATS */
        $.ajax({

          url: "https://www.bungie.net/Platform/Destiny2/4/Account/" + data.Response[0]['membershipId'] + "/Character/0/Stats/",
          headers: {
            "X-API-Key": apiKey
          }

        })
        .success(function(s) {
          // only execute if successful response from Bungie
          if (s.ErrorStatus === 'Success') {
            var stats = s.Response,
            pvp = stats.allPvP.allTime,
            raid = stats.raid.allTime,
            strikes = stats.allStrikes.allTime;

            // avg stats
            var pvpKd = pvp.killsDeathsRatio.basic.displayValue,
            pvpKda = pvp.killsDeathsAssists.basic.displayValue,
            pvpKad = pvp.efficiency.basic.displayValue,
            pvpKills = pvp.kills.basic.displayValue,
            raidKd = raid.killsDeathsRatio.basic.displayValue,
            strikeKd = strikes.killsDeathsRatio.basic.displayValue,
            pveKd = ( ( Number(strikeKd) + Number(raidKd) ) / 2 ),
            raidClears = raid.activitiesCleared.basic.displayValue;

            // format object to send to Google
            var player = {
              Battletag: battletag,
              Discord: discord,
              PvP_KD: pvpKd,
              PvP_KDA: pvpKda,
              PvP_KAD: pvpKad,
              PvP_Kills: pvpKills,
              PvE_KD: pveKd,
              Raid_Clears: raidClears,
              Referred_By: referral,
              Applied: new Date().toLocaleString()
            };

            console.log('Applicant:', player);

            /* SEND DATA TO GOOGLE */
            $.ajax({
              url: 'https://script.google.com/macros/s/' + url + '/exec',
              method: 'GET',
              data: player,
              dataType: 'json'
            })
            .success(function(d) {
              console.log('Google response:', d);
              if (d.result == 'success') {
                // show loading animation and disable scroll
                loading.fadeOut(600, function() {
                  $('html,body').css('overflow', '');
                  alert('Success! Your application has been received and will be reviewed by Exalted Leadership shortly. We\'ll contact you on Discord if you are approved!');
                });
              } else {
                loading.fadeOut(600, function() {
                  $('html,body').css('overflow', '');
                  alert('Uh oh! Something went wrong storing your application data. This is likely a problem on our end, please contact kuro#9556 on Discord directly.');
                });
              }
            })
            // if failed to send application
            .error(function(err) {
              console.log('Erroneous response:', err);
              loading.fadeOut(600, function() {
                $('html,body').css('overflow', '');
                alert('Uh oh! Something went wrong sending your application. Please reload the page and try again. If the error persists, contact kuro#9556 directly on Discord.');
              });
            });

          } else { // failed to retrieve user stats

            console.log('Bungie response: ', s);

            loading.fadeOut(600, function() {
              $('html,body').css('overflow', '');
              alert('Uh oh, we were unable to find that Battletag in Bungie\'s system. Please check spelling and try again. If the error persists, please contact Kuro#9556 on Discord.');
            });

            return false;

          }

        })
        .error(function(err) { // server error to find player stats

          console.log(err);

          loading.fadeOut(600, function() {
            $('html,body').css('overflow', '');
            alert('Uh oh, we were unable to find that Battletag in Bungie\'s system due to a server error. Bungie systems may be down for maintenance.');
          });

          return false;

        });

      } else { // failed to retrieve user data

        console.log('Bungie response: ', data);

        loading.fadeOut(600, function() {
          $('html,body').css('overflow', '');
          alert('Uh oh, we were unable to find that Battletag in Bungie\'s system. Please check spelling and try again. If the error persists, please contact Kuro#9556 on Discord.');
        });

        return false;

      }

    })
    .error(function(err) { // server error finding player

      console.log(err);

      loading.fadeOut(600, function() {
        $('html,body').css('overflow', '');
        alert('Uh oh, we were unable to find that Battletag in Bungie\'s system due to a server error. Bungie systems may be down for maintenance.');
      });

    });

  }

});
