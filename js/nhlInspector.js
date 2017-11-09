/**
* nhlInspector.js
* @author Bastien Chatelain, Adan Häfliger, Ismail Imani
*/
// Console print flags
const MESSAGE = true;
const DEBUG = true;
const WARNING = true
const ERROR = true;

/**
* Print a message inside the console if MESSAGE = true
* @param str (String): The message string to print
*/
const message = function(str){
    if(MESSAGE) console.log(str);
}

/**
* Print a debug message inside the console if DEBUG = true
* @param str (String): The debug string to print
*/
const debug = function(str){
    if(DEBUG) console.log(str);
}

/**
* Print a warning message inside the console if WARNING = true
* @param str (String): The warning string to print
*/
const warning = function(str){
    if(WARNING) console.log(str);
}

/**
* Print an error message inside the console if ERROR = true
* @param str (String): The error string to print
*/
const error = function(str){
    if(ERROR) console.log(str);
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

    let dataLoaded;

    $.ajax(
    {
        type: "GET",
		url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018&date=2017-10-10'
    }).done(
        function(response){
            message("Data Loaded");
            // Test of the returned structure
            debug(response);
            debug(response.records[0].teamRecords[1].team.name);
            dataLoaded = response;
	    }
    );
    return dataLoaded;
}


/**
* Get and clean some global data from the input data
* @assume data is the output of @see loadNHLData
* @param data (): TODO to complete
* @return the cleaned global data as a JS Object which contains:
*   - TODO to complete
*   -
*/
function getCleanedGlobalData(data){
    // TODO by Adan
    return data;
}


/**
* Get and Clean the teams data inside the received input data and return an
* array of teams where a team is a JS Object which contains:
* - name : the name of the team
* - logo : the corresponding logo String path
* - ... TODO To complete
* @assume on the input sort ? TODO to complete
* @param data (): TODO to complete
* @return the cleaned data as an array of teams
*/
function getCleanedTeams(data){

    // TODO by Adan
    // Please include a team.logo with the corresponding logo path !
    // Just 30 minimal team now to visualize
    const teams = [];
    for (let i = 0; i< 10; i++){
        teams.push({name:"Arizona Coyotes", logo:"logos/Arizona_Coyotes_logo.svg"});
        teams.push({name:"Anaheim Ducks", logo:"logos/Anaheim_Ducks_logo.svg"});
        teams.push({name:"Boston Bruins", logo:"logos/Boston_Bruins_logo.svg"});
    }
    return teams;
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
        .attr("y", cy - s/2);
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

        pills.push({x: x, y: y, r:r, s:s, logo:teams[i].logo});

        // Update the previous value
        oldTheta = theta;
        oldR = r;
        oldX = x;
        oldY = y;
    }

    // Get the spiral graphics
    const spiralG = d3.select("#spiralG")

    // Clean the previous drawing if exists and then draw the new one !
    // (Circle and images)
    spiralG.selectAll("circle").remove();
    spiralG.selectAll("image").remove();
    const test = spiralG.selectAll("circle").data(pills).enter();
    test.append("circle")
        .attr("cx", function (d) { return d.x; })
        .attr("cy", function (d) { return d.y; })
        .attr("r", function (d) { return d.r; })
    test.append("image")
        .attr("width", function (d) { return d.s;})
        .attr("height", function (d) { return d.s;})
        .attr("x", function (d) { return d.x - d.s/2; })
        .attr("y", function (d) { return d.y - d.s/2; })
        .attr("xlink:href", function (d){ return d.logo; });
}

// Is called when the document is ready
$( document ).ready(
    function(){
        message("Document is Ready");

        // Load the teams using ajax
        const loadedData = loadNHLData();
        // Parse and clean the data into an array
        const cleanedTeams = getCleanedTeams(loadedData);
        // Construnct the team carousel
        const teamSelectorCarousel = createTeamSelectorInCarousel(cleanedTeams);

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
            .attr("xlink:href", "logos/San_Jose_Sharks_logo.svg");
        // Place myTeamG in a dynamic way
        placeTeam("my");

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
            .attr("xlink:href", "logos/Washington_Capitals_logo.svg");
        // Place otherTeamG in a dynamic way
        placeTeam("other");

        // Initialize spiral
        const spiralG = d3.select("#leftPanel")
            .append("svg")
                .attr("id", "spiralSVG")
            .append("g")
                .attr("id", "spiralG");
        // Place spiralG in a dynamic way.
        drawSpiral(cleanedTeams);

    }
);

// When the window is resized
$( window ).resize(
    function() {
        message("Windows is resized");
        placeTeam("my");
        placeTeam("other");
        // TODO Need the teams data... so decide if we put a global constant or
        // if we provide a constant function that return the data without recomputing it
        //drawSpiral(teams);
    }
);
