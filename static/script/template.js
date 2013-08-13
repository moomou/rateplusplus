//'<!--Start of Build In Javascript Template-->'
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
        "<div class='comment'>" + 
          "<i class='icon-smile icon-2x btn cmtUpVote hide' style='position:absolute;margin-left: -2em;'></i>" + 
          "<i class='icon-frown icon-2x btn cmtDownVote hide' style='position:absolute;margin-left: 1em;'></i>" +
          "<p class='noSelect'><%=content%></p>" + 
          "<div class='commentInfo'>" + 
            "<span class='pull-left date'><%=lastUpdated%></span>" + 
            "<span class='pull-right vote'>" +
              "<%=upVote%><i style='margin: 0 0.5em 0 0.5em;' class='icon-group'></i> agree" + 
            "</span>" + 
          "</div>" +
        "</div>",
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
        attributeTemplate = "" + 
        "<div>" + 
          "<div data-toggle='tooltip' title='Save' class='close attrSaveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
          "<div data-toggle='tooltip' title='Close' class='close attrCloseBtn'><i class='icon-remove-sign icon-large'></i></div>" +
          "<div class='pull-left tone cursor-pointer'><i data-toggle='tooltip' title='<%=tone%>' class='icon-heart <%=TONE_ICON%>'></i></div>" + 
          "<div class='pull-right menu'>"+
            "<i class='cursor-pointer subtle icon-star' title='Highlight'></i>" + 
          "</div>" + 
          "<h3 class='attrName' contenteditable='<%=editable%>' ><%=name%></h3>" + 
          //"<h4 class='attrVoteCount'><%=upVote+downVote%> Votes</h4>" + 
        "</div>" + 
        "<div class='hide progress'>" + 
          "<div class='bar bar-success' style='width:<%=upVotePer100%>%;'><%=upVotePer100%>%</div>" + 
          "<div class='bar bar-danger' style='width:<%=downVotePer100%>%;'><%=downVotePer100%>%</div>" + 
        "</div>" + 
        "<div class='voteBtns'>" +
          "<a href='' class='btn btn-mini voteBtn upVote btn-success'>Yes <i class='upVote icon-thumbs-up'></i></a>" + 
          "<a href='' class='btn btn-mini voteBtn downVote btn-danger'>No <i class='downVote icon-thumbs-down'></i></a>" + 
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
                "<i title='<%= obj.private ? 'Private' : 'Public'%>' class='icon-<%= obj.private ? 'lock' : 'globe'%> '></i> " + 
                "<i title='<%= obj.collected ? 'Bookmarked' : 'Add to Bookmark'%>' class='icon-bookmark'></i> " + 
                "<i title='<%= obj.favorite ? 'Favorited' : 'Add to Favorite'%>' class='icon-heart'></i>" + 
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
            "<a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-<%=obj.domId%>' class='editImgBtn btn btn-small' href='#'>" +
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
                /*"<div class='catTag'>" +
                  "<i class='tagBullet icon-ellipsis-vertical'></i>" + 
                  "<ul class='tags' id='cattags-<%=obj.domId%>'>" +
                    "<%=obj.catTags%>" +
                  "</ul>" + 
                "</div>" +  
                */
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
          "<td style='width:15%;' class='tdDivider text-h-center text-v-center'>" + 
            "<div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
            "<i style='font-size: 3em;' data-toggle='tooltip' title='<%=tone%>' class='cursor-pointer tone icon-heart <%=TONE_ICON%>'></i></div>" + 
          "</td>" + 
          "<td class='head'>" + 
            "<div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='icon-remove-sign icon-large'></i></div>" +
            "<div class='dropdown' style='position:absolute;'>" +
              "<span class='typeIcon'> <i class='icon-group'></i></span> " +
              "<a style='color: black;' class='dropdown-toggle cursor-pointer' data-toggle='dropdown' data-target='#'> <i class='icon-collapse'></i></a>" +
              "<ul class='dropdown-menu' role='menu' aria-labelledby='dLabel'>" +
                "<li><a data='group' href='#'><i data='group' class='icon-group'></i> Vote</a></li>" +
                "<li><a data='cloud-download' href='#'><i data='cloud-download' class='icon-cloud-download'></i> Auto</a></li>" +
              "</ul>"+
            "</div>" +
            "<h3 class='attrName' contenteditable='true' ><%=obj.name%></h3>" + 
            "<div class='input-prepend'>" +
              "<span class='add-on'><i class='icon-link'> Source</i></span>" + 
              "<input style='width: 75%;' class='srcURL' type='text' placeholder='http://'>" +
            "</div>" +
          "</td>",
        attributeRow = "" + 
          "<td style='width:15%;' class='tdDivider text-h-center text-v-center'>" + 
            "<i style='font-size: 3em;' data-toggle='tooltip' title='<%=tone%>' class='icon-heart <%=TONE_ICON%>'></i></div>" + 
          "</td>" + 
          "<td class='head'>" + 
            "<h3><%=obj.name%></h3>" + 
            "<span style='position: absolute; top: 5px; right: 5px;'>" +
              "<i class='icon-link'><a href='<%=obj.srcURL%>'> Source</a></i></span>" + 
            "<span style='position: absolute; top: 5px; left: 10px;'>" +
              "<% if (obj.type == 'auto') { %>" +
                "<i class='icon-cloud-download'></i></span>" + 
              "<% } else { %>" +
                "<i class='icon-group'></i></span>" + 
                "<div class='voteBtns'>" +
                  "<a href='' class='btn voteBtn upVote btn-success'>Yes <i class='upVote icon-thumbs-up'></i></a>" +
                  "<a href='' class='btn voteBtn downVote btn-danger'>No <i class='downVote icon-thumbs-down'></i></a>" +
                "</div>" +
              "<% } %>" +
            "<canvas height='55' width='412' style='position: absolute; top: 59%; left: 2px; width: 100%; height: 45%;' class='vizGraph hidden'></canvas>" +
           "</td>",
        rankingRow = "" +
          "<td class='ranking tdDivider'>" + 
            "<input type='text' value='<%=obj.summary.avgScore%>' class='pull-left idial span1'>" +  //
            "<span class='pull-left sdial'><%=obj.summary.avgScore%> %</span>" + 
          "</td>" + 
          "<td class='head' style='width:25%;background: url(<%=obj.imgURL ? obj.imgURL : '/static/img/blank.png'%>)'>" + 
            "<h4><%=obj.name%></h4>" + 
            "<a class='brick' href='entity/<%=obj.id%>'></a>" +
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
              "<li><i class='icon-file'></i> <%=obj.summary.totalAttribute%> Files</li>" + 
            "</ul>"+
          "</td>",
        titleRow = "" + 
          "<th style='font-size:20px;' colspan='4'>" + 
            "<%=title%>" + 
            "<div class='pull-right cursor-pointer'>" +
              "<div>" +
                "<i title='Add New' class='addNew icon-plus-sign-alt'> </i>" +
                "<i title='Show Stats' class='icon-bar-chart'> </i>" +
              "</div>" +
          "</th>",
        genericTable = "";

  return {
    attributeTemplate: attributeTemplate,
    commentTemplate: commentTemplate,
    linkTemplate: linkTemplate,
    entityTemplate: entityTemplate,
    summaryCardTemplate: summaryCardTemplate,
    summaryTemplate: summaryTemplate,
    sponsoredTemplate: sponsoredTemplate,
    tableTemplate: genericTable,
    attributeRowTemplate: attributeRow,
    attributeRowEditTemplate: attributeRowEdit,
    rankingRowTemplate: rankingRow,
    titleRowTemplate: titleRow,
    saveCancelBtnTemplate: saveCancelBtn
  };
}) ();
