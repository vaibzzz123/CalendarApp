const maxWidth = 600;
let insertedEventsOrganized = [];
let insertedEventsRaw = [];
let maxLevels = -1;

function getOverlappingEvents(newEvent, newEventLevel) {
    const overlappingEvents = [];

    insertedEventsOrganized.forEach((levelElements, level) => {
        if(level == newEventLevel) {
            return; // don't need to search past here
        }
        const eventsAtLevel = [];
        levelElements.forEach((insertedEvent, index) => {
            if((newEvent.end > insertedEvent.start && newEvent.end < insertedEvent.end)
            || (newEvent.start > insertedEvent.start && newEvent.start < insertedEvent.end)
            || (newEvent.start < insertedEvent.start && newEvent.end > insertedEvent.end)
            || (newEvent.start === insertedEvent.start && newEvent.end === insertedEvent.end)) {
                eventsAtLevel.push(index);
            }
        });

        overlappingEvents.push(eventsAtLevel);
    });

    return overlappingEvents;
}

function createEventDomElement(event, level) {
    const eventContainer = document.createElement("div");
    eventContainer.className = "calendarEvent";

    const eventLength = event.end - event.start;
    eventContainer.style.height = `${eventLength}px`;
    eventContainer.style.width = `${maxWidth/(level+1)}px`;
    eventContainer.style.top = `${event.start}px`;
    const leftPos = maxLevels === 0 ? 93.484 : 93.484 + (maxWidth/(maxLevels+1))*level;
    eventContainer.style.left = `${leftPos}px`;
    // if(level === 0) {
        // total = 95.48px = 72.48 + 3 + 10
        // total = 93.484px
    // }

    const blueBar = document.createElement("div");
    blueBar.className = "blueBar";

    const eventTextContainer = document.createElement("div");
    eventTextContainer.className = "calendarEventTextContainer";
    const eventText = document.createElement("span");
    eventText.className = "eventText";
    eventText.innerText = "Sample Item";
    const eventLocation = document.createElement("span");
    eventLocation.className += "smallerLighter padding";
    eventLocation.innerText = "Sample Location";
    eventTextContainer.appendChild(eventText);
    eventTextContainer.appendChild(eventLocation)

    eventContainer.appendChild(blueBar);
    eventContainer.appendChild(eventTextContainer);

    return eventContainer;
}

function insertEvent(event, level) {
    const levelContainer = document.getElementById(`level${level}`);

    if(insertedEventsOrganized.length - 1 < level) {
        insertedEventsOrganized.push([]);
    }

    const eventDomElement = createEventDomElement(event, level);

    insertedEventsOrganized[level].push(event);
    insertedEventsRaw.push(event);
    levelContainer.appendChild(eventDomElement);
}

function addLevel() {
    maxLevels += 1;
    const calendarContainer = document.getElementById("calendarContainer");

    const levels = calendarContainer.children; // not a regular JS array
    const length = levels.length;
    for(let i = 0; i < length; ++i) {
        const level = levels.item(i);
        level.style.width = `${maxWidth/(maxLevels+1)}px`
    }

    const levelContainer = document.createElement("div");
    levelContainer.id = `level${maxLevels}`;
    levelContainer.style.width = `${maxWidth/(maxLevels+1)}px`;

    calendarContainer.appendChild(levelContainer);
}

function createOptimalLayout(events) {
    const optimalLayout = [];

    const sortedEvents = events.sort((a,b) => { // sorting by start time
        return a.start - b.start;
    });

    // const optimalLayout = [sortedEvents];


    // console.log(sortedEvents);

    let currentCollection = sortedEvents;
    while(currentCollection.length !== 0) {

        const leftoverElems = [];

        for(let j = 1; j < currentCollection.length; ++j) {
            const currentEvent = currentCollection[j];
            const lastEvent = currentCollection[j-1];
     
            if(currentEvent.start < lastEvent.end) { // overlap
                currentCollection.splice(j, 1);
                leftoverElems.push(currentEvent);
                j--;
            }
        }

        optimalLayout.push(currentCollection);

        currentCollection = deepCopyFunction(leftoverElems); // deep copy, don't wanna set reference
    }

    // console.log(leftoverElems);
    return optimalLayout;

}

function doesOverlapExist(overlapArray) {
    for(const level of overlapArray) {
        if (level.length > 0) {
            return true;
        }
    }
    return false;
}

function resetCalendar() {
    insertedEventsOrganized = [];
    insertedEventsRaw = [];
    maxLevels = -1;

    const calendarContainer = document.getElementById("calendarContainer");
    // let length = calendarContainer.children.length;
    while(calendarContainer.children.length > 0) {
        const levelDiv = calendarContainer.children.item(0);
        calendarContainer.removeChild(levelDiv);
        // length--;
    }
}

function layOutDay(events) {
    // events.forEach(event => {
        // insertEvent(event);
    // });

    // clearCalendar(); // removes all events/levels from board, resetting the entire state
    const optimalLayout = createOptimalLayout(insertedEventsRaw.concat(events));
    resetCalendar();

    for(let currentLevel = 0; currentLevel < optimalLayout.length; ++currentLevel) {
        addLevel();

        const eventsAtLevel = optimalLayout[currentLevel];

        eventsAtLevel.forEach((newEvent) => {
            // check for overlap between current elem and what's inserted
            const overlappingEventIndices = getOverlappingEvents(newEvent, currentLevel); // array of array of indices
            // if overlap
            if(doesOverlapExist(overlappingEventIndices)) {
                // for every element in overlap
                overlappingEventIndices.forEach((levelEventIndices, overlappingEventLevel) => {
                    const levelDiv = document.getElementById(`level${overlappingEventLevel}`);
                    levelEventIndices.forEach((eventIndex) => {
                        // need to get the overlapping elements
                        const overlappingElement = levelDiv.children.item(eventIndex);
                        const widthProperty = overlappingElement.style.width;
                        const textIndex = widthProperty.indexOf("px");
                        const width = Number(widthProperty.slice(0, textIndex));
                        overlappingElement.style.width = `${width * (maxLevels/(maxLevels+1))}px`;
                        if(overlappingEventLevel!== 0) {
                            const leftPos = 93.484 + (maxWidth/(maxLevels+1))*overlappingEventLevel;
                            overlappingElement.style.left = `${leftPos}px`;    
                        }
                    });
                });
            }

            insertEvent(newEvent, currentLevel);
        });
    }
}

// insertEvent({start: 30, end: 150});

layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}]);

// layOutDay([{start: 200, end: 300}, {start: 200, end: 300}, {start: 200, end: 300}]);

// layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}]);

// layOutDay([{start: 540, end: 600}]);

// layOutDay([{start: 500, end: 590}]);