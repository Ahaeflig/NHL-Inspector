# Process Book

## Content

This process book contains 5 part:
* Project Proposal
* Evolution of the layout and sketches
* Evolution of the user interaction
* Interesting technical details
* Possible Improvements

## Initial Project Propsoal

We want to build a visualization that overviews the current state of the NHL championship while giving the opportunity to the viewer to compare stats between two teams: his favorite team and another team. We will include a time slider that let's the user interactively change the date to transform the data that is fed to the visualization.

For the overview, we will order and scale the logos of each team with respect to their current number of points in the league. We want to show the ordered logos following a certain shape, like a spiral or eventually a shape related to hockey.

To compare two team, the user will have to click on one logo, then that logo will be highlighted and when the user clicks on another logo, the two logo are superposed (one half in the right with one half on the left) and re-scaled, and circular barplots around the logos appear to compare their statistics.

### Motivation
It would be interesting to make a viz that can give a good picture of how the NHL is evolving while being interactive and giving the user more in depth comparison of his favorite team if he wants to. This viz could then be adapted for other championship and sports.

### Target Audience
We target mostly NHL fans but no specific knowledge is required to understand the overview visualization. The comparison might require the viewer to know about hockey a bit.

### Related Work and Inspiration
We wanted to find a nice way to get a global picture of a championship and we found the NHL to be a good fit to try.

### What am I trying to show
The goal is really to show how the championship is evolving over time while letting the user interact with the visualization a bit.

## Layout evolution and sketches
First we thought about having three separated parts of the page dedicated to display the data and the user choices.
One part was the overall state of the competition and the two other parts were used to compare the selected team's statistics using bar plots going out of a circle with each team's logo in the center.

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/im01.png?raw=true" width="450" />
</div>
<br >


But we were not satisfied with this design so we decided to change for a "two sided" page where the user, by hovering on either the right or left side of the page, slides the window and can focus on the general ranking or the selected team's statistics. This gives us the possibility to show within a single page stats and ranking of the league.

<br >
<div align = 'center'>
 <figure>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/im03.png?raw=true" width="450" />
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/im02.png?raw=true" width="450" />
</figure>
</p>
</div>
<br >

The next screenshot gives a look at what this layout looked like:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout0.png?raw=true" width="450" />
</div>
<br >


But as you can see the sliding window doesn't bring a lot of value to the visualization. You don't get much from the unselected panel, the dimension is not good to display either stats or the overall ranking.

We also sketched a diffrent layout with a "wheel" to select and show the state of the championship while showing the detailed stats:


<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/im04.png?raw=true" width="450" />
</div>
<br >

But we never implemented this layout as we found a different idea that holds the original wish of having a specific shape that represents the state of the league.
We went for two rectangular frames (that can be interchanged) instead of a sliding windows such that the content in the frame can be observed wheter it is minized or not:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout1.png?raw=true" width="450" />
</div>
<br >

At this point we had a layout that fitted our needs and it was a good time for a first beautify:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout2.png?raw=true" width="450" />
</div>
<br >

Of course a lot of the functionality was still missing at this point but the viz was already nicer to look at.


The next step was to implement the content of the right panel and see how it interacted with the whole visualization. Here is how the two panels were working at this point:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout3.png?raw=true" width="450" />
</div>
<br >


In the next image you can see the resulting layout from the other panel's perspective.


<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout4.png?raw=true" width="450" />
</div>
<br >

You might notice that the size of the top right panel is too small. This will be adressed later down the line!

After some thought and tests we decided to change the "bar plot sticking out of a circle" idea for a radial chart. It is visually more coherent and easier to get the stats not going off our panel given its dimensions. Take a look at the the first prototype version of it:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout5.png?raw=true" width="450" />
</div>
<br >

Then we added labels and showed for each team, a bar for each stats such that we can effectively compare the stats. The stats shown are:
- W: wins
- L: losses
- GA: goal against the team
- GS: goal scored by the team
- P: Number of points of the team

<br />
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout7.png?raw=true" width="450" />
</div>
<br >

We also considered a stacked bar version, but it was harder to compare the bars that way so we decided to stay with the design above.

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout6.png?raw=true" width="450" />
</div>
<br >

When updating the data from the timeline, the spiral transits. The first version only moved all the circles in the center and redrew the whole spiral after removing every element, what a waste! It looked like something from the next image while in transition:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout8.png?raw=true" width="450" />
</div>
<br >

But it turns out that in order to perceive the evolution of the league, it's primordial to see how the circles ordering changes. For that reason we implemented improved transitions where each circle moves towards its new designated position and we never remove and redraw anything from scratch!

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout9.png?raw=true" width="450" />
</div>
<br >

At this point we did some small adjustement to improve the visual quality of the viz, like adding a better background and adjusting certain colors:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout10.png?raw=true" width="450" />
</div>
<br >

Thanks to feedback from the teacher, we realized that we were missing key indication to explain how the viz works and what each element were supposed to be. We improved the understandability
 by adding some text explanation the first time the user is on the page with indication on what is clickable. We also added small circles stating the rank of each team.

