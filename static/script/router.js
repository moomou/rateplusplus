// Router File
App.AppRouter = Backbone.Router.extend({
    routes: {
        "graph" : "graphPageInit",
        "profile" : "profilePageInit",
        "entity/new" : "newEntityPageInit",
        "ranking/:id" : "rankingViewInit",
        "entity/:id" : "detailEntityPageInit",
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
    profilePageInit: function() {
        console.log("Profile Page Init");
        $.ajax({
            type: "GET",
            url: App.API_SERVER + App.API_VERSION + 'user/' + getCookie('userid') + "/ranked"
        })
        .done(function(res) {
            if (res) { // clear local session
                // do something
                console.log("Error Loading Ranking on Profile Page"); 
            }
                
            var allRankings = res,
                rowViews = [],
                tableView = new App.TableView(),
                titleRow = new App.TitleRowView(),
                sessionStorageInd = 0;

            tableView.el.appendChild(titleRow.render(getCookie('username') + "'s Rankings").el);
            titleRow.$('.addNew').hide();

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
                    rankListIcon = 
                        new App.RankListIconView(
                            {rank: rank, link: link, sessionStorageInd: sessionStorageInd});

                    rank += 1;
                    rankingRow.$('.rankingList').append(rankListIcon.render().el);
                });

                tableView.el.appendChild(rankingRow.el);
                sessionStorageInd += 1;
            });
        })
        .fail(function(msg) {
            // Tell the user
        });
    },
    newEntityPageInit: function() {
        console.log("New Entity");

        var stateVar = 0,
            cardRef  = App.CreateNewCard(),
            saveCancelBtn = _.template(Template.saveCancelBtnTemplate);

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
                    dom.find('#saveAndNext').html('Finished');
                    $('#dr3').append(dom);

                    stateVar = 2;
                    break;
                // step 3
                case 2:

                    break;
            }
        });
    },
    rankingViewInit: function(id) {
        App.RankingController();
        pageView = new App.PageView({rankingId: id});
    },
    detailEntityPageInit: function(id) {
        console.log("detail Entity");

        App.RankingController();

        pageView = new App.PageView({id: parseInt(id)}); //search for particular id
        entityCommentsView = new App.CommentCollectionView({entityId: parseInt(id)});

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
                    entityCommentsView.update(response);
                },
                error: function(response) {
                },
            });
        });
    },
    defaultPageInit: function() {
        console.log("Default Route");
        var query = $('#searchInput').val();

        App.RankingController();

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
