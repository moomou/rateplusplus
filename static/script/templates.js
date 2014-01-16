
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>\n  <i style='font-size: 3em; color:";
  if (stack1 = helpers.color) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.color); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ";' data-toggle='tooltip' title='";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='fa fa-heart'>\n    <span class='noSelect toneText'> ";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "<span>\n  </i>\n</td>\n<td class='head'>\n  <h3>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n  <span style='position: absolute; top: 5px; left: 10px;'></span>\n  <div class='voteBtns'>\n    <a href='#' class='btn voteBtn upVote ";
  if (stack1 = helpers.upVoteBtnType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.upVoteBtnType); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>Yes <i class='upVote fa fa-thumbs-up'></i></a>\n    <a href='#' class='btn voteBtn downVote ";
  if (stack1 = helpers.downVoteBtnType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.downVoteBtnType); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>No <i class='downVote fa fa-thumbs-down'></i></a>\n  </div>\n  <div class='hidden rating ";
  if (stack1 = helpers.ratingType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.ratingType); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  </div>\n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow_edit'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>\n  <div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='fa fa-check-circle fa-lg'></i></div>\n  <i style='font-size: 3em; color: red;' data-toggle='tooltip' title='";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='cursor-pointer tone fa fa-heart'>\n    <span class='noSelect toneText'> ";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "<span>\n  </i>\n</td>\n<td class='head'>\n  <div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='fa fa-times-circle fa-lg'></i></div>\n  <h3 class='attrName' contenteditable='true' >";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow_simple'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>\n  <i title='";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='fa fa-heart ";
  if (stack1 = helpers.TONE_ICON) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.TONE_ICON); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  </i>\n</h3>\n<div class='voteBtns'>\n  <a href='#' class='btn voteBtn upVote ";
  if (stack2 = helpers.upVoteBtnClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.upVoteBtnClass); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>Yes <i class='upVote fa fa-thumbs-up'> </i></a>\n  <a href='#' class='btn voteBtn downVote ";
  if (stack2 = helpers.downVoteBtnClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.downVoteBtnClass); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>No <i class='downVote fa fa-thumbs-down'> </i></a>\n</div>\n<div class='hidden rating ";
  if (stack2 = helpers.ratingType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.ratingType); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['contentSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<input type='text' value='";
  if (stack1 = helpers.avgScore) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.avgScore); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='pull-left idial span1'>\n<span class='pull-left sdial'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " %</span>\n<ul class='pull-right'>\n  <li> <i class='fa fa-tasks'></i> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalVote)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Votes</li>\n  <li> <i class='fa fa-cloud'></i> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalAttribute)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Attributes</li>\n</ul>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['data_img'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += " <div class=\"data-point\" data-id=\"";
  if (stack1 = helpers.dataId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.dataId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n   <div class=\"ribbon\">  \n      <a href='#'><i class='fa fa-star'></i></a>\n   </div>\n   <span>";
  if (stack1 = helpers.caption) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.caption); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n   <img class=\"img-polaroid\" src=\"";
  if (stack1 = helpers.srcUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.srcUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n </div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['data_num'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"data-point\" data-id=\"";
  if (stack1 = helpers.dataId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.dataId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"ribbon\">\n    <a href='#'><i class='fa fa-star'></i></a>\n  </div>\n  <div class=\"info\">\n    <span class=\"fieldName\"> ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <span class=\"value\"> ";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.value); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </div>\n  <hr>\n  <div class=\"source\">\n    <a href=\"";
  if (stack1 = helpers.srcUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.srcUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"fa fa-info-circle\"></i></a>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['entityDescription'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p class='description'>";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.description); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</p> \n<div id='textareaContainer-";
  if (stack1 = helpers.domId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.domId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='hide'> \n  <textarea class='editBox' placeholder='Add Description' data-widearea='enable'></textarea> \n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['profileRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td class='tdDivider text-v-center noSelect' style='width: 30%;'> \n  <a href='#'><span class='viewRanking cursor-pointer'> ";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span></a> \n  <i class='btn pull-right fa fa-share'></i> \n</td> \n<td class='head'> \n  <ul class='rankingList'> \n  </ul> \n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankBadge'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<i class='";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.icon); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " rankIcon' style='font-size:72px; height: 85px; color: ";
  if (stack1 = helpers.color) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.color); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></i> \n<span class='rankingNo moz-rankingNo' style='height:35px;font-size:32px;color:white;'>";
  if (stack1 = helpers.rank) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.rank); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankingListIcon'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href='";
  if (stack1 = helpers.link) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.link); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='rankContainer'>\n  <i class='fa ";
  if (stack1 = helpers.icon) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.icon); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " fa-2x' style='margin-left: -5px; color: ";
  if (stack1 = helpers.color) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.color); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></i>\n  <span class='rankingNo'> ";
  if (stack1 = helpers.rank) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.rank); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span>\n</a>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankingRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.imgURL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.imgURL); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<td class='ranking tdDivider'>\n  <input type='text' value='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' class='pull-left idial span1'>\n  <span class='pull-left sdial'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " %</span>\n</td>\n<td class='head' style=\"width:25%; background: url(";
  stack2 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ")\">\n  <h4>\n    <a class='btn-like' style='color: white !important;' href='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.window)),stack1 == null || stack1 === false ? stack1 : stack1.location)),stack1 == null || stack1 === false ? stack1 : stack1.origin)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/entity/";
  if (stack2 = helpers.id) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.id); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n      ";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.name); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "\n    </a>\n  </h4>\n</td>\n<td class='body tdDivider'>\n  <div class='rowDescription'>";
  if (stack2 = helpers.description) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.description); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "</div>\n</td>\n<td class='stat'>\n  <ul class='statList'>\n    <li><i class='fa fa-tasks'></i> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalVote)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Votes</li>\n    <li><i class='fa fa-cloud'></i> "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalAttribute)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Attributes</li>\n  </ul>\n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['ranking_li'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li><span class='attrName'> ";
  if (stack1 = helpers.rank) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.rank); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span> in ";
  if (stack1 = helpers.rankingTag) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.rankingTag); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rating_li'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\n  <span class='attrName'> ";
  if (stack1 = helpers.attributeName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.attributeName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " </span>\n  <ul class='rating'> ";
  if (stack1 = helpers.star_li) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.star_li); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " </ul>\n</li>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info-card\">\n  <div class=\"header\">\n    <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (stack1 = helpers.profileIconUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.profileIconUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "');\"></div>\n    <ul class=\"meta pull-left\">\n      <li class=\"name\"> ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n      <li class=\"hash\"> ";
  if (stack1 = helpers.hashTag) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.hashTag); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</li>\n    </ul>\n    <ul class=\"action\">\n      <li><i class=\"fa fa-arrows-alt fa-lg js-full-screen\"></i></li>\n      <li><i class=\"fa fa-minus fa-lg js-hide-screen\"></i></li>\n    </ul>\n  </div>\n  <hr>\n <div class=\"content editing editzone js-editzone\">\n    <div class=\"instruction\">\n      <div class=\"inner\">\n        <i class=\"fa fa-arrow-circle-o-down fa-2x\"></i>\n        <br>\n        <span class=\"\">Drag Content Here</span>\n      </div>\n    </div>\n  </div>\n  <div class=\"footer\">\n    <div class=\"edit-tool pull-left\">\n      <button class=\"btn btn-small btn-success\">Save</button>\n    </div>\n    <div class=\"by pull-right\">By <a href=\"";
  if (stack1 = helpers.authorProfileUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.authorProfileUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" class=\"\">";
  if (stack1 = helpers.authorName) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.authorName); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_content'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"content\" id=\"";
  if (stack1 = helpers.contentId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.contentId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n  ";
  if (stack1 = helpers.content) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.content); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <hr>\n  <ul class=\"meta\">\n    <li class=\"src\">\n    <a href=\"";
  if (stack1 = helpers.src) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.src); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"fa fa-info-circle\"> Source</i></a>\n    </li>\n  </ul>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_field'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info\">\n  <span class=\"pull-left fieldName\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <span class=\"pull-right value\">";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.value); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_image'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<img src=\"";
  if (stack1 = helpers.srcUrl) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.srcUrl); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_rating'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"rating goldStar pull-right\">\n  ";
  if (stack1 = helpers.stars) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.stars); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<span class=\"fieldName\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</span>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['saveCancelBtn'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n  <button id='";
  if (stack1 = helpers.saveId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.saveId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' type='button' class='btn btn-success' style='position: relative; width: 100%;'>\n    <i class='fa fa-arrow-circle-o-right'></i> Save &amp; Next\n  </button>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['summaryCard'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <a class=\"btn-lie\" href='/entity/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.id); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n    <img class='profileimg' id='img-";
  if (stack1 = helpers.domId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.domId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' src='";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'/>\n  </a>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.imgURL) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.imgURL); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<div class='card-header'>\n  <legend contenteditable='";
  if (stack1 = helpers.editable) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.editable); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='card-title'>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.name); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</legend>\n  <div class='card-header-btn card-header-left'>\n    <div class='card-status'>\n    </div>\n  </div>\n  <div class='card-header-btn card-header-right'>\n    <div class='xbtn-group'>\n      <button class='btn btn-mini headBtn btn-warning linkBtn hide'><i class='fa fa-paper-clip fa-lg'></i></button>\n      <button class='btn btn-mini headBtn btn-success editBtn '><i class='fa fa-edit fa-lg'></i></button>\n    </div>\n  </div>\n  <div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='fa fa-times-circle fa-lg'></i></div>\n  <div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='fa fa-check-circle fa-lg'></i></div>\n</div>\n<div class='photo'>\n  <a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-";
  if (stack1 = helpers.domId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.domId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='editImgBtn btn btn-small btn-success' href='#'>\n    Change Image\n  </a>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='contentContainer outer'>\n  <div class='summary'>\n    ";
  if (stack1 = helpers.summaryTemplate) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.summaryTemplate); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  <div class='entityDetail'>\n    <div class='profileContent outer'>\n    </div>\n    <div class='tagsContent outer'>\n      <div class='hashTag cardView'>\n        <i class='tagBullet cardView fa fa fa-ellipsis-v'></i>\n        <ul class='tags' id='hashtags-";
  if (stack1 = helpers.domId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.domId); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n          ";
  if (stack1 = helpers.hashTags) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.hashTags); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n      </div>\n    </div>\n  </div>\n  <div class='break break-mini'></div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['titleRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<th style='font-size:15px;' colspan='4'> \n  ";
  if (stack1 = helpers.title) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.title); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + " \n  <div class='pull-right cursor-pointer'> \n    <div> \n      <a class='addNew' href='#' style='color:black;'><i title='Add New' class='fa fa-plus'> Add New</i></a> \n      <i title='Create New Ranking' class='addNewRanking fa fa-list'> Rank Items</i> \n    </div> \n  </th>\n";
  return buffer;
  });
})();
