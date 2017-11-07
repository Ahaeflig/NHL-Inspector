
function loadTeamsData(){

    $.ajax(
    {
        type: "POST",
		url: 'https://statsapi.web.nhl.com/api/v1/standings?expand=standings.team&season=20172018',
		async: true,
		data:
        {
	    }
    }).done(
        function(response){
            console.log("Data Loaded");
            console.log(response);
	    }
    );


}


$( document ).ready(function() {
    console.log("Document is ready");
}
