//'<!--Start of Build In Javascript Template-->'
var Template = (function() {
  var summaryTemplate = "" + 
        "<h3 class='pull-left' style='margin-top:0;'>Rating <%=summary.avgScore%>% </h3>" + 
        "<ul class='pull-right'>" + 
          "<li><%=summary.totalVote%> Votes</li>" + 
          "<li><%=summary.totalAttribute%> Attributes</li>" + 
        "</ul>",
      attributeTemplate = "" + 
        "<div class='page-curl'>" + 
          "<div <% if (!editable) {%> style='display:none;margin:-0.5em -0.3em 0 0;'<% }%> class='close'>&times;</div>" + 
          "<div>" + 
            "<h3 class='attrName' contenteditable='<%=editable%>' ><%=name%></h3>" + 
            "<h4 class='attrVoteCount'><%=upVote+downVote%> Votes</h4>" + 
          "</div>" + 
          "<div class='progress'>" + 
            "<div class='bar bar-success' style='width:<%=upVotePer100%>%;'><%=upVotePer100%>%</div>" + 
            "<div class='bar bar-danger' style='width:<%=downVotePer100%>%;'><%=downVotePer100%>%</div>" + 
          "</div>" + 
          "<a href='' class='btn voteBtn upVote'><i class='upVote icon-thumbs-up'></i></a>" + 
          "<a href='' class='btn voteBtn downVote'><i class='downVote icon-thumbs-down'></i></a>" + 
        "</div>",
      entityTemplate = "" +
        "<div class='description'><%=description%></div>" +
        "<textarea class='editBox' id='editBox-<%=domId%>' style='display:none;'></textarea>" + 
        "<hr>" + 
        "<button class='pull-right editProfileBtn btn btn-primary btn-small'>Edit</button>",
      cardTemplate = "" +
        "<div class='card' style='max-width: 20em;'>" + 
          "<div id='' class='card-header'>" + 
            "<legend contenteditable='true' class='card-title'><%=cardTitle%></legend>" + 
          "</div>" + 
          "<div class='contentContainer outer'>" + 
            "<div class='inner'>" + 
              "<%=cardContent%>" + 
            "</div>" + 
          "</div>" + 
        "</div>",
      summaryCardTemplate = "" +
        "<div class='card' style='max-width: 20em;'>" + 
          "<div id='' class='card-header'>" + 
            "<legend contenteditable='<%=editable%>' class='card-title'><%=name%></legend>" + 
          "</div>" + 
          "<div class='contentContainer outer'>" + 
            "<div class='inner'>" + 
              "<div class='summary'>" + 
                summaryTemplate + 
              "</div>" + 
              "<div class='post photo'>" +
                "<div class='btn-group'>" +
                    "<a style='' id='imgBtn-<%=domId%>' class='imgBtn btn btn-small dropdown-toggle' data-toggle='dropdown' href='#'>" +
                        "Change Image" +
                        "<span class='caret'></span>" + 
                    "</a>" +
                    "<ul class='dropdown-menu' role='menu' aria-labelledby='dropdownMenu'>" + 
                        "<li><a tabindex='-1' href='#'>Regular link</a></li>" + 
                        "<li class='disabled'><a tabindex='-1' href='#'>Disabled link</a></li>" +
                    "</ul>" +
                "</div>" + 
                //"<span class='folded-corner'><a class='editImgBtn' style='display:none;' id='imgChangeBtn-<%=domId%>' href='#change'><i class='icon-picture icon-large'></i></a></span>" + 
                "<%if (imageURL) {%>" +
                    "<img id='img-<%=domId%>' src='<%=imageURL%>'></img>" + 
                "<% } else {%>" +
                    "<i class='icon-picture icon-4x imgPlaceholder'></i>" +
                "<% } %>" + 
              "</div>" + 
              "<ul style='border:none;margin:0.5em;' class='tags' id='tags-<%=domId%>'>" +
                "<%=tags%>" +
              "</ul>" + 
            "</div>" + 
            "<div style='margin-top:1em;'>" + 
              "<ul id='myTab' class='nav nav-tabs inner'>" + 
                "<li class=''><a href='#profile-<%=domId%>' data-toggle='tab'>Profile</a></li>" + 
                "<li class=''><a href='#attributes-<%=domId%>' data-toggle='tab'>Attributes</a></li>" + 
              "</ul>" + 
              "<div id='myTabContent' class='tab-content'>" + 
                "<div class='tab-pane tabpane' id='profile-<%=domId%>'>" + 
                  "<div class='profileContent outer'>" + 
                  "</div>" +
                "</div>" + 
                "<div class='tab-pane tabpane'  id='attributes-<%=domId%>'>" + 
                  "<form class='form-search' style='text-align:left;'>" + 
                    "<input type='text' class='input-medium search-query'>" + 
                    "<i class='searchState icon-search' style='margin-left:-2em;'></i>" + 
                    "<button style='float:right;' class='addAttrBtn btn btn-small'><i class='icon-plus'></i> New</button>" + 
                  "</form>" + 
                    "<div class='attrContent'></div>" +
                    //"<%=attributesContent%>" + 
                "</div>" + 
              "</div>" + 
            "</div>" + 
          "</div>" + 
        "</div>";
      
  return {
    attributeTemplate: attributeTemplate,
    entityTemplate: entityTemplate,
    cardTemplate: cardTemplate,
    summaryCardTemplate: summaryCardTemplate,
    summaryTemplate: summaryTemplate
  };
}) ();
