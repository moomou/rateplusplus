(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['rankingRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.imgURL)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " ";
  return buffer;
  }

function program3(depth0,data) {
  
  
  return " /static/img/blank.png ";
  }

  buffer += "<td class='ranking tdDivider'>\n  <input type='text' value='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "' class='pull-left idial span1'>\n  <span class='pull-left sdial'>"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.summary)),stack1 == null || stack1 === false ? stack1 : stack1.avgScore)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " %</span>\n</td>\n<td class='head' style=\"width:25%; background: url(";
  stack2 = helpers['if'].call(depth0, ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.imgURL), {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += ")\">\n  <h4>\n    <a class='' href='"
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.window)),stack1 == null || stack1 === false ? stack1 : stack1.location)),stack1 == null || stack1 === false ? stack1 : stack1.origin)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "/entity/"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.id)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "'>\n      "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n    </a>\n  </h4>\n</td>\n<td class='body tdDivider'>\n  <div class='rowDescription'>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n</td>\n<td class='stat'>\n  <ul class='statList'>\n    <li><i class='icon-check'></i> "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalVote)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Votes</li>\n    <li><i class='icon-tags'></i> "
    + escapeExpression(((stack1 = ((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.summary)),stack1 == null || stack1 === false ? stack1 : stack1.totalAttribute)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + " Attributes</li>\n  </ul>\n</td>\n";
  return buffer;
  });
})();