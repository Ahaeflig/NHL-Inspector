/**
 * nhlInspector.js
 * @author Bastien Chatelain, Adan Häfliger, Ismail Imani
 */
// Console print flags
const MESSAGE = true;
const DEBUG = true;
const WARNING = true
const ERROR = true;

const TEAM_DICT = {
    "Washington Capitals": ["logos/Washington_Capitals_logo.svg", "#323b44"],
    "New Jersey Devils": ["logos/New_Jersey_Devils_logo.svg", "#d71a36"],
    "Columbus Blue Jackets": ["logos/Columbus_Blue_Jackets_logo.svg", "#171d37"],
    "Philadelphia Flyers": ["logos/Philadelphia_Flyers_logo.svg", "#fe733a"],
    "Carolina Hurricanes": ["logos/Carolina_Hurricanes_logo.svg", "#cd1a37"],
    "New York Islanders": ["logos/New_York_Islanders_logo.svg", "#0a2c74"],
    "Pittsburgh Penguins": ["logos/Pittsburgh_Penguins_logo.svg", "#f6ec7b"],
    "New York Rangers": ["logos/New_York_Rangers_logo.svg", "#062d94"],
    "Toronto Maple Leafs": ["logos/Toronto_Maple_Leafs_logo.svg", "#1d459d"],
    "Tampa Bay Lightning": ["logos/Tampa_Bay_Lightning_logo.svg", "#5d74b3"],
    "Detroit Red Wings": ["logos/Detroit_Red_Wings_logo.svg", "#da1934"],
    "Ottawa Senators": ["logos/Ottawa_Senators_logo.svg", "#bf0421"],
    "Boston Bruins": ["logos/Boston_Bruins_logo.svg", "#eab477"],
    "Florida Panthers": ["logos/Florida_Panthers_logo.svg", "#ededed"],
    "Montréal Canadiens": ["logos/Montreal_Canadiens_logo.svg", "#9e0c30"],
    "Buffalo Sabres": ["logos/Buffalo_Sabres_logo.svg", "#1f2349"],
    "St. Louis Blues": ["logos/St_Louis_Blues_logo.svg", "#273052"],
    "Chicago Blackhawks": ["logos/Chicago_Blackhawks_logo.svg", "#e8243a"],
    "Colorado Avalanche": ["logos/Colorado_Avalanche_logo.svg", "#941d3d"],
    "Nashville Predators": ["logos/Nashville_Predators_logo.svg", "#eab943"],
    "Winnipeg Jets": ["logos/Winnipeg_Jets_logo.svg", "#1b1d36"],
    "Dallas Stars": ["logos/Dallas_Stars_logo.svg", "#199e5f"],
    "Minnesota Wild": ["logos/Minnesota_Wild_logo.svg", "#1f594d"],
    "Vegas Golden Knights": ["logos/Vegas_Golden_Knights_logo.svg",  "#424b50"],
    "Los Angeles Kings": ["logos/Los_Angeles_Kings_logo.svg", "#777777"],
    "Calgary Flames": ["logos/Calgary_Flames_logo.svg",  "#dc1430"],
    "Vancouver Canucks": ["logos/Vancouver_Canucks_logo.svg", "#0c2f8d"],
    "Anaheim Ducks": ["logos/Anaheim_Ducks_logo.svg", "#ec7d67"],
    "Edmonton Oilers": ["logos/Edmonton_Oilers_logo.svg", "#ec824e"],
    "Arizona Coyotes": ["logos/Arizona_Coyotes_logo.svg", "#b01f3e"],
    "San Jose Sharks": ["logos/San_Jose_Sharks_logo.svg", "#036082"],
}

const blueSelectorColor = "#3dc1ff";
const redSelectorColor = "#ff5238";


/**
 * Load NHL data from statsapi.web.nhl.com
 * Use ajax and done() callback
 * the ajax's url can be custumised using parameters i.e:
 *   - season=20172018
 *   - date=YYYY-MM-DD
 * To get the state of the championship at date for the season
 * @return The brut response from the used url.
 * @see getCleanedGlobalData() and
 * @see getCleanedTeams() for the parsing and cleaning job on the data
 */
function loadNHLData(date) {

    return $.getJSON({
        type: "GET",
        url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018&date=' + date
    });
}

/**
 * Get and clean some global data from the input data
 * @assume data is the output of @see loadNHLData
 * @param data (): whole JSON data
 * @return the cleaned global data as a JS Object which contains:
 *    -TBD
 */
function getCleanedGlobalData(data) {

    conferenceData = data.records
    let teams = [];

    //Fill Array with team values
    for (let conf = 0; conf < conferenceData.length; ++conf) {
        for (let i = 0; i < conferenceData[conf]["teamRecords"].length; ++i) {

            const teamRecords = conferenceData[conf]["teamRecords"][i];
            const leagueRecord = conferenceData[conf]["teamRecords"][i]["leagueRecord"]
            // TODO refactor if needed and chose correct stats
            const teamName = records.team.name;
            const points = records.points;
            const gamesPlayed = records["gamesPlayed"];
            const wins = leagueRecord.wins;
            const overtime = leagueRecord.ot;
            const losses = leagueRecord.losses;
            const goalAgainst = teamRecords.goalsAgainst;
            const goalScored = teamRecords.goalsScored;
            const divisionRank = teamRecords.divisionRank;
            const conferenceRank = teamRecords.conferenceRank;
            const leagueRank = teamRecords.leagueRank;
            const wildCardRank = teamRecords.wildCardRank;

            teams.push({
                "name": teamName,
                "data": {
                    "logo": TEAM_DICT[teamName][0],
                    "point": points,
                    "teamName": teamName,
                    "points": points,
                    "gamesPlayed": gamesPlayed,
                    "wins": wins,
                    "overtime": overtime,
                    "losses ": losses,
                    "goalAgainst": goalAgainst,
                    "goalScored ": goalScored,
                    "divisionRank": divisionRank,
                    "conferenceRank": conferenceRank,
                    "leagueRank": leagueRank,
                    "wildCardRank": wildCardRank,
                }
            });
        }
    }

    return JSON.parse(JSON.stringify(teams));
}


