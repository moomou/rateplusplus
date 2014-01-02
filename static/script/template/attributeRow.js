(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['attributeRow'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<td style='width:17%;' class='tdDivider text-h-center text-v-center noSelect'>\n  <i style='font-size: 3em; color:";
  if (stack1 = helpers.color) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.color); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + ";' data-toggle='tooltip' title='";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class='icon-heart'>\n    <span class='noSelect toneText'> ";
  if (stack1 = helpers.tone) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.tone); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "<span>\n  </i>\n</td>\n<td class='head'>\n  <h3>"
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</h3>\n  <span style='position: absolute; top: 5px; left: 10px;'></span>\n  <div class='voteBtns'>\n    <a href='#' class='btn voteBtn upVote ";
  if (stack2 = helpers.upVoteBtnType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.upVoteBtnType); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>Yes <i class='upVote icon-thumbs-up'></i></a>\n    <a href='#' class='btn voteBtn downVote ";
  if (stack2 = helpers.downVoteBtnType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.downVoteBtnType); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>No <i class='downVote icon-thumbs-down'></i></a>\n  </div>\n  <div class='hidden rating ";
  if (stack2 = helpers.ratingType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.ratingType); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n  </div>\n</td>\n";
  return buffer;
  });
})();