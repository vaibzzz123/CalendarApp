# Calendar

Hello! Here is a rough explanation of how I chose to approach this. Please email me if you have any questions!

## General approach:

* I came up with the concept of "levels" in the calendar: A level in the calendar has a set of events that don't have any overlap at all. A level starts at level 0 at the leftmost side of the calendar.
* If an event tries to insert itself into a level and there is overlap, it must check if it can insert itself into the next level.
* Once a level is found where there is no overlap, it can successfully place itself there. It then must resize the elements it's overlapping with so the optimal width is used up.
* These levels are divs holding the event divs in the HTML, and columns in a flexbox container.

## How I did it:

1. I first got all of the events given, and found any events that made overlaps.
    * If there were any overlaps, those overlapping events were removed from the set of events, until there were no overlaps in the main set
    * I then continued this iteratively with events removed from the original set, seeing if there were overlaps, and did this until I got a set with no overlaps
    * These sets were all the events at a particular level
    * Using this approach, I can find the optimal place to put each event
2. Then using the organized events found from step 1, I put them into the right place on the calendar. I first looked to see if there were any overlaps between the new element and already existing elements on the calendar, and resized those events accordingly.
3. After resizing the already existing events if required, I inserted the new event:
    * I set the height to the time for the event, event.end - event.start
    * I set the offset from the top of the page to event.start, as that's the pixels corresponding to the place on the calendar
    * I set the offset from the left of the page to 93.484 + (maxWidth/(maxLevels+1))*level, as that is where the event should be horizontally. 93.494 is the offset for the beginning of the calendar container, and the rest is based off what level the event is on.
    * I set the width to maxWidth/(level+1), which is what the width should be based on the level