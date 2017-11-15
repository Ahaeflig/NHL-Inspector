/**
* nhlInspector.js
* @author Bastien Chatelain, Adan Häfliger, Ismail Imani
*/
// Console print flags
const MESSAGE = true;
const DEBUG = true;
const WARNING = true
const ERROR = true;

const LOGO_DICT = {
  "Washington Capitals" : "logos/Washington_Capitals_logo.svg",
  "New Jersey Devils" : "logos/New_Jersey_Devils_logo.svg",
  "Columbus Blue Jackets" : "logos/Columbus_Blue_Jackets_logo.svg",
  "Philadelphia Flyers" : "logos/Philadelphia_Flyers_logo.svg",
  "Carolina Hurricanes" : "logos/Carolina_Hurricanes_logo.svg",
  "New York Islanders" : "logos/New_York_Islanders_logo.svg",
  "Pittsburgh Penguins" : "logos/Pittsburgh_Penguins_logo.svg",
  "New York Rangers" : "logos/New_York_Rangers_logo.svg",
  "Toronto Maple Leafs" : "logos/Toronto_Maple_Leafs_logo.svg",
  "Tampa Bay Lightning" : "logos/Tampa_Bay_Lightning_logo.svg",
  "Detroit Red Wings" : "logos/Detroit_Red_Wings_logo.svg",
  "Ottawa Senators" : "logos/Ottawa_Senators_logo.svg",
  "Boston Bruins" : "logos/Boston_Bruins_logo.svg",
  "Florida Panthers" : "logos/Florida_Panthers_logo.svg",
  "Montréal Canadiens" : "logos/Montreal_Canadiens_logo.svg",
  "Buffalo Sabres" : "logos/Buffalo_Sabres_logo.svg",
  "St. Louis Blues" : "logos/St_Louis_Blues_logo.svg",
  "Chicago Blackhawks" : "logos/Chicago_Blackhawks_logo.svg",
  "Colorado Avalanche" : "logos/Colorado_Avalanche_logo.svg",
  "Nashville Predators" : "logos/Nashville_Predators_logo.svg",
  "Winnipeg Jets" : "logos/Winnipeg_Jets_logo.svg",
  "Dallas Stars" : "logos/Dallas_Stars_logo.svg",
  "Minnesota Wild" : "logos/Minnesota_Wild_logo.svg",
  "Vegas Golden Knights" : "logos/Vegas_Golden_Knights_logo.svg",
  "Los Angeles Kings" : "logos/Los_Angeles_Kings_logo.svg",
  "Calgary Flames" : "logos/Calgary_Flames_logo.svg",
  "Vancouver Canucks" : "logos/Vancouver_Canucks_logo.svg",
  "Anaheim Ducks" : "logos/Anaheim_Ducks_logo.svg",
  "Edmonton Oilers" : "logos/Edmonton_Oilers_logo.svg",
  "Arizona Coyotes" : "logos/Arizona_Coyotes_logo.svg",
  "San Jose Sharks" : "logos/San_Jose_Sharks_logo.svg"
}


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
function loadNHLData(){

    return $.getJSON(
    {
      type: "GET",
  		url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018&date=2017-10-10'
    });

}


/**
* Locally store the id of the user favorite team
* @param id (int): the id to store
*/
function locallyStoreFavoriteTeamId(id){
    localStorage.setItem("id", id);
}

/**
* @return (int): the user favorite team id
*/
const myFavoriteTeamId = function(){
    return localStorage.getItem("id");
}

/**
* Locally Store all team
* @param teams (Array of team): the array of team to stringify
*/
function locallyStoreTeams(teams){
    localStorage.setItem("teams", JSON.stringify(teams));
}

/**
* Return All the stored team inside an array of teams
* @return (Array of team): the parsed array of teams
*/
function teams(){
    return JSON.parse(localStorage.getItem("teams"));
}