/**
 * Get and Clean the teams data inside the received input data and return an
 * array of teams where a team is a JS Object which contains:
 * - name : the name of the team
 * - logo : the corresponding logo String path
 * - point : the current league score of the team
 * @assume ouput is sorted decreasingly by point
 * @param data (): The parsed JSON object with nhl league data
 * @return the cleaned data as an array of teams sorted by point decreasingly
 */
function getCleanedTeams(data) {
    conferenceData = data.records
    let teams = [];

    //Fill Array with team values
    for (let conf = 0; conf < conferenceData.length; ++conf) {
        for (let i = 0; i < conferenceData[conf]["teamRecords"].length; ++i) {

            const teamRecords = conferenceData[conf]["teamRecords"][i];

            const teamName = teamRecords.team.name;
            const points = teamRecords.points;
            const id = teamRecords.team.id;
            const goalScored = teamRecords.goalsScored;
            const goalAgainst = teamRecords.goalsAgainst;
            const wins = teamRecords.leagueRecord.wins;
            const losses = teamRecords.leagueRecord.losses;
            const team_conf = teamRecords.team.conference.name;
            const div = teamRecords.team.division.name;

            teams.push({
                name: teamName,
                logo: TEAM_DICT[teamName][0],
                point: points,
                teamGoalScored: goalScored,
                teamGoalAgainst: goalAgainst,
                teamWins: wins,
                teamLosses: losses,
                id: id,
                color : TEAM_DICT[teamName][1],
                conference : team_conf,
                division : div,
            });
        }
    }

    //Sort array by team points decreasing
    teams.sort(function(a, b) {
        return b.point - a.point;
    });

    return teams;
}


/**
 * Store the current selected date in a Session
 * @param date (string): the date to store
 */
function sessionStoreDate(date) {
    localStorage.setItem("chosen_date", date);
}

/**
 * Return chosen date
 */
function chosenDate() {
    return localStorage.getItem("chosen_date");
}


/**
 * Locally store the id of the user favorite team
 * @param id (int): the id to store
 */
function locallyStoreFavoriteTeamId(id) {
    localStorage.setItem("id", id);
}

/**
 * Locally store the id of the opposite team
 * @param id (int): the id to store of the opposite team
 */
function locallyStoreOppositeTeamId(id) {
    localStorage.setItem("opposite_id", id);
}


/**
 * @return (int): the user favorite team id
 */
const myOppositeTeamId = function() {
    return localStorage.getItem("opposite_id");
}


/**
 * @return (int): the user favorite team id
 */
const myFavoriteTeamId = function() {
    return localStorage.getItem("id");
}

/**
 * Locally Store all team
 * @param teams (Array of team): the array of team to stringify
 */
function locallyStoreTeams(teams) {
    localStorage.removeItem("teams")
    localStorage.setItem("teams", JSON.stringify(teams));
}

/**
 * Return All the stored team inside an array of teams
 * @return (Array of team): the parsed array of teams
 */
function teams() {
    return JSON.parse(localStorage.getItem("teams"));
}

/**
 * Return a specific stored team
 * @param id (int): The id of the team to return
 * @return (team): the parsed team at index i of stored teams
 */
function team(id) {

    const teams = JSON.parse(localStorage.getItem("teams"));
    for (let i = 0; i < teams.length; i++) {
        if (teams[i].id == id) {
            return teams[i];
        }
    }
    return null;
}

/**
 * Create the team selector inside an existing teamSelectorCarousel
 * bootstrap carousel for the teams input.
 * This method appends one indicator and one image link for each team in teams
 * @assume #teamSelectorCarousel exists as a main carousel div
 * @assume also the complete carousel's structure exists: i.e
 * we can access the indicators list and the inner div using jQuery on
 * #teamSelectorCarouselIndicators and #teamSelectorCarouselInner id.
 * @param teams (): An array of all teams @see getCleanedTeams
 * @return the #teamSelectorCarousel carrousel
 */
function createTeamSelectorInCarousel(teams) {

    const indicators = $('#teamSelectorCarouselIndicators');
    const inner = $('#teamSelectorCarouselInner');

    for (let i = 0; i < teams.length; i++) {
        const active = i == 0 ? " active" : "";
        indicators.append($('<li data-target="#teamSelectorCarousel" data-slide-to="' + i + '" data-index="'+teams[i].id+'">').addClass(active));
        inner.append($('<a>').addClass("slide carousel-item" + active)
            .append($('<img>').addClass("carousel-img d-block img-fluid").attr('src', teams[i].logo))
            .append($('<div>').addClass("carousel-caption d-none d-md-block")
                .append($('<h3>').addClass("").text(teams[i].name))
            )
        );
    }
    return $('#teamSelectorCarousel').bind('mousewheel', function(e) {
        if (e.originalEvent.wheelDelta / 120 > 0) {
            $(this).carousel('next');
        } else {
            $(this).carousel('prev');
        }
    });
}

