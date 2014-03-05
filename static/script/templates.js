
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
templates['contributor_icon'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " ";
  if (helper = helpers.iconUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.iconUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return " http://rationalwiki.org/w/images/thumb/c/c0/Icon_anonymous.svg/200px-Icon_anonymous.svg.png ";
  }

  buffer += "<li><div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.iconUrl), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "')\"></li>\n";
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
templates['detail_summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, self=this, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <div class=\"pull-right sideBar\">\n    <ul class=\"infoBar\" style=\"margin-left: 0;\">\n      <li data-original-title=\"Edit\"><a href=\"#edit\" class=\"btn-like\"><i class=\"fa fa-edit fa-lg\"></i></a></li>\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.fork_enabled), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.embed_enabled), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n  </div>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  
  return "\n      <li data-original-title=\"Fork\"><a href=\"#fork\" class=\"btn-like\"><i class=\"fa fa-code-fork fa-lg\"></i></a></li>\n      ";
  }

function program4(depth0,data) {
  
  
  return "\n      <li data-original-title=\"Embed\"><a href=\"#embed\" class=\"btn-like\"><i class=\"fa fa-code fa-lg\"></i></a></li>\n      ";
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div class=\"edit-btns pull-right\">\n      <label class=\"switch switch-green\">\n        <input type=\"checkbox\" class=\"switch-input\" checked>\n        <span class=\"switch-label\" data-on=\"Public\" data-off=\"Private\"></span>\n        <span class=\"switch-handle\"></span>\n      </label>\n      <button id=\"save-btn\" class=\"btn btn-success\" style=\"margin-bottom: 5px;\">\n        <i class=\"fa fa-cloud-upload\"> Save</i>\n      </button>\n      <button id=\"cancel-btn\" class=\"btn btn-white\">\n        <i class=\"fa fa-minus-circle\"> Cancel</i>\n      </button> \n    </div>\n    <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.imgURL), {hash:{},inverse:self.program(9, program9, data),fn:self.program(7, program7, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "')\">\n      <button id=\"change-image-btn\" class=\"btn-small btn btn-white\" style=\"margin: 0 auto;display: block; margin-top: 105%;\">Change</button>\n    </div>\n    <ul class=\"meta pull-left\">\n      <li class=\"name\">\n        <input id=\"name\" class=\"title-input js-title\" placeholder=\"Title\" type=\"text\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.name), {hash:{},inverse:self.noop,fn:self.program(11, program11, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n      </li>\n      <li class=\"hash\">\n        <input id=\"tag\" class=\"hash-input js-hash\" placeholder=\"#hashtag\" type=\"text\" value=\"";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.tags), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n      </li>\n    </ul>\n    <div>\n      <textarea id=\"description\" placeholder=\"Enter description here.\">";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.description), {hash:{},inverse:self.noop,fn:self.program(15, program15, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</textarea>\n    </div>\n    ";
  return buffer;
  }
function program7(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += " ";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + " ";
  return buffer;
  }

function program9(depth0,data) {
  
  
  return " //cloverite.com/static/img/blank.png ";
  }

function program11(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program13(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.tags) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tags); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program15(depth0,data) {
  
  var stack1, helper;
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  return escapeExpression(stack1);
  }

function program17(depth0,data) {
  
  var buffer = "", stack1, helper;
  buffer += "\n    <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "')\"></div>\n    <ul class=\"meta pull-left\">\n      <li class=\"name\">\n        <span class=\"title-input js-title\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n      </li>\n      <li class=\"hash\">\n        <ul class=\"hash\">\n          ";
  if (helper = helpers.hashTags) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hashTags); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </ul>\n      </li>\n    </ul>\n    <ul class=\"contributor pull-right\">\n      ";
  if (helper = helpers.contributors) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contributors); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    <span class=\"pull-right\"> Contributed by</span>\n    <div class=\"pull-left\" style=\"clear:both;\">\n      <p>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n    </div>\n    ";
  return buffer;
  }

  buffer += "<div class=\"info-card detail\">\n  ";
  stack1 = helpers.unless.call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <div class=\"header interactive\">\n    ";
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.editing), {hash:{},inverse:self.program(17, program17, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['partial_hashtags'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function";


  buffer += "<ul class=\"hash\">\n  ";
  if (helper = helpers.hashTags) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.hashTags); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</ul>\n";
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
  buffer += "\n  <hr>\n  <ul class=\"meta\">\n    <li class=\"src\">\n      <a href=\"";
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
templates['sa_card_row'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;


  buffer += "<div class=\"info-card\" style=\"width: auto;\" data-index=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"header\">\n    <a href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "')\"></div>\n    </a>\n    <ul class=\"meta pull-left\">\n      <li class=\"name\">\n        <a class=\"muted\" href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n          <span class=\"title-input js-title\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n        </a>\n      </li>\n      <li> \n        ";
  stack1 = self.invokePartial(partials.partial_hashtags, 'partial_hashtags', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      </li>\n    </ul>\n    <div class=\"pull-right btn-like\" style=\"margin-top: 25px;\"><i class=\"fa fa-angle-right fa-2x\"></i></div>\n  </div>\n  <hr style=\"visibility: hidden;\">\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_row_image'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info-card\" style=\"width: auto;padding: 0;height: 112px; margin-bottom: 20px;\" data-index=\"0\">\n  <div class=\"cover\">\n    <a href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "')\"></div>\n    </a>\n  </div>\n  <div class=\"header\" style=\"margin-right: 0;\">\n    <h3 style=\"text-align: center; vertical-align: middle; line-height: 90px;\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</h3>    \n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_row_info'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info-card\" style=\"width: auto;padding: 0;height: 112px; margin-bottom: 20px;\" data-index=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"header\" style=\"\n    height: 112px;\n    position: relative;\n    \">\n    <span style=\"\n      font-size: 24px;\n      float: left;\n      display: block;\n      vertical-align: middle;\n      line-height: 112px;\n      margin-left: 25px;\n      text-transform: lowercase;\n      \">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"pull-right\" style=\"\n      font-size: 36px;\n      display: table-row;\n      display: inline-block;\n      vertical-align: middle;\n      line-height: 112px;\n      margin-right: 25px;\n      \">\n      ";
  if (helper = helpers.info) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.info); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</i>\n    </span>    \n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_row_padding'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"info-card\" style=\"width: auto;padding: 0;height: 112px; margin-bottom: 20px; visibility: hidden;\" data-index=\"";
  if (helper = helpers.index) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.index); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n  <div class=\"header\" style=\"\n    height: 112px;\n    position: relative;\n    \">\n    <span style=\"\n      font-size: 24px;\n      float: left;\n      display: block;\n      vertical-align: middle;\n      line-height: 112px;\n      margin-left: 25px;\n      text-transform: lowercase;\n      \">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"pull-right\" style=\"\n      font-size: 36px;\n      display: table-row;\n      display: inline-block;\n      vertical-align: middle;\n      line-height: 112px;\n      margin-right: 25px;\n      \">\n      ";
  if (helper = helpers.info) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.info); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</i>\n    </span>    \n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_card_summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); partials = this.merge(partials, Handlebars.partials); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression, self=this;


  buffer += "<div class=\"info-card\" style=\"width: auto;\">\n  <div class=\"header\">\n    <a href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n      <div class=\"profile pull-left js-profile\" style=\"background-image: url('";
  if (helper = helpers.imgURL) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.imgURL); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "')\"></div>\n    </a>\n    <ul class=\"meta pull-left\">\n      <li class=\"name\">\n        <a class=\"muted\" href=\"";
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\">\n          <span class=\"title-input js-title\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n        </a>\n      </li>\n      <li>\n        ";
  stack1 = self.invokePartial(partials.partial_hashtags, 'partial_hashtags', depth0, helpers, partials, data);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </ul>\n    <ul class=\"action\">\n    </ul>\n  </div>\n  <div class=\"textbox\">\n    <p>";
  if (helper = helpers.description) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.description); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</p>\n  </div>\n  <div class=\"content\" style=\"margin-top: 25px;\">\n    ";
  if (helper = helpers.summary) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.summary); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  <div class=\"footer\" style=\"width: auto;\">\n    <ul class=\"contributor pull-right\">";
  if (helper = helpers.contributors) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.contributors); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</ul>\n    <div class=\"by pull-right\">Contributed by </div>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['sa_content_field'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"interaction\">\n  <button class=\"btn btn-inverse\"><i class=\"fa fa-signal\"></i></button>\n</div>\n<div class=\"info\">\n  <span class=\"pull-left fieldName\">";
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


  buffer += "<div class='interaction'>\n  <a href='#' class='btn btn-success voteBtn upVote ";
  if (helper = helpers.upVoteBtnType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.upVoteBtnType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>Yes <i class='upVote fa fa-thumbs-up'></i></a>\n  <a href='#' class='btn btn-danger voteBtn downVote ";
  if (helper = helpers.downVoteBtnType) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.downVoteBtnType); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "'>No <i class='downVote fa fa-thumbs-down'></i></a>\n</div>\n<div class=\"info\">\n  <span class=\"fieldName\">";
  if (helper = helpers.name) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.name); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n  <div class=\"rating goldStar pull-right\">\n    ";
  if (helper = helpers.info) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.info); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