We can also use the new circle to show which teams are the first of the league with golden-silver-bronze colors!

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout12.png?raw=true" width="450" />
</div>
<br >

But if you know about the NHL, you know that what matters most is to know which team goes to the play-off, therefore we decided to use these circles to show which team gets to be in the next phase of the championship at the current time:

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout13.png?raw=true" width="450" />
</div>
<br >

You also know directly if the team advanced because of its division ranking or if it is one of the two best team of each conference that were not qualified (wildcard).

After this we made the top right pannel bigger and we recentered the spiral. We also tried to linearly change the color of circular bars in order to better differentiate each stats but as expected, since a linear change of color is not perceived linearly by the human visual system, we feel like the result can be improved.

<br >
<div align = 'center'>
  <img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/layout14.png?raw=true" width="450" />
</div>
<br >


## User interaction evolution

At first we went with a carousel selector with a pop-up to let the user select his favorite team.

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui0.png?raw=true" width="450" />
</div>
<br >


But the selection of the team was too tedious and slow so we added a grid layout to select the team. Since there are 31 teams, we also added a random selector to have an nice even grid of 4 by 8.

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui1.png?raw=true" width="450" />
</div>
<br >

We implemented a slider that let's the user easily change the date of the championship and
a dropdown to select either the conference or the division of the currently selected team as this is an important feature of the NHL. This let's the user see a ranking of teams that actually play against each other in the league since teams only play against other in their conference.

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui2.png?raw=true" width="450" />
</div>
<br >

By clicking on the top right panel, the user can switch between two display modes. This let's the user focus either on more detailled stats or on the general ranking.
The final version of the panel is blinking until the user clicks on hit once such that the user undertstands the purpose of the panel and how to interact with it. Here we show a screenshot of the panel in transition!

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui3.png?raw=true" width="450" />
</div>
<br >

The user can also click on another team to select it and it will be highlighted in red. Also the circles react to mouse enter events to make spiral a bit more fluid and dynamic. Also the name of the team appears (we changed the text's position to the middle of the screen afterwards).

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui4.png?raw=true" width="450" />
</div>
<br >


Finally we added a play button that let's the timeline change automatically letting the user follow the evolution of the championship in real time.

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/ui5.png?raw=true" width="450" />
</div>
<br >


## Implementations details

### General:
General things to note are:
* We get data dynamically from the NHL league API so the visualization is always up to date.
* There is an asynchronous data flow using jquery
* We hosted the viz using github directly
* We try to use modern Javascript syntax
* We follow a "\<defs\> and \<pattern\>" architecture as much as possible.

Library used are:
* D3.js
* Bootstrap (css and bootstrap slider)
* Jquery/Ajax


We can't mention everything so we will highlight some interesting points in this part.

### Data Pipeline
There are a few method to consider for this part:
* loadNHLData() which does just that
* getCleanedTeams() that extract the relevant fields from the data loaded above
* reloadAndDraw() that can reload the data if the date was changed for example and then calls:
* draw() which draws the teams.

We propagate a boolean parameter "shouldTransit" because of the need to know if we should play our nice spiral transition when drawing the spiral or if each circle should be placed at its correct position directly.

We also use localStorage to store user choices for next session and when some information needs to be persistant.

### Drawing the spiral
The procedures to draw the spiral is the following:
* At init time, we build the necessary SVG elements using D3
* First step of drawing is to compute the center of each circles
  * Start from first circle (smallest)
  * Iteratively compute each point from the last one
* When all centers are known we can use these points to transition our SVG elements accordingly

The relevant functions are computeSpiralData() and drawSpiral().

### Drawing two halves of logos
The trick here is to use two D3 Arcs with the correct angles and radius to generate a correct path for each pattern.
We then compute the correct position for the image from the bounding box of the englobing element and the boundingbox of the path itself. That way we can perfectly align the logos as you can see:

<br >
<div align = 'center'>
<img src="https://github.com/Ahaeflig/NHL-Inspector/blob/master/ProcessBook/images/details0.png?raw=true" width="450" />
</div>
<br >


### Drawing the circular bar chart
The circular bar chart is drawn using D3 Arcs, which are defined by an inner radius, an outer radius, a start angle and an end angle. By feeding numerical team data to the arcs and using a few computation functions to determine the radii and the angles on the fly, we are able to dynamically draw them based on the values of the data.
The arcs are colored based on the team color, and distinguished by small color gradients to ease the visualization.


## Possible Improvements

Here are the top 6 things that we consider would be great improvements to our viz:
* During the spiral transition, suggest which pairs of team are playing (for example using lightning between each pairs that plays)
* We can include more details in the stats panel, there are many data points for each team in the data
* A way to see recent matches and future matches for a selected date
* Transition of the circular bar chart instead of removing and redrawing them each time
* A storyline to follow, marking cool events during the league (these could be automatically generated for the selected team)
* A bit of work on the choice of colors to make the whole viz more coherent
