
function loadTeamsData(){

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
	    }
    );


}

$( document ).ready(loadTeamsData());
