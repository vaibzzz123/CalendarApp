const insertedEventsOrganized = [];
const insertedEventsRaw = [];
const maxWidth = 600;
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
            || (newEvent.start < insertedEvent.start && newEvent.end > insertedEvent.end)) {
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

function resizeEvents(toResize) { // given array of indices
    toResize.forEach((overlappingEventIndex) => {
        const overlappingEventElement = insertedDomElements[overlappingEventIndex];

        let widthProperty = overlappingEventElement.style.width;
        const textIndex = widthProperty.indexOf("px");
        let width = Number(widthProperty.slice(0, textIndex));
        width /= 2;
        
        overlappingEventElement.style.width = `${width}px`;
    });
}

function insertEvent(event, level) {
    const levelContainer = document.getElementById(`level${level}`);

    const eventDomElement = createEventDomElement(event, level);

    if(insertedEventsOrganized.length - 1 < level) {
        insertedEventsOrganized.push([]);
    }

    // need to insert to raw as well

    insertedEventsOrganized[level].push(event);
    levelContainer.appendChild(eventDomElement);
}

function deepCopyFunction(inObject) {
    let outObject, value, key
  
    if(typeof inObject !== "object" || inObject === null) {
      return inObject // Return the value if inObject is not an object
    }
  
    // Create an array or object to hold the values
    outObject = Array.isArray(inObject) ? [] : {}
  
    for (key in inObject) {
      value = inObject[key]
  
      // Recursively (deep) copy for nested objects, including arrays
      outObject[key] = (typeof value === "object" && value !== null) ? deepCopyFunction(value) : value
    }
    
    return outObject
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
            }
        }

        optimalLayout.push(currentCollection);

        currentCollection = deepCopyFunction(leftoverElems); // deep copy, don't wanna set reference
    }

    // console.log(leftoverElems);
    return optimalLayout;

}

function layOutDay(events) {
    // events.forEach(event => {
        // insertEvent(event);
    // });

    // clearCalendar(); // removes all events/levels from board, resetting the entire state
    const optimalLayout = createOptimalLayout(insertedEventsOrganized.concat(events));

    for(let currentLevel = 0; currentLevel < optimalLayout.length; ++currentLevel) {
        addLevel();

        const eventsAtLevel = optimalLayout[currentLevel];

        eventsAtLevel.forEach((newEvent) => {
            // check for overlap between current elem and what's inserted
            const overlappingEventIndices = getOverlappingEvents(newEvent, currentLevel); // array of array of indices
            // if overlap
            if(overlappingEventIndices.length !== 0) {
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
                    });
                });
            }

            insertEvent(newEvent, currentLevel);
        });
    }
}

// insertEvent({start: 30, end: 150});

layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}, {start: 610, end: 670}]);

// addLevel();

// layOutDay([{start: 30, end: 150}, {start: 540, end: 600}, {start: 560, end: 620}]);

// layOutDay([{start: 540, end: 600}]);

// layOutDay([{start: 500, end: 590}]);