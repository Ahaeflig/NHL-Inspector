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
function loadNHLData(date){

    return $.getJSON(
    {
      type: "GET",
  		url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018&date='+date
    });
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
        let id = conferenceData[conf]["teamRecords"][i].team.id
        teams.push({name:teamName, logo:LOGO_DICT[teamName], point:points, id:id})
    }
  }

  //Sort array by team points decreasing
  teams.sort(function(a,b) {
    return b.point - a.point;
  });

  return teams;
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

    const teams =  JSON.parse(localStorage.getItem("teams"));
    for(let i = 0; i<teams.length; i++){
        if(teams[i].id == id){
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

    for (let i = 0; i< teams.length; i++) {
        const active = i == 0 ? " active" : "";
        indicators.append($('<li data-target="#teamSelectorCarousel" data-slide-to="'+teams[i].id+'">').addClass(active));
        inner.append($('<a>').addClass("slide carousel-item"+active)
            .append($('<img>').addClass("carousel-img d-block img-fluid").attr('src',teams[i].logo))
            .append($('<div>').addClass("carousel-caption d-none d-md-block")
                .append($('<h3>').addClass("").text(teams[i].name))
            )
        );
    }
    return $('#teamSelectorCarousel').bind('mousewheel', function(e) {
        if(e.originalEvent.wheelDelta /120 > 0) {
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
    for(let row = 0; row < 4; row++){
        $row = $('<tr>');
        for(let col = 0; col < 8; col++){
            const i = row*8+col-1;
            if(i < 0){
                $row.append($("<td>")
                    .append($('<input type="image">').addClass("grid-img").attr('src', "logos/random_team_logo.svg")
                        .click(function(){
                            const r = Math.floor(Math.random() * 31);
                            $('#teamSelectorCarousel').carousel(r)
                        }))
                );
            }else{
                $row.append($("<td>")
                    .append($('<input type="image">').addClass("grid-img").attr('src',teams[i].logo)
                        .click(function(){$('#teamSelectorCarousel').carousel(i)}))
                );
            }
        }
        $grid.append($row);
    }
    return $('#teamSelectorGrid').append($grid);
}



/**
* Place the input team Logo at the middle of the SVG obtained with prefix.
* It addapts the logo size to fit a circle
* @assume #myTeamSVG or #otherTeamSVG exists as <svg>
* @assume (#myTeamC and #myTeamL) or (#otherTeamC and #otherTeamL) exists as <circle> and <image>
* @param prefix (String): contains the SVG id prefix (i.e "my" or "other")
* @param team (): the team as a js object @see  teams.legetCleanedTeams
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

    console.log("(W:"+width+", H:"+height+")");

    // Get the start of the spiral
    const cx = width/2 ;
    const cy = height/2;

    // Get the number of team, the minimum radius of each pills and a
    // resizing factor.
    const teamNumber = teams.length;

    // Probably need to be computated in a clever way
    const minSize = 10;
    const sizeFactor = Math.min(width/1100, 1);

    // Spiral parameters
    const a = 0;
    const b =  Math.min(30, width/40)
    const step = Math.PI/100;

    // Set initial position (and rotation) of the sprial
    let oldTheta = 0;
    let oldR = 0;
    let oldX = cx;
    let oldY = cy;

    // Construct iterativelly all the pills from the center
    const pills = [];

    for (let i = teamNumber-1; i >= 0; i--){

        const teamPoint = teams[i].point;

        // Compute position of the pill and its logo and push the pill
        const r = (minSize+teamPoint)*sizeFactor;
        const d = (r+oldR)*(r+oldR);
        let x = oldX;
        let y = oldY;
        let theta = oldTheta;
        // TODO replace the while loop below by the exact theta solution !
        // Need to solve theta^2 -2theta(oldX*cos(theta) +oldY*sin(theta))+oldX^2+oldY^2
        //x = cx + -b*theta*Math.cos(theta+a);
        //y = cy + b*theta*Math.sin(theta+a);
        while((oldX-x)*(oldX-x) + (oldY-y)*(oldY-y) - d < 0){
            theta = theta + step;
            x = cx + -b*theta*Math.cos(theta+a);
            y = cy + b*theta*Math.sin(theta+a);
            // TODO Adan please remove me !
        }

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
        .attr('stroke-width', 0);

    test.append("image")
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

          d3.select(this).append("text")
            .attr("id", function(d){return "t_"+d.id})
            .attr("class", "nodetext")
            .attr("x", function(d) { d.x - 30;})
            .attr("y", function(d) { d.y - 15;})
            .attr("fill", "black")
            .text(function(d){
              console.log(d.id);
              return d.name;
            })
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
              .attr("y", function (d) {return d.y - d.s/2; });

          d3.select(this).selectAll(function(d){console.log("out " + d.id);return "#t_"+d.id;}).remove();
            })

}

// Is called when the document is ready
function init() {

  if(MESSAGE) console.log("Document is Ready");

      $("#teamSelection").on("hidden.bs.modal", function () {
          const index = $('#teamSelectorCarousel li.active').attr('data-slide-to');
          locallyStoreFavoriteTeamId(index);
          placeTeam("my", team(index));
      });

      // Everyting will be inside a SVG html element
      // Initialize myTeamSVG and myTeamG
      const myTeamG = d3.select("#myTeam")
      .append('svg')
        .attr("id", "myTeamSVG")
      .append("g")
        .attr("id", "myTeamG");

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

      // Append the myTeamC circle and the myTeamL logo
      myTeamG.append("circle")
      .attr("id", "myTeamC")
      myTeamG.append("image")
      .attr("id", "myTeamL")


      // Initialize spiral
      const spiralG = d3.select("#leftPanel")
      .append("svg")
      .attr("id", "spiralSVG")
      .append("g")
      .attr("id", "spiralG");

    // NHL opens the 4th october 2017 this season !
    const championshipStartDate = new Date(2017,9,4); // TODO maybe not hardcoded this value here ?
    const today = new Date();
    const diffDays = Math.floor((today.getTime()-championshipStartDate.getTime())/(1000*3600*24));

    $("#timeSliderInput")
    .slider(
        {
            id: "timeSlider",
            min:0,
            max:diffDays,
            value:diffDays,
            steps:1,
            tooltip: 'always',
            formatter: function(value) {
                const date = new Date(championshipStartDate.valueOf());
                date.setDate(date.getDate()+value);
                return date.toDateString();
          }
        }
    );

    $('#timeSliderInput').on({
      change: function(ui) {

        // TODO find less hacky way to fix on change called when initialized
        if (ui.value != null) {
          let newSliderVal = ui.value['newValue']
          const date = new Date(championshipStartDate.valueOf());
          date.setDate(date.getDate()+newSliderVal);

          const mm = date.getMonth() + 1; // getMonth() is zero-based
          const dd = date.getDate();
          const yyyy = date.getFullYear();

          reloadAndDraw(yyyy + "-" + mm + "-" + dd)

        }
      }
    });

  $('#timeSliderInput').trigger('change');

  const today_string = today.getYear() + "-" + today.getMonth() + "-" + today.getDay();

  //Setup teamSelectorGrid once
  //TODO find best way to not pull data twice at
  // init even though we don't really care too much
  loadedData = loadNHLData(today_string);
  // Parse and clean the data into an array
  loadedData.done(function(response) {
    cleanedTeams = getCleanedTeams(response);
    teamSelectorCarousel = createTeamSelectorInCarousel(cleanedTeams);
    teamSelectorGrid = createTeamSelectorInGrid(cleanedTeams)
  });

  reloadAndDraw(today_string)

  const rightPl = $('#rightPanel');
  const leftPl = $('#leftPanel');

  rightPl.click(function() {
      if(leftPl.hasClass( "active" )){
          rightPl.animate(
              {width:'100%', height:'100%', top: '0px'},
              {
                  duration:300,
                  step: function(){
                      placeTeam("my", team(myFavoriteTeamId()));
                  },
                  complete: function(){
                      rightPl.addClass('active');
                      leftPl.removeClass('active');
                      leftPl.height(300).width(400).css({ top: '54px' });
                      drawSpiral(teams());
                  }
              }
          );
      }
  });

  leftPl.click(function() {
      if(rightPl.hasClass( "active" )){
          leftPl.animate(
              {width:'100%', height:'100%', top: '0px'},
              {
                  duration:300,
                  step: function(){
                      drawSpiral(teams());
                  },
                  complete: function(){
                      leftPl.addClass('active');
                      rightPl.removeClass('active');
                      rightPl.height(300).width(400).css({ top: '54px' });;
                      placeTeam("my", team(myFavoriteTeamId()));
                  }
              }
          );
      }
  });

}

// Load Data
function reloadAndDraw(date) {

  // Load the teams using ajax
  loadedData = loadNHLData(date);
  // Parse and clean the data into an array
  loadedData.done(function(response) {

    cleanedTeams = getCleanedTeams(response);

    // Store locally the teams values
    locallyStoreFavoriteTeamId(-1);
    locallyStoreTeams(cleanedTeams);

    // Place myTeamG in a dynamic way
    placeTeam("my", team(myFavoriteTeamId()));

    // Place otherTeamG in a dynamic way
    placeTeam("other", team(myFavoriteTeamId()));

    // Place spiralG in a dynamic way.
    drawSpiral(teams());

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
