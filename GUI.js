
function toggleSelectedClass ()
{
    if (this.classList.contains("selected"))
    {
        this.classList.remove("selected");
    }
    else
    {
        this.classList.add("selected");
    }
}

function createGUIel (type, parent) 
{
    // Specify default values
    type = Default (type, "div");
    parent = Default(parent, document.body);
    
    // Set up
    var id = "__HTML_GUI_ID_"+__HTML_GUI_ID;
    __HTML_GUI_ID ++;
    
    var element;
    
    // Create a new element only if it doesn't exist yet
    var elements = document.getElementsByClassName(id);
    element = elements[0];
    
    if (elements.length === 0)
    {
        element = document.createElement(type);
        element.classList.add(id);
    }
    
    // Add the toolbar to the element's parent
    parent.appendChild(element);
    
    return element;
}
function createToolbar (parent)
{
    // Create the toolbar
    var toolbar = createGUIel ("div", parent);
    
    // Add all the necessary attributes to the new toolbar div
    toolbar.classList.add("toolbar");
    
    return toolbar;
}
function createButton (name, parent)
{
    // Create the Button
    var button = createGUIel ("button", parent);
    button.innerHTML = name;
    
    // Add the default event listeners
    // first make sure that the button doesn't already have that event listener
    button.removeEventListener("mousedown", toggleSelectedClass);
    button.removeEventListener("mouseup", toggleSelectedClass);
    
    // then add it
    button.addEventListener("mousedown", toggleSelectedClass);
    button.addEventListener("mouseup", toggleSelectedClass);
    
    return button;
}
function createRadios (names, parent, selected, forEachEl)
{
    // Give forEachEl a default value of an empty function
    forEachEl = Default(forEachEl, function(){});
    // Define the event listeners function for radios
    function selectRadio ()
    { 
        // If it is not selected, select it and deselect every other radio
        if (!this.classList.contains("selected"))
        {
            var radios = this.parentElement.children;
            for (var i = 0; i < radios.length; i ++)
            {
                radios[i].classList.remove("selected");
            }
            this.classList.add("selected");
        }
    }
    
    var scrollAmountY = 0;
    function selectNextRadio (e)
    {
        var scrollLimit = 50;
        var deltaY = e.deltaY;
            
        scrollAmountY += deltaY;
            
        if (Math.abs(scrollAmountY) > scrollLimit)
        {
            var len = this.children.length;
            for (var i = 0; i < len; i ++)
            {
                var radio = this.children[i];
                if (radio.classList.contains("selected"))
                {
                    radio.classList.remove("selected");
                    // If you're scrolling up or to the right
                    if (scrollAmountY > scrollLimit) {
                        this.children[ (i+1)%len ].classList.add("selected");
                    }
                    // If you're scrolling down or to the left
                    else if (scrollAmountY < -scrollLimit) {
                        var childI;
                        if (i === 0) childI = this.children.length-1;
                        else childI = i-1;
                        this.children[childI].classList.add("selected");
                    }
                    scrollAmountY = 0;
                    break;
                }
            }
        }
    }
    
    // Create a radio button group
    var radiosEl = createGUIel ("div", parent);
    radiosEl.classList.add("radio");
    
    // Scroll through the radios
    radiosEl.addEventListener("wheel", selectNextRadio);
    
    // Loop through each name adding another radio button
    var radio;
    for (var i = 0; i < names.length; i ++)
    {
        // Create the radio button
        radio = createButton (names[i], radiosEl);
        radio.classList.add("radio");
        
        // Remove the event listeners and add one for click
        radio.removeEventListener("mousedown", toggleSelectedClass);
        radio.removeEventListener("mouseup", toggleSelectedClass);
        radio.addEventListener("click", selectRadio);
        
        // Call the forEachEl function
        forEachEl.call(radio,i);
    }
    
    // Select this element if it is the default selected radio
    if (selected !== undefined)
    {
        radiosEl.children[selected].classList.add("selected");
    }
    
    return radiosEl;
}
function createOption (name, parent)
{
    var container = createGUIel ("label", parent);
    container.classList.add("checkbox");
    
    var checkbox = createGUIel ("input", container);
    checkbox.type = "checkbox";
    
    var text = createGUIel ("span", container);
    text.innerHTML = name;
    
    var checkmark = createGUIel ("span", container);
    checkmark.classList.add("checkmark");
}