/**
* Return a specific stored team
* @param id (int): The id of the team to return
* @return (team): the parsed team at index i of stored teams
*/
function team(id){
    return JSON.parse(localStorage.getItem("teams"))[id];
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

    for (let i = 0; i< teams.length; i++) {

        const active = i == 0 ? " active" : "";
        indicators.append($('<li data-target="#teamSelectorCarousel" data-slide-to="'+i+'">').addClass(active));
        inner.append($('<a>').addClass("carousel-item"+active)
            .append($('<img>').addClass("carousel-img d-block img-fluid").attr('src',teams[i].logo))
            .append($('<div>').addClass("carousel-caption d-none d-md-block")
                .append($('<h3>').addClass("").text(teams[i].name))
            )
        );
    }
    return $('#teamSelectorCarousel')
}

/**
* Place the input team Logo at the middle of the SVG obtained with prefix.
* It addapts the logo size to fit a circle
* @assume #myTeamSVG or #otherTeamSVG exists as <svg>
* @assume (#myTeamC and #myTeamL) or (#otherTeamC and #otherTeamL) exists as <circle> and <image>
* @param prefix (String): contains the SVG id prefix (i.e "my" or "other")
* @param team (): the team as a js object @see getCleanedTeams
* @return void:
*/
function placeTeam(prefix, team){

    const teamSVG = $('#'+prefix+'TeamSVG');

    // Get the current SVG dimensions
    const width = teamSVG.width();
    const height = teamSVG.height();

    // Compute the circle radius and center from container dimensions
    const r = Math.min(width, height)/4;
    const rCorr = r/2;
    const cx = width/2;
    const cy = height/2;

    if(team != null){
        // Update the circle position and size
        d3.select("#"+prefix+"TeamC")
            .attr("cx", cx)
            .attr("cy", cy)
            .attr("r", r);

        // Compute the Logo dimension and position
        const s = r+rCorr;
        d3.select("#"+prefix+"TeamL")
            .attr("width", s)
            .attr("height", s)
            .attr("x", cx - s/2)
            .attr("y", cy - s/2)
            .attr("xlink:href", team.logo);
    }else{
        if(WARNING) console.log(prefix+"Team is null !")
    }
}