/**
 * Create the team selector inside an existing teamSelectorGrid
 * This method create a clickable image grid of 4x8
 * with a random img which is linked to an existing teamSelectorCarousel
 * @assume #teamSelectorGrid exists as a main grid div
 * @assume #teamSelectorCarousel exists as a main carousel div
 * @assume also the complete carousel's structure exists: i.e
 * we can access the indicators list and the inner div using jQuery on
 * #teamSelectorCarouselIndicators and #teamSelectorCarouselInner id.
 * @param teams (): An array of all teams @see getCleanedTeams
 * @return the #teamSelectorGrid div
 */
function createTeamSelectorInGrid(teams) {
    const $grid = $('<table align="center">');
    for (let row = 0; row < 4; row++) {
        $row = $('<tr>');
        for (let col = 0; col < 8; col++) {
            const i = row * 8 + col - 1;
            if (i < 0) {
                $row.append($("<td>")
                    .append($('<input type="image">').addClass("grid-img").attr('src', "logos/random_team_logo.svg")
                        .click(function() {
                            const r = Math.floor(Math.random() * 31);
                            $('#teamSelectorCarousel').carousel(r)
                        }))
                );
            } else {
                $row.append($("<td>")
                    .append($('<input type="image">').addClass("grid-img").attr('src', teams[i].logo)
                        .click(function() {
                            $('#teamSelectorCarousel').carousel(i)
                        }))
                );
            }
        }
        $grid.append($row);
    }
    return $('#teamSelectorGrid').append($grid);
}

/*
* Create the spiral SVG element
* @assume Should be called only once in the init phase
*/
function initSpiralSVG(teams) {
  // Get the Spiral SVG and its dimensions
  let spiralSVG = $('#spiralSVG');
  let spiralG = d3.select('#spiralG');
  const width = spiralSVG.width();
  const height = spiralSVG.height();

  // Get the start of the spiral
  const cx = width / 2;
  const cy = height / 2;

  let spiral_data = computeSpiralData(teams, width, height)

  // Construct iterativelly all the pills from the center
  let patternSelector = spiralG.append('svg:defs').selectAll("defs")
            .data(spiral_data)
            .enter()
              .append('svg:pattern')
              .attr("id", function(d) { return "pattern" + d.team.id;} )
              .attr("width", d => 1)
              .attr("height", d => 1);

  patternSelector.append("ellipse")
      .attr("id", function(d) { return "ellipse"+d.team.id; })
      .attr("cx", function(d) { return d.r; })
      .attr("cy", function(d) { return d.r; })
      .attr("rx", function(d) { return d.r; })
      .attr("ry", function(d) { return d.r; })
      .style("fill", function(d) { return d.team.color; })
      .style("stroke", function(d) { return myFavoriteTeamId() == d.team.id ? blueSelectorColor : redSelectorColor; })
      .style("stroke-width",  function(d) { return  myFavoriteTeamId() == d.team.id || myOppositeTeamId() == d.team.id ? 12:0; });

  patternSelector.append("svg:image")
        .attr("id", function(d) { return "circle_image"+d.team.id; })
        .attr("xlink:href", function(d) { return d.team.logo })
        .attr("width", function(d) { return d.s; })
        .attr("height", function(d) { return d.s; })
        .attr("x", function(d) { return (d.s - d.r) / 2; })
        .attr("y", function(d) { return (d.s - d.r) / 2; })

    let circle = spiralG.selectAll("circle")
         .data(spiral_data)
         .enter()
         .append("circle")
         .attr("id", function(d) { return "circle"+d.team.id; })
         .attr("cx", function(d) { return d.x; })
         .attr("cy", function(d) { return d.y; })
         .attr("r", function(d) { return d.r; })
         .style("fill", function(d) { return "url(#pattern" + d.team.id + ")"; })
         .on("mouseenter", function(d) {
             d3.selectAll("#circle"+d.team.id).transition()
                 .duration(200)
                 .attr("cx", function(d) { return d.x + d.nx * 20; })
                 .attr("cy", function(d) { return d.y + d.ny * 20; })
             $('#teamName').html(d.team.name)
         })
         .on("mouseleave", function(d) {
             d3.selectAll("#circle"+d.team.id).transition()
                 .duration(800)
                 .attr("cx", function(d) {return d.x})
                 .attr("cy", function(d) {return d.y})
             $('#teamName').html("");
         })
         .on("click", function(d) {
             if (d.team.id != myFavoriteTeamId()) {
               locallyStoreOppositeTeamId(d.team.id)
               draw(teams, false)
             }
         })

  draw(cleanedTeams);
}



/**
* Create the Miniature-FullScreen transition between
* the left and right panels.
* Call the @see placeTeam and @see drawSpiral function periodiacally
* during transition
* @assume rightPanel and leftPanel exists
*/
function createMainTransition() {

    const rightPl = $('#rightPanel');
    const leftPl = $('#leftPanel');

    rightPl.click(function() {
        if (leftPl.hasClass("activePanel")) {
            rightPl.animate({
                width: '100%',
                height: '100%',
                top: '0px'
            }, {
                duration: 300,
                step: function() {
                    placeTeam(team(myFavoriteTeamId()));
                },
                complete: function() {
                    rightPl.addClass('activePanel');
                    leftPl.removeClass('activePanel');
                    leftPl.height("40%").width("20%").css({
                        top: '54px'
                    });
                    draw(filterConf(teams()), false)
                }
            });
        }
    });

    leftPl.click(function() {
        if (rightPl.hasClass("activePanel")) {
            leftPl.animate({
                width: '100%',
                height: '100%',
                top: '0px'
            }, {
                duration: 300,
                step: function() {
                    draw(filterConf(teams()), false)
                },
                complete: function() {
                    leftPl.addClass('activePanel');
                    rightPl.removeClass('activePanel');
                    rightPl.height("40%").width("20%").css({
                        top: '54px'
                    });;
                    placeTeam(team(myFavoriteTeamId()));
                }
            });
        }
    });
}

