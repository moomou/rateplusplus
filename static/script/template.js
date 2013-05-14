//'<!--Start of Build In Javascript Template-->'
var Template = (function() {
    var summaryTemplate = "" + 
        "<h3 class='pull-left' style='margin-top:0;font-size:15px;'>Rating <%=obj.summary.avgScore%>% </h3>" + 
        "<ul class='pull-right'>" + 
          "<li><%=obj.summary.totalVote%> Votes</li>" + 
          "<li><%=obj.summary.totalAttribute%> Attributes</li>" + 
        "</ul>",
        commentTemplate = "" + 
        "<p><%=content%></p>",
        attributeTemplate = "" + 
        "<div>" + 
          "<div data-toggle='tooltip' title='Save' class='close attrSaveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
          "<div data-toggle='tooltip' title='Close' class='close attrCloseBtn'><i class='icon-remove-sign icon-large'></i></div>" +
          "<div class='pull-left tone cursor-pointer'><i data-toggle='tooltip' title='<%=TONE%>' class='icon-heart <%=TONE_ICON%>'></i></div>" + 
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
        "<div class='description'><%=description%></div>" +
        "<div id='editBoxMenu-<%=domId%>'></div>" + 
          "<textarea class='editBox' id='editBox-<%=domId%>' style='display:none;'></textarea>" + 
        "</div>", 
        summaryCardTemplate = "" +
          "<div class='card-header'>" + 
              "<legend contenteditable='<%=obj.editable%>' class='card-title'><%=obj.name%></legend>" + 
            "<div class='card-header-btn card-header-left'>" + 
              "<div class='card-status'>" + 
                "<i title='<%= obj.private ? 'Private' : 'Public'%>' class='icon-large icon-<%= obj.private ? 'lock' : 'globe'%> '></i>" + 
              "</div>" + 
            "</div>" + 
            "<div class='card-header-btn card-header-right'>" +
              "<div class='btn-group'>" + 
                "<a class='plain-btn btn btn-small share'><i class='icon-share'></i></a>" + 
                "<button data-toggle='dropdown' class='plain-btn btn btn-small dropdown-toggle'>" +
                  "<span class='caret'></span>" + 
                "</button>" + 
                "<ul class='dropdown-menu'>" +
                  "<li><a class='edit'><i class='icon-edit'></i> Edit</a></li>" + 
                  "<li><a class='report' title='Report as Inappropriate'><i class='icon-minus-sign'></i> Report</a></li>" + 
                "</ul>" + 
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
              "<img class='profileimg' id='img-<%=obj.domId%>' src='<%=obj.imageURL ? obj.imageURL : '/static/img/blank.png'%>'></img>" + 
            "<% if (obj.id) { %>" + 
              "</a>" + 
            "<% } %>" + 
          "</div>" + 
          "<div class='contentContainer outer'>" + 
            "<div class='inner summary'>" + 
              summaryTemplate + 
            "</div>" + 
            "<div class='entityDetail'>" + 
              "<div class='profileContent outer'>" + 
              "</div>" +
              "<div class='tagsContent outer'>" +
                "<div class='hashTag'>" +
                 "<i class='tagBullet icon-ellipsis-vertical'></i>" + 
                 "<ul class='tags' id='hashtags-<%=obj.domId%>'>" +
                  "<%=obj.hashTags%>" +
                  "</ul>" + 
                "</div>" +  
                "<div class='catTag'>" +
                  "<i class='tagBullet icon-ellipsis-vertical'></i>" + 
                  "<ul class='tags' id='cattags-<%=obj.domId%>'>" +
                    "<%=obj.catTags%>" +
                  "</ul>" + 
                "</div>" +  
              "</div>" + 
            "</div>" +
            "<div class='break break-mini'></div>" +
            "<div class='attrContainer' >" + 
              "<form class='form-search' style='margin:0; width: 90%;'>" + 
                "<input type='text' class='attrSearchInput search-query'>" + 
                "<i class='searchState icon-search' style='margin-left:-2em;'></i>" + 
                "<button style='float:right;' title='Create New Attribute' class='addAttrBtn btn btn-small'><i class='icon-plus'></i> New</button>" + 
              "</form>" + 
              "<div class='outer' style='min-height:20px;margin-top:0.25em;'><i class='hide scroll up cursor-pointer icon-chevron-up'></i></div>" + 
              "<div class='attrContent'></div>" +
              "<div class='outer' style='min-height:20px;'><i class='scroll down cursor-pointer icon-chevron-down'></i></div>" + 
            "</div>" + 
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
          "</div>";

  return {
    commentTemplate: commentTemplate,
    attributeTemplate: attributeTemplate,
    entityTemplate: entityTemplate,
    summaryCardTemplate: summaryCardTemplate,
    summaryTemplate: summaryTemplate,
    sponsoredTemplate: sponsoredTemplate
  };
}) ();
