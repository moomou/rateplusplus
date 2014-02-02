// Router File
App.AppRouter = Backbone.Router.extend({
    routes: {
        "graph" : "graphPageInit",
        "profile" : "profilePageInit",
        "entity/new" : "newEntityPageInit",
        "ranking/:shareToken" : "rankingViewInit",
        "entity/:id" : "detailEntityPageInit",
        "profile/:id" : "profilePageInit",
        "" : "defaultPageInit", //handles query
    },
    graphPageInit: function() {
        var that = this;

        this.leftSearch = new App.CardColView({col:0});
        $('#leftSearchBtn').click(function() {
            var q = {};
            q.query = $('#leftSearchForm input').val();
            that.leftSearch.search(q);
        });

        this.rightSearch = new App.CardColView({col:2});
        $('#rightSearchBtn').click(function() {
            var q = {};
            q.query = $('#rightSearchForm input').val();
            that.rightSearch.search(q);
        });

        $('#linkBtn').click(function(e) {
            var newRelation = new App.LinkView({
                model: new App.LinkModel(),
            });
            App.ColManager.getCol("card").cols[1].append(newRelation.render().el);
        });

        $(document).on('graphLinkSet', function(e) {
            var domContainer = App.ColManager.getCol('card').cols[1];
            var graphView = new App.GraphView({domContainer: domContainer});
        });
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
            searchTerm = getQueryVariable("searchterm");

        if (empty){
            App.GlobalWidget.searchMessageBox.find('#searchTerm').html(searchTerm);
            App.GlobalWidget.searchMessageBox.show();
        }

        var stateVar = 0,
            cardRef  = App.CreateNewCard(),
            saveCancelBtn = Handlebars.templates.saveCancelBtn;

        $('#dr1').append(saveCancelBtn({
            'id': 'saveCancelContainer',
            'saveId': 'saveAndNext',
            'cancelId': 'cancelAndNext'
        }));

        $("#saveAndNext").click(function(e) {
            switch (stateVar) {
                // step 1
                case 0:
                    stateVar = -1; // hacky way to disabel btn

                    cardRef.setPrivacy($('#publicCheckBox').is(':checked'));
                    cardRef.saveCreation(null, function() {
                        cardRef.addNewAttribute();
                        $('#attribute').removeClass('hidden');
                        var dom = $('#saveCancelContainer').detach();
                        $('#attribute').append(dom);
                        stateVar = 1;
                    });
                    break;
                // step 2
                case 1:
                    stateVar = -1;

                    cardRef.saveAllAttributes();
                    $('#dr3').removeClass('hidden');

                    var dom = $('#saveCancelContainer').detach();
                    dom.find('#saveAndNext').html('Go to the new card');
                    $('#dr3').append(dom);

                    stateVar = 2;
                    break;
                // step 3
                case 2:
                    document.location.href = 
                        window.location.origin + "/entity/" + cardRef.model.get('id');
                    console.log("Finished");
                    break;
            }
        });
    },
    rankingViewInit: function(shareToken) {
        var forking = getQueryVariable("forking") == "true",
            rawRankingView = sessionStorage.getItem("rankingView"),
            rankingView = rawRankingView && JSON.parse(rawRankingView);

        if (rankingView && rankingView.shareToken != shareToken) {
            sessionStorage.removeItem("rankingView");
        }

        pageView = new App.PageView({rankingId: shareToken, forking: forking});
    },
    detailEntityPageInit: function(id) {
        console.log("detail Entity");

        App.RankingController();

        pageView = new App.PageView({id: parseInt(id)}); //search for particular id

        $('#submitComment').click(function(e) {
            var comment = $('#commentForm'),
                btn = $(this);

            if (!comment.val()) {
                return;
            }

            btn.button('loading');

            var newComment = new App.CommentModel({});

            newComment.set('comment', comment.val());
            newComment.set('entity', id);

            newComment.save({}, {
                success: function(response) {
                    btn.button('reset');
                },
                error: function(response) {
                },
            });
        });

        $('#addNew').click(function(e) {
            var selectedTab = $('#myTab').find('.active a').attr('href');
            $(selectedTab+'Modal').toggle();
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
            postData.value = '';

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
    },
    defaultPageInit: function() {
        console.log("Default Route");
        var query = $('#searchInput').val();

        if (query) {
            pageView = new App.PageView({query:query});
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
