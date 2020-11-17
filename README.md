# Digital Rain Project

This program displays digital rain animation within the window browser, as seen in the film The Matrix (1999). Special thanks to The Coding Train for the inspiration for this project.

## Total lines:

814

## Built With:

- JavaScript, HTML, CSS

## Devlog:

### 19/08/2020

This core of this program was written while I was learning JS with a few days experience coming from a background in Java, mostly completed on 18/08/20 and 19/08/20.
I took a project I had written in Java and converted it into JS, this is why the program is very OOP-orientated. For a while I even had the `MatrixString` class written like a Java class with getters and setters. This really created complication for a while because I forgot to add the brackets to the get methods in my `show()` function within the matrixString objects and it wasn't animating for a long time.
I am also unhappy with the method of drawing the animation with the `SetInterval()` method, if I was going to redo this project I would use `requestAnimationFrame()`.

That being said there are some improvements made over the original version I made Java. The most significant is the ability to have varying lengths of strings while still having changing characters. Another significant improvement was not having strings overlap each other at all, sperating them into distinct columns.

Eventually I would like to expand this project to include more user options and make it a more functional program rather than just a demonstration.

### 22/08/2020

Today, added multiple colour options. This was pretty straightforward. Added parameter to the `show()` function which takes in the array, the different colour options are stored in an array of arrays called `colorChoiceArray[]` and this array is passed into the `show()` function in `draw()`. When I expand this program to include menus, the `loadColor()` function will work something like as follows:
1. user clicks on a color displayed in the menu.
2. color variable gets loaded into `loadColor()` function as the variable (undecided who type yet).
3. `loadColor()` returns a number 0-6 into `colorChoiceArray` array. This function will be called in that method.
also thinking about having another, darker color so the text fades into the background more, the trail of letters looks rather blocky at the moment.

Included a function that returns an array of random colours and added it to the array of user colours. Wondering if there's a way of generating a spectrum of colours somehow, there's probably a library out there that does that. This in turn lead to me leading to develop a disco feature where every line changes, all this took was the insertion of one line of code: 
```javascript
colorChoiceArray[7] = generateRandomColorArray();
```
 I built this to toggle on and off through a boolean value named `discoOn` so I can switch it on and off through that value. Afterwards I changed the structure so that the class has a method called `showDisco()` which generates a new color for every single character, rather than having the entire line be the same color. I wonder if adding color as a field in the `MatrixString` class is worth it in the long term if I think up any more color variations or if I want to restructure the framework of this program if I feel it is too convoluted when it comes time to add menus. Initially when I was creating the class I did not take color to be a variable because the only color I had planned to add was green, however with the expansion of color options this leads to some roundabout ways of implementing different colors.

Created function for return `yInput` to cut down on repeating the formula in both the array creation and the infintie draw function. This lead into me creating a generate random number within a range function (named `generateRandomNumber`, takes a min and max and generates a number between these two points) because I was repeating the same exact formula in three different methods and they were all practically the same (`generateWordSizeRand(), generateFontSize(), generateYSpeed()`. I still left these functions in the program so I wouldn't have to edit the values multiple times everytime I called it during creation.

For a while I was unhappy with the distribution of the y axis for my matrix strings, I felt they fell too much in waves. I fixed this by setting their start positions to a far larger range than the following ones.

Implemented a temporary menu system with window prompts, will want this replaced with a user interface that can be faded away in the main menu but I will need to research more HTML/CSS stuff to figure out how to implement that and work on my front end skills in that regard. It looks like for getting the text to move left, right and upwards will be a real pain, I don't even know if it can be done diagonally the way I have programmed it.

### 23/08/2020

Updated the screen coordinates to be updated every frame within the `show()` method. I still worry about having to repeat this code over and over again. However this lost the opacity effect and wasn't worth it. Need to figure out a way of having this. Currently the program creates the height and size upon the original window size, this isn't a problem if the program had a fixed window size and was running like downloadable executable which only ran in full screen, but for a browser or resizeable screen this becomes a big problem. If you expand the screen size after you start the program, the canvas doesn't update the position. if you include the following lines in the `show()` method:
```javascript 
canvas.width = window.innerWidth;
canvas.height = window.innerHeight; 
```
then the program will be able to be scaleable by height (while losing the opacity of the background, which cusk), however. The same problem remains that it doesn't update the `x` value of the `MatrixString` objects when the width increases because they are only created before the `show()` method, and doesn't create new `MatrixString` objects ever (they are a fixed amount upon creation). If it did create new objects then the new objects would be a different size and the program would glitch out when expanding. **Maybe I should try adding a condition where if the screen width increases, another `MatrixString` object gets added to the `words` array, if the screen wisth decreases, the last item in the `words` array gets deleted.** Also this is a big distraction from adding the new directions which is a more pressing issue. Maybe put this on hold until after the core features such as different  have been completed.

Things needed to be updated to introduce new direction up (north):

* Creation of the array needs to be updated to take into account of the different directions and enter different parameters for the starting position (moving south (downwards), the starting position of y will be negative (above the window height base which is 0), while moving north (upwards), the starting position will be positive (below the window height value)). Therefore the createArray function needs to have different conditions based on how it creates the .
* Show function will need to have similar conditionals to update the color of the MatrixString.

In conclusion only `y` and `ySpeed` are the variables that need to be altered for the new direction. For implementing horizontal movements, one will need to implement an entirely different method to display that way.

I managed to get horizontal movement working after a little bit of effort, west movements implemented, east movement got stuck in place. At this point I think its because the

Should note that the window updating is not scaleable, should look into getting those variables changed be relative to the screen width and height, specificallly for the yInput variables, they are hardcoded at a certain percentage based on my laptop monitor, I should redo those values to be more accurate for different windows.

## 24/08/2020

Managed to solve the issue with moving east pretty easily, it was a just a case of having the screen being mirrored really messing up how I was calculating the values, for a long time I was confused as to why both east and west directions were moving in the same direction west. I was pretty sure logically my east points were moving east, but because it wass reversed, it confused me.

## 26/08/2020

Added directional changes upon pressing arrow keys on the keyboard. Was a fairly simple change. Want to expand this system so that the strings retain their original sizes from creation. To do this, would need to add a boolean value that gets set to on and off whenever you change direction with the arrowkey. Within `show()`, there needs to be an conditional for each movements that determines whether the directions of the string are the same axis (vertical or horizontal) that they were created. This may be rather complicated if there are multiple different directions that all need their own boolean values set on and off.

## 7/09/2020

Editted the random colour option to generate a new colour every time it "random" option is selected, rather than just creating a random colour upon creation.

## 9/09/2020

Implemented system for allowing the user to clear the screen upon pressing "c".

## 26/10/2020

Implemented functional HTML menu.

## 27/10/2020

Some CSS added to menu icons.

## 3/11/2020

More CSS touches and basic pause functionality added.

## 4/11/2020

Fixed random color button visualization.

## Possible extensions in further versions:

- Music.
- Fullscreen.
- All four directions at the same time
