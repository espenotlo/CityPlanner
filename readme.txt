This application was created for Assignment 5 in the course 
IE500217 – Computer Graphics at NTNU campus Aalesund.

This city planner application is a tool for planning the 
construction of buildings in a city, and provides the user
with tools for creation and deletion buildings of various
sizes and colors, and designing a building as a landmark,
providing additional information to surrounding buildings
of the landmark's visibility from their location.

Running the application:
To start the application, run index.html on a web-server.

When first started, the city will be prepopulated with 
sample buildings, including a landmark.

Usage:

The application has two main modes: Home and Edit.

The home mode displays information about light intensity
at a given location, as well as a shadow heatmap.

Initially, the light intensity bar shows the light intensity
variation in the center of the park, but the location may
be changed by clicking on any point in the world.

The shadow heatmap shows the shadow variations in the park area.

The Edit mode contains a toolbar allowing the user
to customize the city and retrieve detailed information
about different buildings.

To load a scene from a file, click the Load scene button,
choose the file containing the building information
and click upload file.

To download a copy of the current city state, 
click the Save scene button.

To add a building to the cityscape, click the Add building
button to unlock the building settings.
Use the building settings to configure the building to the
desired specifications, then move the mouse to the desired
location in the scene and click the left mouse button.
If the selected location is valid, the building will be 
constructed. (Buildings may not be built in the park, 
on the road or on top of an existing building. There must
also be room for the building in order for it to be built.
NB: Only one landmark building can exist at a time.)

To remove a building, click the Remove building button,
then click on the building you wish to remove.

To check the visibility to the landmark from a building,
click the Check landmark button, then click on the building.

To check the sky exposure of a building, click the
Check sky exposure button, then click on the building.

The Start/stop animation button pauses or unpauses the time
of day animation. When it is stopped, you may use the
Time of day slider to adjust the time of day.