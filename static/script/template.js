//'<!--Start of Build In Javascript Template-->'
var Template = (function() {
    var summaryTemplate = "" + 
        "<h3 class='pull-left' style='margin-top:0;'>Rating <%=summary.avgScore%>% </h3>" + 
        "<ul class='pull-right'>" + 
          "<li><%=summary.totalVote%> Votes</li>" + 
          "<li><%=summary.totalAttribute%> Attributes</li>" + 
        "</ul>",
        attributeTemplate = "" + 
        "<div>" + 
          "<div data-toggle='tooltip' title='Save' class='close attrSaveBtn'><i class='icon-ok-sign icon-large'></i></div>" +
          "<div data-toggle='tooltip' title='Close' class='close attrCloseBtn'><i class='icon-remove-sign icon-large'></i></div>" +
          "<div class='pull-left tone'><i data-toggle='tooltip' title='<%=TONE%>' class='icon-heart <%=TONE_ICON%>'></i></div>" + 
          "<div class='pull-right menu'>"+
            "<i class='cursor-pointer subtle icon-minus-sign' data-toggle='tooltip' title='Report as Inappropriate'></i>" + 
          "</div>" + 
          "<h3 class='attrName' contenteditable='<%=editable%>' ><%=name%></h3>" + 
          //"<h4 class='attrVoteCount'><%=upVote+downVote%> Votes</h4>" + 
        "</div>" + 
        "<div class='hide progress'>" + 
          "<div class='bar bar-success' style='width:<%=upVotePer100%>%;'><%=upVotePer100%>%</div>" + 
          "<div class='bar bar-danger' style='width:<%=downVotePer100%>%;'><%=downVotePer100%>%</div>" + 
        "</div>" + 
        "<div class='voteBtns'>" +
          "<a href='' class='btn voteBtn upVote btn-success'>Yes <i class='upVote icon-thumbs-up'></i></a>" + 
          "<a href='' class='btn voteBtn downVote btn-danger'>No <i class='downVote icon-thumbs-down'></i></a>" + 
        "</div>",
        entityTemplate = "" +
        "<div class='description'><%=description%></div>" +
        "<div id='editBoxMenu-<%=domId%>'></div>" + 
        "<textarea class='editBox' id='editBox-<%=domId%>' style='display:none;'></textarea>" + 
        "<hr>" + 
        "<div class='profileMenu'>" + 
          "<button <%=editable ? '' : 'disabled'%> class='pull-right editBtn editProfileBtn btn btn-primary btn-small'>Edit</button>" +
          "<button style='display:none' class='pull-right cancelBtn editProfileBtn btn btn-small'>Cancel</button>" +
        "</div>", 
        summaryCardTemplate = "" +
        "<div class='card'>" + 
          "<div class='card-header'>" + 
            "<legend contenteditable='<%=editable%>' class='card-title'><%=name%></legend>" + 
            "<div class='card-header-btn card-header-left'>" + 
              "<div class='card-status'>" + 
                "<i title='Privacy' class='icon-large icon-<%= private ? 'lock' : 'globe'%> '></i>" + 
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
          "<div class='contentContainer outer'>" + 
            "<div class='inner' style=''>" + 
              "<div class='summary'>" + 
                summaryTemplate + 
              "</div>" + 
              "<div class='photo post img-polaroid'>" +
                "<a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-<%=domId%>' class='editImgBtn btn btn-small' href='#'>" +
                    "Change Image" +
                "</a>" +
                "<img class='profileimg' id='img-<%=domId%>' src='<%=imageURL ? imageURL : 'static/img/blank.png'%>'></img>" + 
              "</div>" + 
              "<div class='hashTag'>" +
                "<ul class='tags' id='hashtags-<%=domId%>'>" +
                  "<%=tagDOM%>" +
                "</ul>" + 
              "</div>" +  
              "<div class='break break-mini'></div>" + 
              "<div class='catTag'>" +
                "<ul class='tags' id='cattags-<%=domId%>'>" +
                  "<%=tagDOM%>" +
                "</ul>" + 
              "</div>" +  
            "</div>" + 
            "<div class='break break-mini'></div>" + 
            "<div class='entityDetail' style='clear:both;margin-top:1em;'>" + 
              "<ul class='nav nav-tabs'>" + 
                "<li style='width:50%;' class='active'><a href='#attributes-<%=domId%>' data-toggle='tab'>Attributes</a></li>" + 
                "<li style='width:50%;' class=''><a href='#profile-<%=domId%>' data-toggle='tab'>Profile</a></li>" + 
              "</ul>" + 
              "<div class='tab-content'>" + 
                "<div class='tab-pane fade tabpane' id='profile-<%=domId%>'>" + 
                  "<div class='profileContent outer'>" + 
                  "</div>" +
                "</div>" + 
                "<div class='tab-pane fade tabpane active'  id='attributes-<%=domId%>'>" + 
                  "<form class='form-search' style='text-align:left;'>" + 
                    "<input type='text' class='input-medium search-query'>" + 
                    "<i class='searchState icon-search' style='margin-left:-2em;'></i>" + 
                    "<button style='float:right;' title='Create New Attribute' class='addAttrBtn btn btn-small'><i class='icon-plus'></i> New</button>" + 
                  "</form>" + 
                    "<div class='outer'><i class='scroll up cursor-pointer icon-chevron-up'></i></div>" + 
                    "<div class='attrContent'></div>" +
                    "<div class='outer'><i class='scroll down cursor-pointer icon-chevron-down'></i></div>" + 
                "</div>" + 
              "</div>" + 
            "</div>" + 
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
    attributeTemplate: attributeTemplate,
    entityTemplate: entityTemplate,
    summaryCardTemplate: summaryCardTemplate,
    summaryTemplate: summaryTemplate,
    sponsoredTemplate: sponsoredTemplate
  };
}) ();