templates['sa_content_video'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<iframe id=\"ytplayer\" type=\"text/html\" width=\"250\" height=\"140.625\" src=\"https://www.youtube.com/embed/";
  if (helper = helpers.youtubeId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.youtubeId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "?rel=0&showinfo=0&theme=light\" frameborder=\"0\" allowfullscreen>\n";
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
  if (helper = helpers.srcUrl) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.srcUrl); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
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
  stack1 = helpers['if'].call(depth0, (depth0 && depth0.profileImg), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </a>\n</div>\n<div class=\"contentContainer outer\">\n  <div class=\"js-detail\">\n  </div>\n  <ul class=\"view-toolbar\" style=\"\">\n    <li>\n      <i class=\"fa fa-heart-o fa-lg\"></i>\n      <i class=\"fa fa-twitter fa-lg\"></i>\n      <i class=\"fa fa-code fa-lg\"></i>\n      <i class=\"fa fa-share-square-o fa-lg\"></i>\n    </li>\n    <li>";
  if (helper = helpers.uniqueId) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.uniqueId); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</li>\n  </ul>\n  <ul class=\"tags tagit\">\n    ";
  if (helper = helpers.tag) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.tag); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "\n  </ul>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['stat_summary'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, helper, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"stats\">\n  <span class=\"num\">";
  if (helper = helpers.num) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.num); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span><span class=\"field\">";
  if (helper = helpers.category) { stack1 = helper.call(depth0, {hash:{},data:data}); }
  else { helper = (depth0 && depth0.category); stack1 = typeof helper === functionType ? helper.call(depth0, {hash:{},data:data}) : helper; }
  buffer += escapeExpression(stack1)
    + "</span>\n</div>\n";
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
