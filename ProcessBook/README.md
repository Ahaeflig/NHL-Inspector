# Process Book

## Project Propsoal

We want to build a visualization that overviews the current state of the NHL championship while giving the opportunity to the viewer to compare stats between two teams. We will include a time slider that let's the user interactively change the date to transform the data that is fed to the visualization.

For the overview, we will order and scale the logos of each team with respect to their current number of points in the league. We want to show the ordered logos following a certain shape, like a spiral or eventually a shape related to hockey.

To compare two team, the user will have to click on one logo, then that logo will be highlighted and when the user clicks on another logo, the two logo are superposed (one half in the right with one half on the left) and re-scaled, and circular barplots around the logos appear to compare their statistics.

### Motivation:
It would be interesting to make a viz that can give a good picture of how the NHL is evolving while being interactive and giving the user more in depth comparison of his favorite team if he wants to. 

### Target Audience:
We target mostly NHL fans but no specific knowledge is required to understand the overview visualization. The comparison might require the viewer to know about hockey a bit.

### Related Work and Inspiration:
We wanted to find a nice way to get a global picture of a championship and we found the NHL to be a good fit to try.

### What am I trying to show:
The goal is really to show how the championship is evolving over time.

## User interaction evolution


## Layout choice evolution

First we thought about having three separated parts of the page dedicated to display the data and the user choices.
One part was the overall state of the competition and the two other parts were to compare the selected team's statistics. 
<div align = 'center'>
<img src="images/im01.jpg" width="450" height="450" />
</div>

But we were not satisfied with this design so we decided to change for a "two sided" page where the user by hovering on either the right or left side of the page slides the window and can focus on the general ranking or the selected team's statistics. This gives us the possibility to show within a single circle the stats and logo of both team at the same time.
<div align = 'center'>
<img src="images/im03.jpg" width="450" height="450" />
<img src="images/im02.jpg" width="450" height="450" />
</div>


Right now we are wondering about changing direction again as this sliding window doesn't bring a lot of value to the viz and maybe go for a "wheel" to select and show the state of the championship at the same time.
<div align = 'center'>
<img src="images/im04.jpg" width="450" height="450" />
</div>
