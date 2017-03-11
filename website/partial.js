var fs = require("fs");

module.exports= function (hbs) {
  // register partials
  hbs.registerPartial('head', getPartials('head'));
  hbs.registerPartial('cloud', getPartials('cloud'));
  hbs.registerPartial('news_bar', getPartials('news_bar'));
  hbs.registerPartial('timeline', getPartials('timeline'));
  hbs.registerPartial('wordCollection', getPartials('wordCollection'));
  hbs.registerPartial('averageWords', getPartials('averageWords'));
  hbs.registerPartial('title_analysis', getPartials('title_analysis'));
  hbs.registerPartial('about_reason', getPartials('about_reason'));
  hbs.registerPartial('about_staff', getPartials('about_staff'));
};

function getPartials(filename) {
  var template = fs.readFileSync('./layout/partial/'+filename+'.hbs', 'utf8');
  template = template.replace(/[\t\n]/g, '');
  return template;
}