/**
 * Place the input team Logo at the middle of the SVG obtained with prefix.
 * It addapts the logo size to fit a circle
 * @assume #myTeamSVG or #otherTeamSVG exists as <svg>
 * @assume (#myTeamC and #myTeamL) or (#otherTeamC and #otherTeamL) exists as <circle> and <image>
 * @param team (): the team as a js object @see  teams.legetCleanedTeams
 * @return void:
 */
function placeTeam(team_) {

    const teamSVG = $('#myTeamSVG');

    // Get the current SVG dimensions
    const width = teamSVG.width();
    const height = teamSVG.height();

    // Compute the circle radius and center from container dimensions
    const r = Math.min(width, height) / 4;
    const rCorr = r / 2;
    const cx = width / 2;
    const cy = height / 2;

    if (team_ != null && myOppositeTeamId() != null) {
        // Compute the Logo dimension and
        const s = r + rCorr;

        d3.select('#myTeamDoubleRainbow').selectAll("path").remove();
        d3.select('#myTeamDoubleRainbow').selectAll("defs").remove();

        //TODO can precompute this once
        function getArcGen(inner, outer) {
            return d3.arc()
                .innerRadius(inner)
                .outerRadius(outer)
                .startAngle(function(d) {
                  return d.startAngleOfMyArc;
                })
                .endAngle(function(d) {
                  return d.endAngleOfMyArc;
                });
          }

          let arcGen = getArcGen(0, r)

          let arcData1 = [
            {startAngleOfMyArc: Math.PI + Math.PI/4, endAngleOfMyArc: 2 * Math.PI + Math.PI / 4}
          ];

          let arcData2 = [
            {startAngleOfMyArc: Math.PI/4, endAngleOfMyArc: Math.PI + Math.PI/4},
          ];

          let def1 = d3.select('#myTeamDoubleRainbow').select("#t1").append('defs')
          let pattern = def1.append("svg:pattern")
          .attr("id", "teamlogo1")
          .attr("width", 1)
          .attr("height", 1);

          pattern.append("circle")
              .attr("cx", r)
              .attr("cy", r)
              .attr("r", r)
              .style("fill", team_.color);

          pattern.append("svg:image")
              .attr("xlink:href", team_.logo)
              .attr("width", s)
              .attr("height", s)
              .attr("x", (s - r) / 2)
              .attr("y", (s - r) / 2);

          let def2 = d3.select('#myTeamDoubleRainbow').select("#t2").append('defs')
          let pattern2 = def2.append("svg:pattern")
          .attr("id", "teamlogo2")
          .attr("width", 1)
          .attr("height", 1)

          pattern2.append("circle")
              .attr("cx", r)
              .attr("cy", r)
              .attr("r", r*2)
              .style("fill", team(myOppositeTeamId()).color);

          pattern2.append("svg:image")
              .attr("xlink:href", team(myOppositeTeamId()).logo)
              .attr("width", s)
              .attr("height", s)
              .attr("x",  -9)
              .attr("y",  -9);

           d3.select('#t1')
             .selectAll('path')
             .data(arcData1)
             .enter()
             .append('path')
             .attr('d', arcGen)
             .attr("fill", "url(#teamlogo1)")
             .attr("transform","translate("+cx+","+cy+")");

           d3.select('#t2')
             .selectAll('path')
             .data(arcData2)
             .enter()
             .append('path')
             .attr('d', arcGen)
             .attr("fill", "url(#teamlogo2)")
             .attr("transform","translate("+cx+","+cy+")");

           drawChart(team);

    } else {
        if (WARNING) console.log("Team is null !")
    }

}


function computeSpiralData(teams, width, height) {
  // Get the start of the spiral
  const cx = width / 2;
  const cy = height / 2;

  // Get the number of team, the minimum radius of each pills and a
  // resizing factor.
  const teamNumber = teams.length;

  // Probably need to be computated in a clever way
  const minSize = 28;
  const sizeFactor = Math.min(width / 1100, 1);

  // Spiral parameters
  const a = 0;
  const b = Math.min(30, width / 40)
  const step = Math.PI / 100;

  // Set initial position (and rotation) of the sprial
  let oldTheta = 0;
  let oldR = 0;
  let oldX = cx;
  let oldY = cy;

  let spiral_data = []
  // Create the point data array
  for (let i = teamNumber - 1; i >= 0; i--) {
     const team = teams[i];
     const teamPoint = team.point;

     const r = (minSize + teamNumber - i) * sizeFactor;
     const d = (r + oldR) * (r + oldR);
     let x = oldX;
     let y = oldY;
     let theta = oldTheta;
     while ((oldX - x) * (oldX - x) + (oldY - y) * (oldY - y) - d < 0) {
         theta = theta + step;
         x = cx -b * theta * Math.cos(theta + a);
         y = cy +b * theta * Math.sin(theta + a);
     }

     const norm = Math.sqrt((x-cx)*(x-cx) + (y-cy)*(y-cy));
     const nx = (x-cx)/norm;
     const ny = (y-cy)/norm;

     const rCorr = r / 2;
     const s = r + rCorr;

     index = -i + teamNumber - 1
     spiral_data[index] = {'team': team, 'x':x, 'y':y, 'r':r, 's':s, 'rCorr':rCorr, 'nx':nx, 'ny':ny}

     // Update the previous value
    oldTheta = theta;
    oldR = r;
    oldX = x;
    oldY = y;
  }

  return spiral_data;
}

