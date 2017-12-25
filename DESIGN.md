
I first did extensive googling to try and find usable datasets and interesting D3 projects online that could act as design inspiration. I then started the project by figuring out by trial and error how to load a csv formatted dataset into some simple html and javascript files. I also had to figure out how to use a webserver to open a browser window. 

Once the data was parsed properly, I could then create a circle to represent each pieace of data. Then, I could change attributes of those circles - radius, x, and y - based off of the data. Finally, I could append each of those circles to my scaleable vector graphic to have all of them appear together. 

One challenge I had was wrapping my head around .select() and .selectAll(), which either select certain tags in your html, or create a new tag if one isn't there that matches the method argument. This was crucial to me being able to create new circles and the tooltip. It was also important for me to learn that D3 functions are often chained into long strings. After internalizing that, it became much clearer how to change attributes and styling of objects as they're created. 

I decided to use bubble charts because I knew that they would pose a doable challenge when starting with D3 for the first time. 

I created the round bubble chart first, and then the scatterplot below. The scatterplot was more complicated, as it involved tying together multiple linear scales to use in one SVG. 

I ran into a lot of trouble getting the first animation to happen, where the bubbles expand out from the center, mostly because any examples found online were written in the previous version of D3. I experimented with .force() until it had the desired effect. 

I originally wanted to have links between different pages containing each chart, but I decided it was more satisfying to scroll on a single page. I also intended to work with multiple csv files, but I found that while that wouldn't pose too much of a challange (just reading in the additional data and creating a scale to use on elements), it was more straightforward to use one csv because the data I was using could simply be copied and pasted from one csv to another. 

The greatest challenge I had was getting my scatterplot to be resizeable to any screen. I was able to get the axis to resize, and bubbles to be the right distance from each other. As a result, I did get lots of experience using scales that take data from a csv as the scale domain, and output a length in pixels as the desired range, or size, of a new element. 


