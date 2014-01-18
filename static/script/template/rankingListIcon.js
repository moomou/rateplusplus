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
    + "' class='rankContainer'>\n  <svg xmlns=\"http://www.w3.org/2000/svg\" version=\"1.1\" style=\"width:25px; height:25px;\">\n    <circle cx=\"50%\" cy=\"50%\" r=\"50%\" fill=\"";
  if (stack1 = helpers.color) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.color); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></circle>\n    <text font-size=\"15px\" x=\"50%\" dy=\"50%\" text-anchor=\"middle\" dominant-baseline=\"central\" fill=\"white\">";
  if (stack1 = helpers.rank) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.rank); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "</text>\n  </svg>\n</a>\n";
  return buffer;
  });
})();