/**
 * Draw a "logo team" tunnel spiral in corresponding SVG
 * @assume #spiralSVG exists as a <svg> in html
 * @assume the teams_ are sorted in decreasing number of point
 * @param teams_: data
 * @param shouldTransit: boolean telling if transition should be enabled when drawing the new spiral
 */
function drawSpiral(teams_, shouldTransit) {

    // Get the Spiral SVG and its dimensions
    let spiralSVG = $('#spiralSVG');
    let spiralG = d3.select('#spiralG');
    const width = spiralSVG.width();
    const height = spiralSVG.height();

    const cx = width / 2;
    const cy = height / 2;

    //transition time TODO fine tune value
    let t_time = 2250

    //Compute new points
    let newSpiralPoint = computeSpiralData(teams_, width, height);

    //Sets everything to invisible, selected team will have a new transition set
    spiralG.selectAll("circle").transition()
                    .duration(t_time/3).style('opacity', 0);
    spiralG.selectAll("ellipse").transition()
                    .duration(t_time/3).style('opacity', 0);
    spiralG.selectAll("circle_image").transition()
                    .duration(t_time/3).style('opacity', 0);

    if (shouldTransit) {
      //Trick to remove the mouseenter that trigger transitions while we play the main transition of the circles
      d3.selectAll("circle")
        .on("mouseenter", function() {
        })
        .on("mouseleave", function() {
        })
        .on("click", function() {
        })

      //Might be a way to do this with an .data().enter()?
      for (let i = 0; i < teams_.length; i++) {
          //Check if we should draw this team or if it is not in the conf/division
              let d = newSpiralPoint[i]
              d3.select("#circle"+d.team.id)
                .transition()
                .duration(t_time)
                .attr("cx", d.x)
                .attr("cy", d.y)
                .attr("r", d.r)
                .style('opacity', 1)
                .on("end", function() {

                  d3.select(this)
                  .on("mouseenter", function() {
                      d3.select(this).transition()
                          .duration(200)
                          .attr("cx", d.x + d.nx * 20)
                          .attr("cy", d.y + d.ny * 20)
                      $('#teamName').html(d.team.name)
                  })
                  .on("mouseleave", function() {
                      d3.select(this).transition()
                          .duration(800)
                          .attr("cx", d.x)
                          .attr("cy", d.y)
                      $('#teamName').html("");
                  }).on("click", function() {
                             if (d.team.id != myFavoriteTeamId()) {
                               locallyStoreOppositeTeamId(d.team.id)
                               draw(teams_, false)
                             }
                   })
                   // Be sure to call it only once
                   if(i == teams_.length-1){
                       sliderAnim.moveSliderRight();
                   }
                })

              d3.select("#ellipse"+d.team.id)
                .transition()
                .duration(t_time)
                .attr("cx",  d.r)
                .attr("cy", d.r)
                .attr("rx", d.r)
                .attr("ry", d.r)
                .style('opacity', 1)
                .style("fill",  d.team.color)
                .style("stroke", myFavoriteTeamId() == d.team.id ? blueSelectorColor : redSelectorColor)
                .style("stroke-width",  myFavoriteTeamId() == d.team.id || myOppositeTeamId() == d.team.id ? 15:0);

              d3.select("#circle_image"+d.team.id)
                .transition()
                .duration(t_time)
                .attr("width", d.s)
                .attr("height", d.s)
                .style('opacity', 1)
                .attr("x", (d.s - d.r) / 2)
                .attr("y", (d.s - d.r) / 2)


          }
      } else {

        //d3.selectAll("circle").interrupt();
        //d3.selectAll("ellipse").interrupt();
        //d3.selectAll("image").interrupt();

        for (let i = 0; i < teams_.length; i++) {
          let d = newSpiralPoint[i]

          //First cancel all pending transition
          d3.select("#circle"+d.team.id).interrupt();
          d3.select("#ellipse"+d.team.id).interrupt();
          d3.select("#circle_image"+d.team.id).interrupt();

          d3.select("#circle"+d.team.id)
            .attr("cx", d.x)
            .attr("cy", d.y)
            .attr("r", d.r)
            .style('opacity', 1)
            .on("mouseenter", function() {
                d3.select(this).transition()
                    .duration(200)
                    .attr("cx", d.x + d.nx * 20)
                    .attr("cy", d.y + d.ny * 20)
                $('#teamName').html(d.team.name)
            })
            .on("mouseleave", function() {
              d3.select(this).transition()
                    .duration(800)
                    .attr("cx", d.x)
                    .attr("cy", d.y)
                $('#teamName').html("")
            }).on("click", function() {
                     if (d.team.id != myFavoriteTeamId()) {
                       locallyStoreOppositeTeamId(d.team.id)
                       draw(teams_, false)
                     }
                 })

          d3.select("#ellipse"+d.team.id)
            .attr("cx",  d.r)
            .attr("cy", d.r)
            .attr("rx", d.r)
            .attr("ry", d.r)
            .style('opacity', 1)
            .style("fill",  d.team.color)
            .style("stroke", myFavoriteTeamId() == d.team.id ? blueSelectorColor : redSelectorColor)
            .style("stroke-width",  myFavoriteTeamId() == d.team.id || myOppositeTeamId() == d.team.id ? 15:0);

          d3.select("#circle_image"+d.team.id)
            .attr("width", d.s)
            .attr("height", d.s)
            .attr("x", (d.s - d.r) / 2)
            .attr("y", (d.s - d.r) / 2)
            .style('opacity', 1)

          }
      }
}

