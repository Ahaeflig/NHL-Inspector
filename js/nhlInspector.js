
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

    return teamsData;
}


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

function drawSpiral(){

    // Get the Spiral SVG
    const spiralSVG = $('#spiralSVG');
    const width = spiralSVG.width();
    const height = spiralSVG.height();

    // Select the number of turn
    const start = 0;
    const end = 3;

    const radius = d3.scaleLinear()
        .domain([start, end])
        .range([0, d3.min([width,height])/2]);

    const pieces = d3.range(start, end+0.001, (end-start)/31);

    const spiral = d3.radialLine()
        .curve(d3.curveCardinal)
        .angle(function(r) {return -2*Math.PI*r;})
        .radius(radius);

    // Get the spiral graphics
    const spiralG = d3.select("#spiralG")

    // Move the graphics to the midde of the SVG
    spiralG.attr("transform", "translate(" + width/2 + "," + (height/2) +")");
    spiralG.selectAll(".spiral").data([pieces]).enter()
        .append("path")
            .attr("class", "spiral")
            .attr("d", spiral)
}

// When the document is ready
$( document ).ready(
    function(){
        console.log("Document is Ready");

        // Load the teams using ajax
        const loadedTeams = loadTeamsData();
        // Parse and clean the teams keeping needed data
        const cleanedTeams = cleanTeamsData(loadedTeams);

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
