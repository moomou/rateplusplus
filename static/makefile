COFFEEC = coffee
SASSC = sass
HANDLEBARSC = handlebars

# Build vendor package
VENDORSRC = js/handlebars.runtime-v1.1.2.js \
			js/bootstrap.min.js \
			js/jquery.form.js \
			js/jquery.knob.js \
			js/tag-it.min.js \
			js/twitter-bootstrap-hover-dropdown.min.js \
			js/widearea.min.js

VENDOROUT = js/vendor.js

$(VENDOROUT): $(VENDORSRC)
	awk 'FNR==1{print ""}1' $^ > $@

.PHONY: vendor
vendor: $(VENDOROUT)

# Build views script
VIEWSRC = script/view/_view.js \
	      script/view/saCard.js \
		  script/view/page_.js

VIEWOUT = ./script/views.js

$(VIEWOUT): $(VIEWSRC)
	awk 'FNR==1{print ""}1' $^ > $@

.PHONY: view
view: $(VIEWOUT)

# Build templates javascript
TEMPLATESRC = $(wildcard script/template/*.handlebars)
TEMPLATEOBJ = ${TEMPLATESRC:.handlebars=.js}
TEMPLATEOUT = script/templates.js

$(TEMPLATEOUT): $(TEMPLATEOBJ)
	awk 'FNR==1{print ""}1' $^ > $@

%.js: %.handlebars
	$(HANDLEBARSC) $< -f $@

.PHONY: template
template: $(TEMPLATEOUT)

# Build stylesheets
STYLESRC = $(wildcard stylesheet/*.scss)
STYLEOBJ = ${STYLESRC:.scss=.css}
STYLEOUT = css/compiled.css

$(STYLEOUT): $(STYLEOBJ)
	awk 'FNR==1{print ""}1' $^ > $@

%.css: %.scss
	$(SASSC) -C $< > $@

.PHONY: style
style: $(STYLEOUT)

.PHONY: all
all: vendor template style view

.DEFAULT_GOAL := all

.PHONY: clean
clean:
	-rm $(VENDOROUT)
	-rm $(VIEWOUT)
	-rm $(TEMPLATEOBJ)
	-rm $(TEMPLATEOUT)
	-rm $(STYLEOBJ)
	-rm $(STYLEOUT)
