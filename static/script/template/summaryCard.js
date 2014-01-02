(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['summaryCard'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n  <a href='/entity/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n    <img class='profileimg' id='img-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.domId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' src='";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.imgURL), {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "'/>\n  </a>\n  ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.imgURL)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<div class='card-header'>\n  <legend contenteditable='"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.editable)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' class='card-title'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</legend>\n  <div class='card-header-btn card-header-left'>\n    <div class='card-status'>\n    </div>\n  </div>\n  <div class='card-header-btn card-header-right'>\n    <div class='xbtn-group'>\n      <button class='btn btn-mini headBtn btn-warning linkBtn hide'><i class='icon-paper-clip icon-large'></i></button>\n      <button class='btn btn-mini headBtn btn-success editBtn '><i class='icon-edit icon-large'></i></button>\n    </div>\n  </div>\n  <div data-toggle='tooltip' title='Close' class='close closeBtn'><i class='icon-remove-sign icon-large'></i></div>\n  <div data-toggle='tooltip' title='Save' class='close saveBtn'><i class='icon-ok-sign icon-large'></i></div>\n</div>\n<div class='photo'>\n  <a data-toggle='modal' data-target='#imageChangeModal' id='editImgBtn-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.domId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' class='editImgBtn btn btn-small btn-success' href='#'>\n    Change Image\n  </a>\n  ";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.id), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n</div>\n<div class='contentContainer outer'>\n  <div class='summary'>\n    summaryTemplate\n  </div>\n  <div class='entityDetail'>\n    <div class='profileContent outer'>\n    </div>\n    <div class='tagsContent outer'>\n      <div class='hashTag cardView'>\n        <i class='tagBullet cardView icon-ellipsis-vertical'></i>\n        <ul class='tags' id='hashtags-"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.domId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n          "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.hashTags)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n        </ul>\n      </div>\n    </div>\n  </div>\n  <div class='break break-mini'></div>\n</div>\n";
  return buffer;
  });
})();