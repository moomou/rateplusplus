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