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
    + "' class='icon-heart ";
  if (stack1 = helpers.TONE_ICON) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = (depth0 && depth0.TONE_ICON); stack1 = typeof stack1 === functionType ? stack1.call(depth0, {hash:{},data:data}) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>\n    "
    + escapeExpression(((stack1 = ((stack1 = (depth0 && depth0.obj)),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\n  </i>\n</h3>\n<div class='voteBtns'>\n  <a href='#' class='btn voteBtn upVote ";
  if (stack2 = helpers.upVoteBtnClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.upVoteBtnClass); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>Yes <i class='upVote icon-thumbs-up'> </i></a>\n  <a href='#' class='btn voteBtn downVote ";
  if (stack2 = helpers.downVoteBtnClass) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.downVoteBtnClass); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>No <i class='downVote icon-thumbs-down'> </i></a>\n</div>\n<div class='hidden rating ";
  if (stack2 = helpers.ratingType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = (depth0 && depth0.ratingType); stack2 = typeof stack2 === functionType ? stack2.call(depth0, {hash:{},data:data}) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n</div>\n";
  return buffer;
  });
})();