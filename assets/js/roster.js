---
---

// get list of members and populate roster table

var roster = [];

$.when(
	// get Reign of Iron roster
	$.ajax({
		url: "https://www.bungie.net/platform/GroupV2/" + roiGroupId + "/Members/",
		headers: {
			"X-API-Key": apiKey
		}
	})
	.success(function(json) {

		if (json.ErrorStatus === 'Success') {

			var members = json.Response.results;

			$.each(members, function(i) {
				var member = members[i];
				member.exalted = false;
				roster.push(member);
			});

			console.log('RoI member list:', members);

		} else {

			alert('Uh oh, looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
			console.log(json);

		}

	})
	.error(function(err) {

		alert('Uh oh, looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
		console.log(err);

	}),

	// get Exalted roster

	$.ajax({
		url: "https://www.bungie.net/platform/GroupV2/" + exaltedGroupId + "/Members/",
		headers: {
			"X-API-Key": apiKey
		}
	})
	.success(function(json) {

		if (json.ErrorStatus === 'Success') {

			var members = json.Response.results;

			$.each(members, function(i) {
				var member = members[i];
				member.exalted = true;
				roster.push(member);
			});

			console.log('Exalted member list:', members);

		} else {

			alert('Uh oh, looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
			console.log(json);

		}

	})
	.error(function(json) {

		alert('Uh oh, looks like Bungie\'s doing server maintenance or having problems. Please check back again soon!');
		console.log(json);

	})

)
.then(function() {

	listMembers(roster);

});


function listMembers(rsp) {

  var
  list = $('.memberList-list'),
  online = 0,
  sortMembers = function(method) {
    // sort by date joined
    if (method = joined) {
      list.find('.member').sort(function(a, b) {
        return ($(b).data('joined')) < ($(a).data('joined')) ? 1 : -1;
      }).appendTo(list);
    } else if (method = username) {
      list.find('.member').sort(function(a, b) {
        return ($(b).data('username')) < ($(a).data('username')) ? 1 : -1;
      }).appendTo(list);
    }
    list.find('.member.online').prependTo(list);
  };

  for (var i = 0; i < rsp.length; i++) {

    var
		profile = rsp[i].bungieNetUserInfo,
		member = $('<a></a>');

		// tally up online members
		if (rsp[i].isOnline) {
			online++
		}

		// check for valid profile
		// some users don't have Bungie profiles somehow and it breaks function
    if (typeof profile != 'undefined') {
			// store response data in semantic variables
      var
        name = rsp[i].destinyUserInfo.displayName,
        joinDate = rsp[i].joinDate,
        joined = joinDate.substring(0, joinDate.indexOf('T')),
        online = rsp[i].isOnline,
        icon = profile.iconPath,
        memberId = profile.membershipId,
        memberType = rsp[i].destinyUserInfo.membershipType,
        destinyId = rsp[i].destinyUserInfo.membershipId,
        rank = rsp[i].memberType;
			// configure DOM node and add to page
      member
        .attr({
          'class': 'j-row vertical-center-row member',
          'href': '/player/?bungieId=' + memberId + '&destinyId=' + destinyId + '&joined=' + joined + '&rank=' + rank,
          'title': 'See player profile for ' + name,
          'data-joined' : joined.replace(/-/g, ''),
          'data-username': name,
          'data-online' : 'false',
          'data-searchable' : name,
        })
        .html(
          '<div class="j-col j-col-1 member-icon"><img src="https://bungie.net/' + icon + '"></div>' +
          '<div class="j-col j-col-3 member-name"><h3>' + name + '</h3></div>' +
          '<div class="j-col j-col-3 member-joined" data-label="Joined">' + joined.replace(/-/g, '/') + '</div>' +
          '<div class="j-col j-col-3 member-status" data-label="Status"><span class="member-online" id="status-' + memberId + '">' + online + '</span></div>' +
          '<div class="j-col j-col-3 member-button"><a class="button outline gold full-width">' + 'View Stats' + '</a></div>'
        );

			if (rsp[i].exalted) {
				member.addClass('exalted');
			}

			member.appendTo(list);

			// indicate online/offline status
      if (String(online) === 'true') {
        $('#status-' + memberId)
        .text('Online')
        .addClass('online')
        .closest('.member')
        .attr('data-online', true)
        .addClass('online');
      } else {
        $('#status-' + memberId).text('Offline').removeClass('online');
      }

      sortMembers(joined); // sort members by join date

    }

  }

	$('#member-count').text(online + ' / ' + rsp.length + ' Members Online');

}