const sliderAnim = {
    slider: $("#timeSliderInput"),
    isAnimPlay: false,
    toggleSliderAnim: function (){
        this.isAnimPlay = !this.isAnimPlay;
        this.moveSliderRight();
    },
    pauseAnim: function(){
        this.isAnimPlay = false;
    },
    sliderAnimIsPlay: function(){
        return isAnimPlay;
    },
    moveSliderRight: function(){
        if(this.isAnimPlay){
            const value = this.slider.slider('getValue');
            const maxValue = this.slider.slider('getAttribute', 'max');
            console.log(maxValue);
            const newValue = value == maxValue ? 1: value+1;
            this.slider.slider('setValue', newValue, false, true);
        }
    }
}

// Is called when the document is ready
function init() {

    if (MESSAGE) console.log("Document is Ready");

    $("#teamSelection").on("hidden.bs.modal", function() {
        const index = $('#teamSelectorCarousel li.active').attr('data-index');
        locallyStoreFavoriteTeamId(index);
        draw(teams());
    });

    // Create the main transition
    createMainTransition();

    // Everyting will be inside a SVG html element
    // Initialize myTeamSVG and myTeamG
    const myTeamG = d3.select("#myTeam")
        .append('svg')
        .attr("id", "myTeamSVG")
        .append("g")
        .attr("id", "myTeamG");

    // for cool stacked logo in half circles
    d3.select("#myTeamSVG")
        .append('svg')
        .attr("id", "myTeamDoubleRainbow")

    d3.select("#myTeamDoubleRainbow")
        .append("g")
        .attr("id", "t1");

    d3.select("#myTeamDoubleRainbow")
        .append("g")
        .attr("id", "t2");

    // Initialize spiral
    d3.select("#leftPanel")
        .append("svg")
        .attr("id", "spiralSVG")
        .append("g")
        .attr("id", "spiralG");

    // NHL opens the 4th october 2017 this season !
    const championshipStartDate = new Date(2017, 9, 4); // TODO maybe not hardcoded this value here ?
    const today = new Date();
    const diffDays = Math.floor((today.getTime() - championshipStartDate.getTime()) / (1000 * 3600 * 24));

    $("#timeSliderInput")
        .slider({
            id: "timeSlider",
            min: 0,
            max: diffDays,
            value: diffDays,
            steps: 1,
            tooltip: 'always',
            formatter: function(value) {
                const date = new Date(championshipStartDate.valueOf());
                date.setDate(date.getDate() + value);
                return date.toDateString();
            }
        });

    $('#timeSliderInput').on({
        change: function(ui) {
            console.log("MMM")
            if (ui.value != null) {
                let newSliderVal = ui.value['newValue']
                const date = new Date(championshipStartDate.valueOf());
                date.setDate(date.getDate() + newSliderVal);

                const mm = date.getMonth() + 1; // getMonth() is zero-based
                const dd = date.getDate();
                const yyyy = date.getFullYear();

                dateString = yyyy + "-" + mm + "-" + dd
                sessionStoreDate(dateString);
                reloadAndDraw(dateString, true);
            }
        },
        slideStart: function(ui){
            sliderAnim.pauseAnim();
            const button = $('#playResume');
            button.removeClass('pauseButton');
            button.addClass('playButton');
        }
    });



    $('#timeSliderInput').trigger('change');

    $(".selectpicker").on({
        change: function() {
            reloadAndDraw(chosenDate(), true);
        }
    })

    $('#playResume').click(function(e){
        const button = $(this);

        if(button.hasClass("playButton")){
            button.removeClass('playButton');
            button.addClass('pauseButton');
        }else{
            button.removeClass('pauseButton');
            button.addClass('playButton');
        }
        sliderAnim.toggleSliderAnim();
    });


    const today_string = today.getYear() + "-" + today.getMonth() + "-" + today.getDay();
    sessionStoreDate(today_string);

    //Setup teamSelectorGrid and other elements that need data once
    loadedData = loadNHLData(today_string);
    loadedData.done(function(response) {
        cleanedTeams = getCleanedTeams(response);
        // Store locally the teams values
        locallyStoreTeams(cleanedTeams);

        teamSelectorCarousel = createTeamSelectorInCarousel(cleanedTeams);
        teamSelectorGrid = createTeamSelectorInGrid(cleanedTeams)

        // Draw initial spiral
        initSpiralSVG(cleanedTeams)

        draw(cleanedTeams, false)

      });
}

/*
* Filter cleanedTeam with conference or division selector
* @return only teams that are in either nhl/division/conferece
*/
function filterConf(data) {
    if  (myFavoriteTeamId() == null) {
      return data
    }

    let current_conf = team(myFavoriteTeamId()).conference
    let current_division = team(myFavoriteTeamId()).division

    //0 = NHl, 1=Conference, 2=Division
    let selected_val = $( ".selectpicker option:selected" ).val()

    if (selected_val == 1) {
      return data.filter( function(team) {
          return team.conference == current_conf;
      });
    } else if (selected_val == 2) {
      return data.filter( function(team) {
          return team.division == current_division;
      });
    }

    return data;
}


// Load Data and Draw UI
function reloadAndDraw(date, shouldTransit) {
    // Load the teams using ajax
    loadedData = loadNHLData(date);
    // Parse and clean the data into an array
    loadedData.done(function(response) {
            teams_clean = getCleanedTeams(response);
            locallyStoreTeams(teams_clean);

            filteredTeams = filterConf(teams_clean);
            draw(filteredTeams, shouldTransit);
            drawChart(team[myFavoriteTeamId()]);
        }

    ).fail(console.log("data not yet loaded"))
}


