var Template = (function() {
    var summaryTemplate = "" +
        "<input type='text' value='<%=obj.summary.avgScore%>' class='pull-left idial'>" +
        "<span class='pull-left sdial'><%=obj.summary.avgScore%> %</span>" +
        "<ul class='pull-right'>" +
          "<li> <i class='icon-check '></i> <%=obj.summary.totalVote%> Votes</li>" +
          "<li> <i class='icon-tags '></i> <%=obj.summary.totalAttribute%> Attributes</li>" +
        "</ul>",
        saveCancelBtn = "" +
        "<div id='<%=id%>'>"+
          "<button id='<%=saveId%>' type='button' class='btn btn-success' style='position: relative; width: 100%;'> <i class='icon-arrow-right'></i> Save & Next</button>" +
         "</div>",
        commentTemplate = "" +
          //"<i class='icon-smile icon-2x btn cmtUpVote hide' style='position:absolute;margin-left: -2em;'></i>" +
          //"<i class='icon-frown icon-2x btn cmtDownVote hide' style='position:absolute;margin-left: 1em;'></i>" +
          "<p class='noSelect'><%=comment%></p>" +
          "<div class='commentInfo'>" +
            "<span class='pull-left date'><%=modifiedAt%></span>" +
            "<span class='pull-right'><%=username%></span>" +
            //"<span class='pull-right vote'>" +
            //  "<%=upVote%><i style='margin: 0 0.5em 0 0.5em;' class='icon-group'></i> agree" +
            //"</span>" +
          "</div>",
        commentRowTemplate = "" +
        "<div class='span5 left'></div>" +
        "<div class='span2'></div>" +
        "<div class='span5 right'></div>",
        linkTemplate = "" +
        "<div>" +
          "<div data-toggle='tooltip' title='Save' class='close attrSaveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
          "<div data-toggle='tooltip' title='Close' class='close attrCloseBtn'><i class='icon-remove-sign icon-large'></i></div>" +
        "</div>" +
        "<div class='inner'>" +
          "<span class='pull-left link' data-link='LtoR' contenteditable='<%=editable%>' ><%=LtoR%></span>" +
          "<span><i class='icon-link'></i></span>" +
          "<span class='pull-right link' data-link='RtoL' contenteditable='<%=editable%>' ><%=RtoL%></span>" +
        "</div>",
        entityTemplate = "" +
        "<p class='description'><%=description%></p>" +
        "<div id='textareaContainer-<%=domId%>' class='hide'>" +
          "<textarea class='editBox' placeholder='Add Description' data-widearea='enable'></textarea>" +
        "</div>",
        summaryCardTemplate = "" +
          "<div class='card-header'>" +
              "<legend contenteditable='<%=obj.editable%>' class='card-title'><%=obj.name%></legend>" +
            "<div class='card-header-btn card-header-left'>" +
              "<div class='card-status'>" +
              "</div>" +
            "</div>" +
            "<div class='card-header-btn card-header-right'>" +
              "<div class='xbtn-group'>" +
                "<button class='btn btn-mini headBtn btn-warning linkBtn hide'><i class='icon-paper-clip icon-large'></i></button>" +
                "<button class='btn btn-mini headBtn btn-success editBtn '><i class='icon-edit icon-large'></i></button>" +
              "</div>" +
            "</div>" +
            "<div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='icon-remove-sign icon-large'></i></div>" +
            "<div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
          "</div>" +
          "<div class='photo'>" +
            "<a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-<%=obj.domId%>' class='editImgBtn btn btn-small btn-success' href='#'>" +
              "Change Image" +
            "</a>" +
            "<% if (obj.id) { %>" +
              "<a href='/entity/<%=obj.id%>'>" +
            "<% } %>" +
              "<img class='profileimg' id='img-<%=obj.domId%>' src='<%=obj.imgURL ? obj.imgURL : '/static/img/blank.png'%>'></img>" +
            "<% if (obj.id) { %>" +
              "</a>" +
            "<% } %>" +
          "</div>" +
          "<div class='contentContainer outer'>" +
            "<div class='summary'>" +
              summaryTemplate +
            "</div>" +
            "<div class='entityDetail'>" +
              "<div class='profileContent outer'>" +
              "</div>" +
              "<div class='tagsContent outer'>" +
                "<div class='hashTag cardView'>" +
                 "<i class='tagBullet cardView icon-ellipsis-vertical'></i>" +
                 "<ul class='tags' id='hashtags-<%=obj.domId%>'>" +
                  "<%=obj.hashTags%>" +
                  "</ul>" +
                "</div>" +
              "</div>" +
            "</div>" +
            "<div class='break break-mini'></div>" +
            /*
            "<div class='attrContainer' >" +
              "<form class='form-search' style='margin:0; width: 90%;'>" +
                "<input type='text' class='attrSearchInput search-query'>" +
                "<i class='searchState icon-search' style='margin-left:-2em;'></i>" +
                "<button style='float:right;' title='Create New Attribute' class='addAttrBtn btn btn-small'><i class='icon-plus'></i> New</button>" +
              "</form>" +
              "<div class='outer' style='min-height:20px;margin-top:0.25em;'><i class='hide scroll up cursor-pointer icon-chevron-up'></i></div>" +
              "<div class='attrContent'></div>" +
              "<div class='outer' style='min-height:20px;'><i class='scroll down cursor-pointer icon-chevron-down'></i></div>" +
            "</div>" +  */
          "</div>",
        sponsoredTemplate = "" +
          "<div class='card-header'>" +
            "<legend class='card-title'>Sponsored</legend>" +
            "<div class='ad-header-btn ad-header-right'>" +
              "<i class='cursor-pointer subtle icon-minus-sign' data-toggle='tooltip' title='Report as Inappropriate'></i>" +
            "</div>" +
          "</div>" +
          "<div class='contentContainer outer'>" +
            "<div class='inner' style='display:block;'>" +
              "<div class='photo post img-polaroid'>" +
                "<a href='<%=redirectURL%>'>" +
                  "<img class='profileimg' src='<%=imageURL ? imageURL : 'static/img/blank.png'%>'></img>" +
                "</a>" +
              "</div>" +
            "</div>" +
          "</div>",
        attributeRowEdit = "" +
          "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>" +
            "<div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
            "<i style='font-size: 3em; <%=tone==App.POSITIVE ? 'color:red':''%>' data-toggle='tooltip' title='<%=tone%>' class='cursor-pointer tone icon-heart'>" +
              "<span class='noSelect toneText'> <%=tone%><span>" +
            "</i></div>" +
          "</td>" +
          "<td class='head'>" +
            "<div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='icon-remove-sign icon-large'></i></div>" +
            "<h3 class='attrName' contenteditable='true' ><%=obj.name%></h3>" +
          "</td>",
        attributeRow = "" +
          "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>" +
            "<i style='font-size: 3em; <%=tone==App.POSITIVE ? 'color:red':''%>' data-toggle='tooltip' title='<%=tone%>' class='icon-heart'>" +
              "<span class='noSelect toneText'> <%=tone%><span>" +
            "</i></div>" +
          "</td>" +
          "<td class='head'>" +
            "<h3><%=obj.name%></h3>" +
            "<span style='position: absolute; top: 5px; left: 10px;'></span>" +
            "<div class='voteBtns'>" +
              "<a href='' class='btn voteBtn upVote <%= obj.tone == App.POSITIVE ? 'btn-success' : 'btn-inverse' %>'>Yes <i class='upVote icon-thumbs-up'></i></a>" +
              "<a href='' class='btn voteBtn downVote <%= obj.tone == App.POSITIVE ? 'btn-danger' : 'btn-white' %>'>No <i class='downVote icon-thumbs-down'></i></a>" +
            "</div>" +
            "<div class='hidden rating <%=ratingType%>'>" +
            "</div>" +
           "</td>",
        attributeSimple = "" +
          "<h3>" +
            "<i title='<%=tone%>' class='icon-heart <%=TONE_ICON%>'>" +
            "<%=obj.name%>" +
          "</h3>" +
          "<span style='position: absolute; top: 5px; left: 10px;'></span>" +
          "<div class='voteBtns'>" +
            "<a href='' class='btn voteBtn upVote <%= obj.tone == App.POSITIVE ? 'btn-success' : 'btn-inverse' %>'>Yes <i class='upVote icon-thumbs-up'></i></a>" +
            "<a href='' class='btn voteBtn downVote <%= obj.tone == App.POSITIVE ? 'btn-danger' : 'btn-white' %>'>No <i class='downVote icon-thumbs-down'></i></a>" +
          "</div>" +
          "<div class='hidden rating <%=ratingType%>'>" +
          "</div>",
        rankingRow = "" +
          "<td class='ranking tdDivider'>" +
            "<input type='text' value='<%=obj.summary.avgScore%>' class='pull-left idial span1'>" +  //
            "<span class='pull-left sdial'><%=obj.summary.avgScore%> %</span>" +
          "</td>" +
          "<td class='head' style='width:25%;background: url(<%=obj.imgURL ? obj.imgURL : '/static/img/blank.png'%>)'>" +
            "<a class='' href='<%=window.location.origin%>/entity/<%=obj.id%>'>" +
              "<h4><%=obj.name%></h4>" +
            "</a>" +
            /*"<div style='max-height: 75px;' class='hashTag bottom'>" +
              "<i class='tagBullet icon-ellipsis-vertical'></i>" +
              "<ul class='tagit tagitRow' id='hashtags-<%=obj.domId%>'>" +
              "<%=obj.hashTags%>" +
              "</ul>" +
            "</div>" + */
          "</td>" +
          "<td class='body tdDivider'>" +
            "<div class='rowDescription'><%=obj.description%></div>" +
          "</td>" +
          "<td class='stat'>" +
            "<ul class='statList'>" +
              "<li><i class='icon-check'></i> <%=obj.summary.totalVote%> Votes</li>" +
              "<li><i class='icon-tags'></i> <%=obj.summary.totalAttribute%> Attributes</li>" +
              //"<li><i class='icon-file'></i> <%=obj.summary.totalAttribute%> Files</li>" +
            "</ul>"+
          "</td>",
        titleRow = "" +
          "<th style='font-size:15px;' colspan='4'>" +
            "<%=title%>" +
            "<div class='pull-right cursor-pointer'>" +
              "<div>" +
                "<a class='addNew' href='#' style='color:black;'><i title='Add New' class='icon-plus'> Add New</i></a>" +
                "<i title='Create New Ranking' class='addNewRanking icon-list'> Rank Items</i>" +
                //"<i title='Filter' class='filter icon-filter'> </i>" +
                //"<i title='Rearrange' class='rearrange icon-sort-by-attributes'> </i>" +
              "</div>" +
          "</th>",
        profileRow = "" +
        "<td class='tdDivider text-v-center noSelect' style='width: 30%;'>" +
          "<a href='#'><span class='viewRanking cursor-pointer'> <%=name%></span></a>" +
          "<i class='btn pull-right icon-share'></i>" +
        "</td>" +
        "<td class='head'>" +
          "<ul class='rankingList'>" +
          "</ul>" +
        "</td>",
        genericTable = "",
        rankingListIcon = "" +
        "<a href='<%=link%>' class='rankContainer'>" +
           "<i class='<%=icon%> icon-2x' style='margin-left: -5px; color: <%=color%>'></i>" +
           "<span class='rankingNo'> <%=rank%> </span>" +
        "</a>",
        rankBadge = "" +
        "<i class='<%=icon%> rankIcon' style='font-size:72px; height: 85px; color: <%=color%>'></i>" +
        "<span class='rankingNo moz-rankingNo' style='height:35px;font-size:32px;color:white;'><%=rank%></span>";

  return {
    attributeRowTemplate: attributeRow,
    attributeRowEditTemplate: attributeRowEdit,
    attributeSimpleTemplate: attributeSimple,

    commentTemplate: commentTemplate,
    commentRowTemplate: commentRowTemplate,

    entityTemplate: entityTemplate,
    linkTemplate: linkTemplate,

    profileRowTemplate: profileRow,
    rankingRowTemplate: rankingRow,
    rankingListIconTemplate: rankingListIcon,
    rankBadgetTemplate: rankBadge,

    saveCancelBtnTemplate: saveCancelBtn,
    sponsoredTemplate: sponsoredTemplate,
    summaryCardTemplate: summaryCardTemplate,
    summaryTemplate: summaryTemplate,

    tableTemplate: genericTable,
    titleRowTemplate: titleRow,
  };
})();
