// Router File
App.AppRouter = Backbone.Router.extend({
    routes: {
        "profile(/)" : "profilePageInit",
        "profile/:id(/)" : "profilePageInit",
        "entity/new(/)" : "newEntityPageInit",
        "ranking/:shareToken(/)" : "rankingPage",
        "entity/:id(/)" : "detailPageInit",
        "(/)" : "defaultPageInit",
    },
    profilePageInit: function(id) {
        console.log("Profile Page Init");

        var createdModels = new App.SummaryCardCollection(App.CREATED,  {
            url: 'user/' + getCookie('userid') + "/created"
        })
        .on('reset', function(res) {
            // This is being triggered twice. TODO: Fix.

            var privateContent = $('#private-content'),
                publicContent  = $('#public-content');

            privateContent.empty();
            publicContent.empty();

            _(res.models).each(function(model, ind) {
                model.set('index', ind)
                var row = new App.ProfileEntityView({model: model});
                if (model.get('private')) {
                    privateContent.append(row.render().el);
                } else {
                    publicContent.append(row.render().el);
                }
            });
        }).fetch();

        $.ajax({
            type: "GET",
            url: App.API_SERVER + App.API_VERSION + 'user/' + getCookie('userid') + "/ranked"
        })
        .done(function(res) {
            if (!res.success) {
                return;
            }
            var allRankings = res.payload,
                rowViews = [],
                tableView = new App.TableView(),
                titleRow = new App.TitleRowView({hide: ['.addNew', '.addNewRanking']}),
                sessionStorageInd = 0;

            tableView.el.appendChild(titleRow.render('My Recommendation').el);
            document.getElementById('rankings').appendChild(tableView.el);

            sessionStorage.setItem("allRankings", JSON.stringify(allRankings));
            sessionStorage.setItem("currentRankingInd", "");

            _(allRankings).each(function(ranking) {
                var rankListIcons = [],
                    rankingRow = new App.ProfileRankingView({
                        model: ranking,
                        sessionStorageInd: sessionStorageInd
                    }).render(),
                    rank = 1;

                _(ranking.ranks).each(function(entityId) {
                    var link = window.location.origin + "/entity/" + entityId;
                    rankListIcons =
                        new App.RankListIconView(
                            {rank: rank, link: link, sessionStorageInd: sessionStorageInd});

                    rank += 1;
                    rankingRow.$('.rankingList').append(rankListIcons.render().el);
                });

                tableView.el.appendChild(rankingRow.el);
                sessionStorageInd += 1;
            });
        })
        .fail(function(msg) {
            App.MessageBox.showNetworkErrorMsg();
        });
    },
    newEntityPageInit: function(queryString) {
        console.log("new Entity");
        var empty       = getQueryVariable("empty"),
            searchTerm  = getQueryVariable("searchterm"),
            imgUrl      = '';

        if (empty){
            App.GlobalWidget.searchMessageBox.find('#searchTerm').html(searchTerm);
            App.GlobalWidget.searchMessageBox.show();
        }

        // empty card view
        new App.DetailEntityPageView();

        /*
        $("#main-summary input, textarea").focus(function(e) {
            $("#top-menu").animate({opacity: 0}, 300);
        });
        $("#main-summary input, textarea").focusout(function(e) {
            $("#top-menu").animate({opacity: 1}, 300);
        });*/
    },
    rankingPageInit: function(shareToken) {
        console.log("ranking");
        var forking = getQueryVariable("forking") == "true",
            rawRankingView = sessionStorage.getItem("rankingView"),
            rankingView = rawRankingView && JSON.parse(rawRankingView);

        if (rankingView && rankingView.shareToken != shareToken) {
            sessionStorage.removeItem("rankingView");
        }

        pageView = new App.PageView({rankingId: shareToken, forking: forking});
    },
    detailPageInit: function(id) {
        console.log("detail");

        App.RankingController();
        new App.DetailEntityPageView({id: parseInt(id)});

        var ajaxUrl = App.API_SERVER + App.API_VERSION + 'entity/' + id + '/data';

        $('#addNew').click(function(e) {
            $('#contentModal').modal();
        });

        $('#saveContentBtn').click(function(e) {
            var activePanel = $('.addContentBox>div.active'),
                postData = {},
                dataUrl = App.API_SERVER + App.API_VERSION + 'entity/' + id + '/data';

            postData.dataType = activePanel.find('.dataType').val().toLowerCase();
            postData.srcType  = activePanel.find('.srcType').val().toLowerCase();
            postData.name     = activePanel.find('.fieldname').val();
            postData.selector = activePanel.find('.selector').val() || "";
            postData.srcUrl   = activePanel.find('.srcUrl').val();
            postData.value    = activePanel.find('.value').val() || "";

            if (postData.dataType == "attribute") {
                var newAttribute = new App.EntityAttributeModel({
                    name   : postData.name,
                    entity : id,
                });
                newAttribute.save({}, {
                    success: function(res) {
                        $('#contentModal').hide();
                        location.reload();
                    },
                });
            } else {
                $.post(ajaxUrl, postData).done(function(res) {
                    $('#contentModal').hide();
                    location.reload();
                });
            }
        });

        $('#writingSubmit').click(function(e) {
            var postData = {};

            postData.dataType = 'text';
            postData.srcType = '';
            postData.selector = '';
            postData.srcUrl = '';
            postData.name = $('#writingModal').find('.title').val() || "";
            postData.value = $('#writingModal').find('textarea').val() || "";

            $.post(ajaxUrl, postData)
                .done(function(res) {
                    console.log(res);
                    $('#writingModal').hide();
                });
        });

        $('.js-startEditor').click(function(e) {
            console.log('js-startEditor');
            var newSACard = new App.StandaloneCardView();
            App.GlobalWidget.saEditor.append(newSACard.render().el);
        });

        $("#addContent li").click(function(e) {
            var triBorder = $('.upTriangleBorder'),
                tri = $('.upTriangle'),
                clickedInd = $(this).index(),
                newPosition = 105 + clickedInd * 82;
            triBorder.css({'margin-left': newPosition + 'px'});
            tri.css({'margin-left': newPosition + 2 + 'px'});
        });

        $('#filterList li').click(function(e) {
            var target = e.currentTarget;
            $('#filterInput')
                .val(target.getAttribute("data-filteron"))
                .trigger('input');
        });

        $('#filterInput').on('input', function(e) {
            var searchStyle = document.getElementById('searchStyle');
            if (!this.value) {
              searchStyle.innerHTML = "";
              return;
            }
            searchStyle.innerHTML =
                ".searchable:not([data-index*=\"" + this.value.toLowerCase() + "\"]) { display: none; }";
        });

        // activate jquery plugin
        wideArea();
    },
    defaultPageInit: function() {
        console.log("Default Route");
        var query = $('#searchInput').val(),
            expandInd = getQueryVariable("expand");

        App.RankingController();
        pageView = new App.SearchPageView({query:query});

        if (_.isNumber(expandInd)) {
            debugger;
            pageView.render(expandInd);
        }

        $('#filterBtn').click(function(e) {
            var filterBy = e.target.getAttribute('data-filterBy');
            if (searchView) { //filter on summary card
            }
            else { //filter on attr
            }
        });

        $('#sortBtn').click(function(e) {
            var sortBy = e.target.getAttribute('data-sortBy');
            if (sortBy) {
                pageView.collection.sortByX({'prop': sortBy});
                pageView.render();
            }
        });
    }
});

App.router = new App.AppRouter();
Backbone.history.start({pushState: true});
