# Calendar

Hello!

## General approach:

* I came up with the concept of "levels" in the calendar: A level in the calendar has a set of events that don't have any overlap at all. A level starts at level 0 at the leftmost side of the calendar.
* If an event tries to insert itself into a level and there is overlap, it must check if it can insert itself into the next level.
* Once a level is found where there is no overlap, it can successfully place itself there. It then must resize the elements it's overlapping with so the optimal width is used up.
* These levels are divs holding the event divs in the HTML, and columns in a flexbox container.

## How I did it:

* I first found elements.