/**
* Draw a "logo team" tunnel spiral in corresponding SVG
* @assume #spiralSVG exists as a <svg> in html
* @assume the teams are sorted in decreasing number of point
* @param teams:
* @return void:
*/
function drawSpiral(teams){

    // Get the Spiral SVG and its dimensions
    const spiralSVG = $('#spiralSVG');
    const width = spiralSVG.width();
    const height = spiralSVG.height();

    // Get the start of the spiral
    const cx = width/5 ;
    const cy = height/2;

    // Get the number of team, the minimum radius of each pills and a
    // resizing factor.

    const teamNumber = teams.length;
    //const teamNumber = 3;

    // Probably need to be computated in a clever way
    const minSize = 20;
    const sizeFactor = 1;

    // Set initial position (and rotation) of the sprial
    let oldTheta = -Math.PI/2;
    let oldR = 0;
    let oldX = cx;
    let oldY = cy;

    // Construct iterativelly all the pills
    const pills = [];

    for (let i = 0; i < teamNumber; i++){

        // For now the number of point of a team is define by its position in the list
        // TODO use instead team[i].points or something similar
        const teamPoint = (teamNumber-i);

        // Compute position of the pill and its logo and push the pill
        const theta = oldTheta + Math.PI/10;
        const r = (minSize+teamPoint)*sizeFactor;
        const x = oldX + (oldR+r)*Math.cos(theta);
        const y = oldY + (oldR+r)*Math.sin(theta);
        const rCorr = r/2;
        const s = r+rCorr;

        pills.push({x: x, y: y, r:r, s:s, logo:teams[i].logo, name:teams[i].name, id:teams[i].id});

        // Update the previous value
        oldTheta = theta;
        oldR = r;
        oldX = x;
        oldY = y;
    }

    // Get the spiral graphics
    const spiralG = d3.select("#spiralG")

    var defs = spiralSVG.append("defs");


    spiralG.selectAll("circle").remove();
    spiralG.selectAll("image").remove();

    const test = spiralG.selectAll("circle").data(pills).enter();



var circle = test.append("circle")
        .attr("id", function(d){
          return d.id+"c";
        })
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return d.r; });


    test.selectAll("circle")
        .attr('stroke', 'yellow')
        .attr('stroke-width', 0)
        /*
        .on("mouseenter", function(){
          //console.log("mouseenter");
          d3.select(this)
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("r", function (d) {return d.r*1.5;})
            .attr('stroke-width',5)
          d3.select(function(d){
            return '\x22#'+d.id+'i\x22';
          })
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("width", function (d) {return d.s*1.5;})
            .attr("height", function (d) {return d.s*1.5;})
            .attr("x", function (d) { return d.x - d.s*1.5/2; })
            .attr("y", function (d) { return d.y - d.s*1.5/2; })
        })
        .on("mouseleave", function(){
          //console.log("mouseleave");
          d3.select(this)
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("r", function (d) {return d.r;})
            .attr('stroke-width',0)
          d3.select(function(d){
            return '\x22#'+d.id+'i\x22';
          })
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("width", function (d) {return d.s;})
            .attr("height", function (d) { return d.s;})
            .attr("x", function (d) { return d.x - d.s/2; })
            .attr("y", function (d) { return d.y - d.s/2; })
        })
        //*/
        ;




    test.append("image")
        .attr("id", function(d){
          return d.id+"i";
        })
        .attr("width", function (d) { return d.s;})
        .attr("height", function (d) { return d.s;})
        .attr("x", function (d) { return d.x - d.s/2; })
        .attr("y", function (d) { return d.y - d.s/2; })
        .attr("xlink:href", function (d){ return d.logo; })
        //*
        .on("mouseenter", function(){
          //console.log("mouseenter");
          d3.select(this)
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("width", function (d) { return d.s*2;})
            .attr("height", function (d) { return d.s*2;})
            .attr("x", function (d) { return d.x - d.s*2/2; })
            .attr("y", function (d) { return d.y - d.s*2/2; });

          /*test.append("text")
            .attr("id", function(d){return "t"+d.name})
            .attr("class", "nodetext")
            .attr("x", 40)
            .attr("y", 40)
            .attr("fill", "black")
            .text(function(d){return d.name;console.log(d.name)});*/
          })
          /*
          d3.select(function(d){
            return '\x22#'+d.id+'c\x22';
          })
            .transition()
            //.ease('elastic')
            .duration(200)
            .attr("r", function (d) { return d.r*1.5;})
            .attr('stroke-width',5)
        })

        //*/
        .on("mouseleave", function(){
          //console.log("mouseleave");
          d3.select(this)
              .transition()
              //.ease('elastic')
              .duration(200)
              .attr("width", function (d) { return d.s;})
              .attr("height", function (d) { return d.s;})
              .attr("x", function (d) { return d.x - d.s/2; })
              .attr("y", function (d) { return d.y - d.s/2; });

        //  d3.select(function(d){return "#t"+d.name}).remove();
            })
          /*
          d3.select(function(d){
            return '\x22#'+d.id+'c\x22';
          })
              .transition()
              //.ease('elastic')
              .duration(200)
              .attr("r", function (d) { return d.r;})
              .attr('stroke-width',0)
        })
        //*/
        ;
    /*test.append("text")
      .attr("class", "nodetext")
      .attr("x", 40)
      .attr("y", 40)
      .attr("fill", "black")
      .text(function(d){return d.name});
    //*/
}

