
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow_edit'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>\n  <div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='fa fa-check-circle fa-lg'></i></div>\n  <i style='font-size: 3em; color: red;' data-toggle='tooltip' title='";
  if (helper = helpers.tone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='cursor-pointer tone fa fa-heart'>\n    <span class='noSelect toneText'> ";
  if (helper = helpers.tone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<span>\n  </i>\n</td>\n<td class='head'>\n  <div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='fa fa-times-circle fa-lg'></i></div>\n  <h3 class='attrName' contenteditable='true' >";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>\n  <i style='font-size: 3em; color:";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + ";' data-toggle='tooltip' title='";
  if (helper = helpers.tone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='fa fa-heart'>\n    <span class='noSelect toneText'> ";
  if (helper = helpers.tone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "<span>\n  </i>\n</td>\n<td class='head'>\n  <h3>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>\n  <span style='position: absolute; top: 5px; left: 10px;'></span>\n  <div class='voteBtns'>\n    <a href='#' class='btn voteBtn upVote ";
  if (helper = helpers.upVoteBtnType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.upVoteBtnType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>Yes <i class='upVote fa fa-thumbs-up'></i></a>\n    <a href='#' class='btn voteBtn downVote ";
  if (helper = helpers.downVoteBtnType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.downVoteBtnType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>No <i class='downVote fa fa-thumbs-down'></i></a>\n  </div>\n  <div class='hidden rating ";
  if (helper = helpers.ratingType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ratingType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n  </div>\n</td>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow_simple'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h3>\n  <i title='";
  if (helper = helpers.tone) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tone); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='fa fa-heart ";
  if (helper = helpers.TONE_ICON) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.TONE_ICON); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  </i>\n</h3>\n<div class='voteBtns'>\n  <a href='#' class='btn voteBtn upVote ";
  if (helper = helpers.upVoteBtnClass) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.upVoteBtnClass); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>Yes <i class='upVote fa fa-thumbs-up'> </i></a>\n  <a href='#' class='btn voteBtn downVote ";
  if (helper = helpers.downVoteBtnClass) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.downVoteBtnClass); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>No <i class='downVote fa fa-thumbs-down'> </i></a>\n</div>\n<div class='hidden rating ";
  if (helper = helpers.ratingType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.ratingType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['breadcrumb_li'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li><a href=\"#";
  if (helper = helpers.urlId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.urlId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a> <span class=\"divider\">|</span></li>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['contentSummary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<input type='text' value='";
  if (helper = helpers.avgScore) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.avgScore); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += " <div class=\"data-point\" data-id=\"";
  if (helper = helpers.dataId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dataId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n   <div class=\"ribbon\">  \n      <a href='#'><i class='fa fa-star'></i></a>\n   </div>\n   <span>";
  if (helper = helpers.caption) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.caption); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n   <img class=\"img-polaroid\" src=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"data-point\" data-id=\"";
  if (helper = helpers.dataId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.dataId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"ribbon\">\n    <a href='#'><i class='fa fa-star'></i></a>\n  </div>\n  <div class=\"info\">\n    <span class=\"fieldName\"> ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    <span class=\"value\"> ";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  </div>\n  <hr>\n  <div class=\"source\">\n    <a href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"fa fa-info-circle\"></i></a>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['detail_ranking'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\" style=\"margin: 10px 10px 5px 0; width: 100%;\">\n  <div class=\"pull-right\" style=\"font-size: 25px; line-height: 50px;\">\n    ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    &nbsp;\n    <a href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"fa fa-info-circle\"></i></a>\n  </div>\n  <div class=\"pull-left\" style=\" position: relative;\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"width: 60px; height: 60px;\">\n    <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></circle>\n    <text x=\"50%\" dy=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" fill=\"white\" style=\"font-size: 25px;\">No. ";
  if (helper = helpers.rank) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rank); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</text>\n    </svg>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['entityDescription'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<p class='description'>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p> \n<div id='textareaContainer-";
  if (helper = helpers.domId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.domId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td class='tdDivider text-v-center noSelect' style='width: 30%;'> \n  <a href='#'><span class='viewRanking cursor-pointer'> ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"width:65px; height:65px;\">\n  <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></circle>\n  <text font-size=\"36px\" x=\"50%\" dy=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" fill=\"white\">";
  if (helper = helpers.rank) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rank); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</text>\n</svg>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankingListIcon'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<a href='";
  if (helper = helpers.link) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.link); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='rankContainer'>\n  <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"width:25px; height:25px;\">\n    <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></circle>\n    <text font-size=\"15px\" x=\"50%\" dy=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" fill=\"white\">";
  if (helper = helpers.rank) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rank); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</text>\n  </svg>\n</a>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankingRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " ";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<td style=\"width: 15%; text-align: center !important;\" class='tdDivider js-ranking'>\n  <input type='text' value='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' class='pull-left idial span1'>\n  <span class='pull-left sdial'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " %</span>\n</td>\n<td class='head' style=\"width:25%; background: url(";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += ")\">\n  <h4>\n    <a class='btn-like' style='color: white !important;' href='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.window)),stack1 == null || stack1 === false ? stack1 : stack1.location)),stack1 == null || stack1 === false ? stack1 : stack1.origin)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/entity/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n      ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n    </a>\n  </h4>\n</td>\n<td class='body tdDivider'>\n  <div class='rowDescription'>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
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
templates['rating_li'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<li>\n  <span class='attrName'> ";
  if (helper = helpers.attributeName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.attributeName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " </span>\n  <ul class='rating'> ";
  if (helper = helpers.star_li) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.star_li); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " </ul>\n</li>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_content'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"content\" id=\"";
  if (helper = helpers.contentId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contentId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <span style=\"margin-left: -15px;\" class=\"close pull-left\">&times;</span>\n  ";
  if (helper = helpers.content) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.content); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <hr>\n  <ul class=\"meta\">\n    <li class=\"src\">\n    <a href=\"";
  if (helper = helpers.src) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.src); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"><i class=\"fa fa-info-circle\"> Source</i></a>\n    </li>\n  </ul>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <input class=\"title-input js-title\" placeholder=\"Title\" type=\"text\">\n          ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            ";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n          ";
  return buffer;
  }

function program5(depth0,data) {
  
  
  return "\n          <input class=\"tag-input js-tag\" placeholder=\"#hashTag\" type=\"text\">\n          ";
  }

function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n            ";
  if (helper = helpers.hashTag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hashTag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n          ";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return "\n        <li><i class=\"fa fa-minus fa-lg cursor-pointer js-hide-screen\"></i></li>\n        <li><i class=\"fa fa-globe fa-lg cursor-pointer js-full-screen\"></i></li>\n        ";
  }

function program11(depth0,data) {
  
  
  return "\n        <li><i class=\"fa fa-code-fork fa-lg js-fork\"></i></li>\n        <li><i class=\"fa fa-envelope-o fa-lg js-send\"></i></li>\n        ";
  }

  buffer += "<ul class=\"view-toolbar hide\">\n  <li>\n    <i class=\"fa fa-heart-o fa-lg\"></i>\n    <i class=\"fa fa-twitter fa-lg\"></i>\n    <i class=\"fa fa-code-fork fa-lg\"></i>\n    <i class=\"fa fa-share-square-o fa-lg\"></i>\n  </li>\n</ul>\n<div class=\"js-scroll-container\">\n  <div class=\"info-card\">\n    <div class=\"header\">\n      <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (helper = helpers.profileIconUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.profileIconUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "');\"></div>\n      <ul class=\"meta pull-left\">\n        <li class=\"name\">\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </li>\n        <li class=\"hash\">\n          ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </li>\n      </ul>\n      <ul class=\"action\">\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </ul>\n    </div>\n    <hr>\n   <div class=\"content editing editzone js-editzone\">\n      <div class=\"instruction\">\n        <div class=\"inner\">\n          <i class=\"fa fa-arrow-circle-o-down fa-2x\"></i>\n          <br>\n          <span class=\"\">Drop Content Here</span>\n        </div>\n      </div>\n    </div>\n    <div class=\"footer\">\n      <div class=\"edit-tool pull-left\">\n        <button class=\"btn btn-small btn-success js-save-btn\">Save</button>\n      </div>\n      <div class=\"by pull-right hide\">By <a href=\"";
  if (helper = helpers.authorProfileUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.authorProfileUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\" class=\"\">";
  if (helper = helpers.authorName) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.authorName); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</a>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_field'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info\">\n  <span class=\"pull-left fieldName\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <span class=\"pull-right value\">";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<img src=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_ranking'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"container\" style=\"margin: 10px 10px 5px 0; width: 100%;\">\n  <div class=\"pull-right\" style=\"font-size: 25px; line-height: 50px;\">\n    ";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n  </div>\n  <div class=\"pull-left\" style=\" position: relative;\">\n    <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"width: 60px; height: 60px;\">\n    <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"";
  if (helper = helpers.color) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.color); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\"></circle>\n    <text x=\"50%\" dy=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" fill=\"white\" style=\"font-size: 25px;\">No. ";
  if (helper = helpers.rank) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.rank); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</text>\n    </svg>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_rating'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info\">\n  <span class=\"fieldName\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <div class=\"rating goldStar pull-right\">\n    ";
  if (helper = helpers.stars) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.stars); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_textbox'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n  <input class=\"title\" placeholder=\"Title\" type=\"text\">\n  <textarea placeholder=\"Start here\"></textarea>\n  <button class=\"btn btn-success noSelect pull-right js-save\" data-loading-text=\"Saving...\">Save</button>\n  ";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <span>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <p>";
  if (helper = helpers.value) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.value); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n  ";
  return buffer;
  }

  buffer += "<div class=\"textbox\" draggable=\"";
  if (helper = helpers.editing) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editing); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['saveCancelBtn'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div id='";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n  <button id='";
  if (helper = helpers.saveId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.saveId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' type='button' class='btn btn-success' style='position: relative; width: 100%;'>\n    <i class='fa fa-arrow-circle-o-right'></i> Save &amp; Next\n  </button>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['simple_card'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <img class=\"profileimg\" src=\"";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <div class=\"profileHeading\">\n      <span>";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n    </div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"card-header\">\n</div>\n<div class=\"photo\">\n  <a class=\"btn-like\" href=\"";
  if (helper = helpers.entityUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.entityUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n</div>\n<div class=\"contentContainer outer\">\n  <div class=\"entityDetail\">\n  </div>\n  <ul class=\"view-toolbar\" style=\"\">\n    <li>\n    <i class=\"fa fa-heart-o fa-lg\"></i>\n    <i class=\"fa fa-twitter fa-lg\"></i>\n    <i class=\"fa fa-code-fork fa-lg\"></i>\n    <i class=\"fa fa-share-square-o fa-lg\"></i>\n    </li>\n  </ul>\n  <ul class=\"tags tagit\">\n    ";
  if (helper = helpers.tag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n  </ul>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['summaryCard'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n  <a class=\"btn-lie\" href='/entity/";
  if (helper = helpers.id) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.id); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n    <img class='profileimg' id='img-";
  if (helper = helpers.domId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.domId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' src='";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "'/>\n  </a>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " ";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<div class='card-header'>\n  <legend contenteditable='";
  if (helper = helpers.editable) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.editable); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='card-title'>";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</legend>\n  <div class='card-header-btn card-header-left'>\n    <div class='card-status'>\n    </div>\n  </div>\n  <div class='card-header-btn card-header-right'>\n    <div class='xbtn-group'>\n      <button class='btn btn-mini headBtn btn-warning linkBtn hide'><i class='fa fa-paper-clip fa-lg'></i></button>\n      <button class='btn btn-mini headBtn btn-success editBtn '><i class='fa fa-edit fa-lg'></i></button>\n    </div>\n  </div>\n  <div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='fa fa-times-circle fa-lg'></i></div>\n  <div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='fa fa-check-circle fa-lg'></i></div>\n</div>\n<div class='photo'>\n  <a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-";
  if (helper = helpers.domId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.domId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "' class='editImgBtn btn btn-small btn-success' href='#'>\n    Change Image\n  </a>\n  ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.id), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</div>\n<div class='contentContainer outer'>\n  <div class='summary'>\n    ";
  if (helper = helpers.summaryTemplate) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summaryTemplate); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  <div class='entityDetail'>\n    <div class='profileContent outer'>\n    </div>\n    <div class='tagsContent outer'>\n      <div class='hashTag cardView'>\n        <i class='tagBullet cardView fa fa fa-ellipsis-v'></i>\n        <ul class='tags' id='hashtags-";
  if (helper = helpers.domId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.domId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>\n          ";
  if (helper = helpers.hashTags) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hashTags); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<th style='font-size:15px;' colspan='4'> \n  ";
  if (helper = helpers.title) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.title); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " \n  <div class='pull-right cursor-pointer'> \n    <div> \n      <a class='addNew' href='#' style='color:black;'><i title='Add New' class='fa fa-plus'> Add New</i></a> \n      <i title='Create New Ranking' class='addNewRanking fa fa-list-ol'> Rank Items</i> \n    </div> \n  </th>\n";
  return buffer;
  });
})();
