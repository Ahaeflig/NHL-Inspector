
function loadTeamsData(){

    let teamLoaded;

    $.ajax(
    {
        type: "GET",
		url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018&date=2017-10-10'
    }).done(
        function(response){
            console.log("Data Loaded");
            console.log(response);
            $("#team").html(String(response.records[0].teamRecords[1].team.name));
            console.log(response.records[0].teamRecords[1].team.name);
            teamLoaded = response;
	    }
    );

    return teamLoaded;
}

function cleanTeamsData(teamsData){

    // TODO by Adan
    // Please include a team.logo with the corresponding logo path !
    // Just 3 minimal team now
    const teams = [];
    for (let i = 0; i< 10; i++){
        teams.push({name:"Arizona Coyotes", logo:"logos/Arizona_Coyotes_logo.svg"});
        teams.push({name:"Anaheim Ducks", logo:"logos/Anaheim_Ducks_logo.svg"});
        teams.push({name:"Boston Bruins", logo:"logos/Boston_Bruins_logo.svg"});
    }
    return teams;
}

// Create the team selector as a bootstrap carousel
function createTeamSelectorCarousel(teams) {

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
}
/*
<div class="">
    <h3>...</h3>
    <p>...</p>
  </div>

*/

// Place a Team Logo at the middle of the corresponding SVG.
// It addapts the logo size to fit a circle of radius svg.width/4
function placeTeam(prefix){

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


// Draw a blank tunnel spiral in corresponding SVG
function drawSpiral(){

    // Get the Spiral SVG and its dimensions
    const spiralSVG = $('#spiralSVG');
    const width = spiralSVG.width();
    const height = spiralSVG.height();

    // Get the center of the SVG
    const cx = width/5 ;
    const cy = height/2;

    // Define the number of team, the minimum radius of each pills and a
    // resizing factor. Those value will probably came as input of the function
    const teamNumber = 31;

    // Or need to be computated in a clever way
    const minSize = 20;
    const sizeFactor = 1;

    // Set initial position and value of the sprial
    let oldTheta = -Math.PI/2;
    let oldR = 0;
    let oldX = cx;
    let oldY = cy;

    // Construct iterativelly all the pills
    const pills = [];

    for (let i = 0; i < teamNumber; i++){

        // For now the number of point of a team is define between 31 and 1
        const teamPoint = (teamNumber-i);

        const theta = oldTheta + Math.PI/10;
        const r = (minSize+teamPoint)*sizeFactor;
        const x = oldX + (oldR+r)*Math.cos(theta);
        const y = oldY + (oldR+r)*Math.sin(theta);
        const corrX = (x-cx)

        oldTheta = theta;
        oldR = r;
        oldX = x;
        oldY = y;

        pills.push({x: x, y: y, r:r});
    }

    // Get the spiral graphics
    const spiralG = d3.select("#spiralG")

    // Clean the previous drawing if exists and then draw the new one !
    spiralG.selectAll("circle").remove();
    spiralG.selectAll("circle").data(pills).enter()
        .append("circle")
            .attr("cx", function (d) { return d.x; })
            .attr("cy", function (d) { return d.y; })
            .attr("r", function (d) { return d.r; });

}

// When the document is ready
$( document ).ready(
    function(){
        console.log("Document is Ready");

        // Load the teams using ajax
        const loadedTeams = loadTeamsData();
        // Parse and clean the teams keeping needed data
        const cleanedTeams = cleanTeamsData(loadedTeams);

        const teamSelectorCarousel = createTeamSelectorCarousel(cleanedTeams);

        // Everyting will be inside a SVG html element
        // Initialize myTeamDrawing
        const myTeamG = d3.select("#myTeam")
            .append('svg')
                .attr("id", "myTeamSVG")
            .append("g")
                .attr("id", "myTeamG");

        myTeamG.append("circle")
            .attr("id", "myTeamC")
        myTeamG.append("image")
            .attr("id", "myTeamL")
            .attr("xlink:href", "logos/San_Jose_Sharks_logo.svg");
        placeTeam("my");

        // Initialize otherTeamDrawing
        const otherTeamG = d3.select("#otherTeam")
            .append('svg')
                .attr("id", "otherTeamSVG")
            .append("g")
                .attr("id", "otherTeamG");

        otherTeamG.append("circle")
            .attr("id", "otherTeamC")
        otherTeamG.append("image")
            .attr("id", "otherTeamL")
            .attr("xlink:href", "logos/Washington_Capitals_logo.svg");
        placeTeam("other");

        // Initialize spiral
        const spiralG = d3.select("#leftPanel")
            .append("svg")
                .attr("id", "spiralSVG")
            .append("g")
                .attr("id", "spiralG");
        drawSpiral();

    }
);

// When the window is resized
$( window ).resize(
    function() {
        console.log("Windows is resized");
        placeTeam("my");
        placeTeam("other");
        drawSpiral();
    }
);