/**
* Get and clean some global data from the input data
* @assume data is the output of @see loadNHLData
* @param data (): whole JSON data
* @return the cleaned global data as a JS Object which contains:
*    -TBD
*/
function getCleanedGlobalData(data){

    conferenceData = data.records
    var teams = [];

    //Fill Array with team values
    for (let conf=0; conf < conferenceData.length; ++conf) {
      for (let i=0; i < conferenceData[conf]["teamRecords"].length; ++i) {

          // TODO refactor if needed and chose correct stats
          let teamName = conferenceData[conf]["teamRecords"][i].team.name
          let points = conferenceData[conf]["teamRecords"][i].points
          let gamesPlayed = conferenceData[conf]["teamRecords"][i]["gamesPlayed"]
          let wins = conferenceData[conf]["teamRecords"][i]["leagueRecord"].wins
          let overtime = conferenceData[conf]["teamRecords"][i]["leagueRecord"].ot
          let losses = conferenceData[conf]["teamRecords"][i]["leagueRecord"].losses
          let goalAgainst = conferenceData[conf]["teamRecords"][i].goalsAgainst
          let goalScored = conferenceData[conf]["teamRecords"][i].goalsScored
          let divisionRank = conferenceData[conf]["teamRecords"][i].divisionRank
          let conferenceRank = conferenceData[conf]["teamRecords"][i].conferenceRank
          let leagueRank = conferenceData[conf]["teamRecords"][i].leagueRank
          let wildCardRank = conferenceData[conf]["teamRecords"][i].wildCardRank

          teams.push({
            "name":teamName,
            "logo":LOGO_DICT[teamName],
            "point":points,
            "teamName":teamName,
            "points":points,
            "gamesPlayed":gamesPlayed,
            "wins":wins,
            "overtime":overtime,
            "losses ":losses,
            "goalAgainst":goalAgainst,
            "goalScored ":goalScored,
            "divisionRank":divisionRank,
            "conferenceRank":conferenceRank,
            "leagueRank":leagueRank,
            "wildCardRank":wildCardRank,
          })

      }
    }


    return data;
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
function getCleanedTeams(data){

  conferenceData = data.records
  var teams = [];

  //Fill Array with team values
  for (let conf=0; conf < conferenceData.length; ++conf) {
    for (let i=0; i < conferenceData[conf]["teamRecords"].length; ++i) {
        let teamName = conferenceData[conf]["teamRecords"][i].team.name
        let points = conferenceData[conf]["teamRecords"][i].points
        teams.push({name:teamName, logo:LOGO_DICT[teamName], point:points})
    }
  }

  //Sort array by team points decreasing
  teams.sort(function(a,b) {
    return b.point - a.point;
  });

  return teams;
}


// Is called when the document is ready
function init() {
  if(MESSAGE) console.log("Document is Ready");

  // Load the teams using ajax
  loadedData = loadNHLData();
  // Parse and clean the data into an array

  loadedData.done(function(response) {

    cleanedTeams = getCleanedTeams(response);
    // Construnct the team carousel
    teamSelectorCarousel = createTeamSelectorInCarousel(cleanedTeams);

    // Store locally the teams values
    locallyStoreFavoriteTeamId(-1);
    locallyStoreTeams(cleanedTeams);

    // Everyting will be inside a SVG html element
    // Initialize myTeamSVG and myTeamG
    const myTeamG = d3.select("#myTeam")
    .append('svg')
    .attr("id", "myTeamSVG")
    .append("g")
    .attr("id", "myTeamG");

    // Append the myTeamC circle and the myTeamL logo
    myTeamG.append("circle")
    .attr("id", "myTeamC")
    myTeamG.append("image")
    .attr("id", "myTeamL")
    // Place myTeamG in a dynamic way
    placeTeam("my", team(myFavoriteTeamId()));

    // Initialize otherTeamSVG and oterTeamG
    const otherTeamG = d3.select("#otherTeam")
    .append('svg')
    .attr("id", "otherTeamSVG")
    .append("g")
    .attr("id", "otherTeamG");
    // Append the otherTeamC circle and the otherTeamL logo
    otherTeamG.append("circle")
    .attr("id", "otherTeamC")
    otherTeamG.append("image")
    .attr("id", "otherTeamL")
    // Place otherTeamG in a dynamic way
    placeTeam("other", team(myFavoriteTeamId()));

    // Initialize spiral
    const spiralG = d3.select("#leftPanel")
    .append("svg")
    .attr("id", "spiralSVG")
    .append("g")
    .attr("id", "spiralG");
    // Place spiralG in a dynamic way.
    drawSpiral(teams());

    $("#teamSelection").on("hidden.bs.modal", function () {
      const index = $('#teamSelectorCarousel li.active').attr('data-slide-to');
      locallyStoreFavoriteTeamId(index);
      placeTeam("my", team(index));
    });



    //TEST TODO remove

    cleanedTeams = getCleanedGlobalData(response);

  }

).fail(console.log("failed"))



}


// When the window is resized
$( window ).resize(
    function() {
        if(MESSAGE) console.log("Windows is resized");
        placeTeam("my", team(myFavoriteTeamId()));
        placeTeam("other");
        drawSpiral(teams());
    }
);