/**
* Draw complete UI
* using @see placeTeam and @see drawSpiral functions.
*/
function draw(teamsToDraw, shouldTransit) {
    // Place myTeamG in a dynamic way
    placeTeam(team(myFavoriteTeamId()));
    // Place spiralG in a dynamic way.
    drawSpiral(filterConf(teamsToDraw), shouldTransit);
}


/**
*Draw circle chart for stat comparison
*using @see team() , @see myFavoriteTeamId() and @see myOppositeTeamId()
*/
function drawChart(){

  //If favorite team chosen make a deep copy for drawing the chart
  myTeam = team(myFavoriteTeamId()) != null ? jQuery.extend(true, {}, team(myFavoriteTeamId())) : null;


  if(myTeam!=null){
     d3.select('#myTeamG').selectAll("path").remove();
     d3.selectAll('.tooltipChart').remove()
     d3.select('#myTeamG').selectAll('text').remove();

    visualizationMode = "stack"; //available modes : stack / adjacent

    const svg = $('#myTeamSVG');

    const width = svg.width();
    const height = svg.height();

    const r = Math.min(width, height) / 4;
    const arcWidth = (1/60)*height;
    const padding = (1/5)*arcWidth;

    let tooltip = d3.select('body').append('div')
        .attr('class', 'tooltipChart');

    //make deep copy of oppositeTeam
    oppositeTeam = team(myOppositeTeamId())!=null ? jQuery.extend(true, {}, team(myOppositeTeamId())) : null;

    //load reformated data
    teamsArray = teamsToArray(filterTeamFields(myTeam), filterTeamFields(oppositeTeam));

    dataLabels = removeDuplicates(teamsArray.map((d,i)=>d.stat));
    dataOffsets = teamsArray.map((d,i)=>d.offset);
    dataValues = teamsArray.map((d,i)=>d.value);

    let arc = d3.arc()
      .innerRadius((d,i)=>computeInnerRadius(visualizationMode == "adjacent" ? d.index : i))
      .outerRadius((d,i)=>computeOuterRadius(visualizationMode == "adjacent" ? d.index : i))
      .startAngle((d,i)=>computeAngle(d.offset))
      .endAngle((d,i)=>computeAngle(d.offset)+computeAngle(d.value));


    let arcs = d3.select('#myTeamG')
    .selectAll('path')
      .data(teamsArray)
      .enter().append("svg:path")
      .attr("d",arc)
      .attr("transform","translate("+width/2+","+height/2+")")
      .style("fill", (d,i)=> d.color)

    //console.log(arcs);
    /*arcs.transition()
      .delay((d,i)=>i*200)
      .duration(1000)
      .attrTween('d', (d,i)=>{
        console.log(d)
        let interpolator = d3.interpolate(0, d.value);
        return t =>{
          d1 = [{value : interpolator(t).toString(), stat : d.stat, color : d.color, index : d.index, offset : d.offset},]
          console.log(d1)
          arc(d1,i);
        }
      });*/
    let labels = d3.select('#myTeamG')
    .selectAll('text')
    .data(dataLabels)
    .enter()
      .append('text')
      .text((d,i)=>d)
      .style('fill', 'white')
      .style('font-size', "12px")
      .attr("transform",(d,i)=>("translate("+(width/2-20+","+(height/2-computeOuterRadius(2*i)+2.5)+")")));

    arcs.on('mouseenter', showTooltip)
        .on('mouseout', hideTooltip);


//DRAW CHART HELPER FUNCTIONS
function arcTween(d,i){
  let interpolator = d3.interpolate(0, d.value);
  return t =>{
    d1 = [{"value" : interpolator(t).toString(), "stat" : d.stat, "color" : d.color, "index" : d.index, "offset" : d.offset},]
    arc(d1,i);
  }
}

//Used for removing duplicate stat labels in dataLabels array
function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array
}

    /**
    * Compute inner radius of arc based on stat values
    */
    function computeInnerRadius(index) {
      if(visualizationMode == "adjacent"){
        return r+padding+index*(arcWidth);
      }else{
        pad = index % 2 == 0 || oppositeTeam==null ? padding : 0;
        return r+pad+padding+index*(arcWidth);
      }
    }

    /**
    * Compute outer radius of arc based on stat values
    */
    function computeOuterRadius(index) {
      if(visualizationMode == "adjacent"){
        return r+arcWidth+index*(arcWidth);
      }else{
        pad = index % 2 == 0 && oppositeTeam!=null ? padding : 0;
        return r+arcWidth+pad+index*(arcWidth);
      }
    }

    /**
    * Compute arc angle based on stat values
    */
    function computeAngle(value){
      return (1/200)*value*(10/6)*Math.PI;
    }

    /**
    * display tooltip on mouse hover
    */
    function showTooltip(d) {
      tooltip.style('left', (d3.event.pageX + 10) + 'px')
        .style('top', (d3.event.pageY - 25) + 'px')
        .style('display', 'inline-block')
        .html(d.stat+" : "+d.value);
    }

    /**
    * hide tooltip on mouse out
    */
    function hideTooltip() {
      tooltip.style('display', 'none');
    }

    /**
    * Reformat team data for chart drawing
    */
    function teamsToArray(d, dOpposite){
      if(dOpposite!=null)
      {
        if(visualizationMode == "adjacent"){
          return [
            {"value" : d.point < dOpposite.point ? d.point : dOpposite.point, "stat" : "Pts", "color" : d.point < dOpposite.point ? d.color : dOpposite.color, "index" : "0", "offset" : "0"},
            {"value" : d.point < dOpposite.point ? dOpposite.point - d.point : d.point - dOpposite.point, "stat" : "Pts", "color" : d.point < dOpposite.point ? dOpposite.color : d.color, "index" : "0", "offset" : d.point < dOpposite.point ? d.point : dOpposite.point},
            {"value" : d.teamGoalScored < dOpposite.teamGoalScored ? d.teamGoalScored : dOpposite.teamGoalScored, "stat" : "GF", "color" : d.teamGoalScored < dOpposite.teamGoalScored ? d.color : dOpposite.color, "index" : "1", "offset": "0"},
            {"value" : d.teamGoalScored < dOpposite.teamGoalScored ? dOpposite.teamGoalScored - d.teamGoalScored : d.teamGoalScored - dOpposite.teamGoalScored, "stat" : "GF", "color" : d.teamGoalScored < dOpposite.teamGoalScored ? dOpposite.color : d.color, "index" : "1", "offset" : d.teamGoalScored < dOpposite.teamGoalScored ? d.teamGoalScored : dOpposite.teamGoalScored},
            {"value" : d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.teamGoalAgainst : dOpposite.teamGoalAgainst, "stat" : "GA", "color" :d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.color : dOpposite.color, "index" : "2", "offset" : "0"},
            {"value" : d.teamGoalAgainst < dOpposite.teamGoalAgainst ? dOpposite.teamGoalAgainst - d.teamGoalAgainst : dOpposite.teamGoalAgainst, "stat" : "GA", "color" :d.teamGoalAgainst < dOpposite.teamGoalAgainst ? dOpposite.color : d.color, "index" : "2", "offset" : d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.teamGoalAgainst : dOpposite.teamGoalAgainst},
            {"value" : d.teamWins < dOpposite.teamWins ? d.teamWins : dOpposite.teamWins, "stat" : "W", "color" : d.teamWins < dOpposite.teamWins ? d.color : dOpposite.color, "index" : "3", "offset":"0"},
            {"value" : d.teamWins < dOpposite.teamWins ? dOpposite.teamWins - d.teamWins : d.teamWins - dOpposite.teamWins, "stat" : "W", "color" : d.teamWins < dOpposite.teamWins ? dOpposite.color : d.color, "index" : "3", "offset":d.teamWins < dOpposite.teamWins ? d.teamWins : dOpposite.teamWins},
            {"value" : d.teamLosses < dOpposite.teamLosses ? d.teamLosses : dOpposite.teamLosses, "stat" : "L", "color" : d.teamLosses < dOpposite.teamLosses ? d.color : dOpposite.color, "index" : "4", "offset":"0"},
            {"value" : d.teamLosses < dOpposite.teamLosses ? dOpposite.teamLosses - d.teamLosses : d.teamLosses - dOpposite.teamLosses, "stat" : "L", "color" : d.teamLosses < dOpposite.teamLosses ? dOpposite.color : d.color, "index" : "4", "offset":d.teamLosses < dOpposite.teamLosses ? d.teamLosses : dOpposite.teamLosses},
          ]
        }else{
          return [
            {"value" : d.point, "stat" : "Pts", "color" : d.color, "index" : "0", "offset" : "0"},
            {"value" : dOpposite.point, "stat" : "Pts", "color" : dOpposite.color, "index" : "0", "offset" : "0"},
            {"value" : d.teamGoalScored, "stat" : "GF", "color" : d.color, "index" : "1", "offset" : "0"},
            {"value" : dOpposite.teamGoalScored, "stat" : "GF", "color" : dOpposite.color, "index" : "1", "offset" : "0"},
            {"value" : d.teamGoalAgainst, "stat" : "GA", "color" : d.color, "index" : "2", "offset" : "0"},
            {"value" : dOpposite.teamGoalAgainst, "stat" : "GA", "color" : dOpposite.color, "index" : "2", "offset" : "0"},
            {"value" : d.teamWins, "stat" : "W", "color" : d.color, "index" : "3", "offset" : "0"},
            {"value" : dOpposite.teamWins, "stat" : "W", "color" : dOpposite.color, "index" : "3", "offset" : "0"},
            {"value" : d.teamLosses, "stat" : "L", "color" : d.color, "index" : "4", "offset" : "0"},
            {"value" : dOpposite.teamLosses, "stat" : "L", "color" : dOpposite.color, "index" : "4", "offset" : "0"}
          ]
        }
      }else{
        return [
          {"value" : d.point, "stat" : "Pts", "color" : d.color, "index" : "0", "offset" : "0"},
          {"value" : d.teamGoalScored, "stat" : "GF", "color" : d.color, "index" : "1", "offset" : "0"},
          {"value" : d.teamGoalAgainst, "stat" : "GA", "color" : d.color, "index" : "2", "offset" : "0"},
          {"value" : d.teamWins, "stat" : "W", "color" : d.color, "index" : "3", "offset" : "0"},
          {"value" : d.teamLosses, "stat" : "L", "color" : d.color, "index" : "4", "offset" : "0"}
        ]
      }
    }

    /**
    * Filter out useless team data fields for chart drawing
    */
    function filterTeamFields(d){
      if(d!=null){
        delete d.name;
        delete d.logo;
        delete d.conference;
        delete d.division;
        delete d.id;
      }
      return d;
    }
  }
}

// When the window is resized
$(window).resize(
    function() {
        draw(teams(), false);
    }
)
