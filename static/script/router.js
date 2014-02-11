// Router File
App.AppRouter = Backbone.Router.extend({
    routes: {
        "profile" : "profilePageInit",
        "profile/:id" : "profilePageInit",
        "entity/new" : "newEntityPageInit",
        "ranking/:shareToken" : "rankingPage",
        "entity/:id" : "detailPageInit",
        "" : "defaultPageInit",
    },
    profilePageInit: function(id) {
        console.log("Profile Page Init");

        $.ajax({
            type: "GET",
            url: App.API_SERVER + App.API_VERSION + 'user/' + getCookie('userid') + "/ranked"
        })
        .done(function(res) {
            if (!res.success) {
                // notify user
                return;
            }

            var allRankings = res.payload,
                rowViews = [],
                tableView = new App.TableView(),
                titleRow = new App.TitleRowView({hide: ['.addNew', '.addNewRanking']}),
                sessionStorageInd = 0;

            tableView.el.appendChild(titleRow.render('My Rankings').el);

            document.getElementById('profileRow').appendChild(tableView.el);

            sessionStorage.setItem("allRankings", JSON.stringify(allRankings));
            sessionStorage.setItem("currentRankingInd", "");

            _(allRankings).each(function(ranking) {
                var rankListIcons = [],
                    rankingRow = new App.ProfileRowView({
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
            // Tell the user
        });
    },
    newEntityPageInit: function(queryString) {
        console.log("New Entity");

        var empty = getQueryVariable("empty"),
            searchTerm = getQueryVariable("searchterm"),
            $profileImg = $('#profile-img'),
            imgUrl = '',
            model = new App.EntityModel();

        if (empty){
            App.GlobalWidget.searchMessageBox.find('#searchTerm').html(searchTerm);
            App.GlobalWidget.searchMessageBox.show();
        }

        // empty card view
        new App.DetailEntityPageView();

        $('#save-btn').click(function() {
            var tags = _($('#tags').split('#')).map(function(tag) {
                return tag.replace(',', '').trim();
            });

            model.set('name', $('#name').val() || '');
            model.set('description', $('#description').val() || '');
            model.set('private', false);
            model.set('imgURL', imgUrl);
            model.set('tags', tags);
            model.save();
        });

        $('#change-image-btn').click(function() {
            $('#imageChangeModal').modal();
            $('#imageURLSaveBtn').click(function() {
                imgUrl = $('#imageURLInput').val();
                $profileImg.css('background-image', 'url("' + imgUrl + '")');
            });
        });

        /*
        $("#main-summary input, textarea").focus(function(e) {
            $("#top-menu").animate({opacity: 0}, 300);
        });
        $("#main-summary input, textarea").focusout(function(e) {
            $("#top-menu").animate({opacity: 1}, 300);
        });*/
    },
    rankingPageInit: function(shareToken) {
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

        $('#addNew').click(function(e) {
            $('#contentModal').modal();
        });

        $('#contentSubmit').click(function(e) {
            var activePanel = $('.addContentBox>div.active'),
                postData = {},
                ajaxUrl = App.API_SERVER + App.API_VERSION + 'entity/' + id + '/data';

            postData.dataType = activePanel.find('.dataType').val().toLowerCase();
            postData.srcType = activePanel.find('.srcType').val().toLowerCase();
            postData.name = activePanel.find('.fieldname').val();
            postData.selector =  activePanel.find('.selector').val() || "";
            postData.srcUrl = activePanel.find('.srcUrl').val();
            postData.value = activePanel.find('.value').val() || "";

            $.post(ajaxUrl, postData)
                .done(function(res) {
                    console.log(res);
                    $('#contentModal').hide();
                });
        });

        $('#writingSubmit').click(function(e) {
            var postData = {},
                ajaxUrl = App.API_SERVER + App.API_VERSION + 'entity/' + id + '/data';

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

        // activate jquery plugin
        wideArea();
    },
    defaultPageInit: function() {
        console.log("Default Route");
        var query = $('#searchInput').val();

        if (query) {
            pageView = new App.SearchPageView({query:query});
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

var appRouter = new App.AppRouter();

Backbone.history.start({pushState: true});
