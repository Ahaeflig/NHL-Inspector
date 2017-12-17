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
            console.log("MAMAN")
            const teamRecords = conferenceData[conf]["teamRecords"][i];
            const leagueRecord = conferenceData[conf]["teamRecords"][i]["leagueRecord"]
            // TODO refactor if needed and chose correct stats
            const teamName = teamRecords.team.name;
            const points = teamRecords.points;
            const gamesPlayed = teamRecords["gamesPlayed"];
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




// IF adjacent
visualizationMode = "stack"; //available modes : stack / adjacent

    .innerRadius((d, i) => computeInnerRadius(visualizationMode == "adjacent" ? d.index : i))
    .outerRadius((d, i) => computeOuterRadius(visualizationMode == "adjacent" ? d.index : i))

///
    function computeInnerRadius(index) {
        if (visualizationMode == "adjacent") {
            return r + padding + index * (arcWidth);
        } else {
            pad = index % 2 == 0 || oppositeTeam == null ? padding : 0;
            return r + pad + padding + index * (arcWidth);
        }
    }
///


function computeOuterRadius(index) {
    if (visualizationMode == "adjacent") {
        return r + arcWidth + index * (arcWidth);
    } else {
        pad = index % 2 == 0 && oppositeTeam != null ? padding : 0;
        return r + arcWidth + pad + index * (arcWidth);
    }
}

///

return [{
        "value": d.point < dOpposite.point ? d.point : dOpposite.point,
        "stat": "Pts",
        "color": d.point < dOpposite.point ? d.color : dOpposite.color,
        "index": "0",
        "offset": "0"
    },
    {
        "value": d.point < dOpposite.point ? dOpposite.point - d.point : d.point - dOpposite.point,
        "stat": "Pts",
        "color": d.point < dOpposite.point ? dOpposite.color : d.color,
        "index": "0",
        "offset": d.point < dOpposite.point ? d.point : dOpposite.point
    },
    {
        "value": d.teamGoalScored < dOpposite.teamGoalScored ? d.teamGoalScored : dOpposite.teamGoalScored,
        "stat": "GF",
        "color": d.teamGoalScored < dOpposite.teamGoalScored ? d.color : dOpposite.color,
        "index": "1",
        "offset": "0"
    },
    {
        "value": d.teamGoalScored < dOpposite.teamGoalScored ? dOpposite.teamGoalScored - d.teamGoalScored : d.teamGoalScored - dOpposite.teamGoalScored,
        "stat": "GF",
        "color": d.teamGoalScored < dOpposite.teamGoalScored ? dOpposite.color : d.color,
        "index": "1",
        "offset": d.teamGoalScored < dOpposite.teamGoalScored ? d.teamGoalScored : dOpposite.teamGoalScored
    },
    {
        "value": d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.teamGoalAgainst : dOpposite.teamGoalAgainst,
        "stat": "GA",
        "color": d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.color : dOpposite.color,
        "index": "2",
        "offset": "0"
    },
    {
        "value": d.teamGoalAgainst < dOpposite.teamGoalAgainst ? dOpposite.teamGoalAgainst - d.teamGoalAgainst : dOpposite.teamGoalAgainst,
        "stat": "GA",
        "color": d.teamGoalAgainst < dOpposite.teamGoalAgainst ? dOpposite.color : d.color,
        "index": "2",
        "offset": d.teamGoalAgainst < dOpposite.teamGoalAgainst ? d.teamGoalAgainst : dOpposite.teamGoalAgainst
    },
    {
        "value": d.teamWins < dOpposite.teamWins ? d.teamWins : dOpposite.teamWins,
        "stat": "W",
        "color": d.teamWins < dOpposite.teamWins ? d.color : dOpposite.color,
        "index": "3",
        "offset": "0"
    },
    {
        "value": d.teamWins < dOpposite.teamWins ? dOpposite.teamWins - d.teamWins : d.teamWins - dOpposite.teamWins,
        "stat": "W",
        "color": d.teamWins < dOpposite.teamWins ? dOpposite.color : d.color,
        "index": "3",
        "offset": d.teamWins < dOpposite.teamWins ? d.teamWins : dOpposite.teamWins
    },
    {
        "value": d.teamLosses < dOpposite.teamLosses ? d.teamLosses : dOpposite.teamLosses,
        "stat": "L",
        "color": d.teamLosses < dOpposite.teamLosses ? d.color : dOpposite.color,
        "index": "4",
        "offset": "0"
    },
    {
        "value": d.teamLosses < dOpposite.teamLosses ? dOpposite.teamLosses - d.teamLosses : d.teamLosses - dOpposite.teamLosses,
        "stat": "L",
        "color": d.teamLosses < dOpposite.teamLosses ? dOpposite.color : d.color,
        "index": "4",
        "offset": d.teamLosses < dOpposite.teamLosses ? d.teamLosses : dOpposite.teamLosses
    },
]
