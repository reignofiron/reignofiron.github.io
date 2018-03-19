var
  apiKey = "39424dade4d141af9a0807725a14ed20", // production
  // apiKey = "6987280b74b24575a4e805277bb5baa6", // local
  groupID = "2974952";

$.ajax({
  url: "https://www.bungie.net/platform/GroupV2/" + groupID + "/Members/",
  headers: {
    "X-API-Key": apiKey
  }
}).done(function(json) {
  var memberList = json.Response.results;
  console.log(memberList);
  listMembers(memberList);
});

function listMembers(rsp) {

  for (var i = 0; i < rsp.length; i++) {

    var
      profile = rsp[i].bungieNetUserInfo,
      row = $('<a></a>'),
      list = $('section.memberList').find('.memberList-list');

    console.log(rsp[i].destinyUserInfo.displayName);

    if (typeof profile != 'undefined') {

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

      row
        .attr({
          'class': 'j-row member vertical-center-row',
          'href': '/player/?destinyId=' + destinyId + '&memberType=' + memberType + '&name=' + name + '&icon=https://bungie.net/' + icon + '&joined=' + joined + '&rank=' + rank,
          'title': 'See player profile for ' + name
        })
        .html(
          '<div class="j-col j-col-1 member-icon"><img src="https://bungie.net/' + icon + '"></div>' +
          '<div class="j-col j-col-3 member-name"><h3>' + name + '</h3></div>' +
          '<div class="j-col j-col-3 member-joined" data-label="Joined">' + joined.replace(/-/g, '/') + '</div>' +
          '<div class="j-col j-col-3 member-status" data-label="Status"><span class="member-online" id="status-' + memberId + '">' + online + '</span></div>' +
          '<div class="j-col j-col-3 member-button"><a class="button outline gold full-width">' + 'View Stats' + '</a></div>'
        )
        .appendTo(list);

      if (String(online) === 'true') {
        $('#status-' + memberId)
        .text('Online')
        .addClass('online')
        .closest('.member')
        .prependTo('.memberList-list');
      } else {
        $('#status-' + memberId).text('Offline').removeClass('online');
      }

    }

  }

}
