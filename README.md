jqEye
=====

_Make eyes that follow the mouse_

Defines a behaviour in which an object acts moves, within the boundaries of an imaginary eye, in order to follow the mouse.

Demos
-----

Basic: http://jsfiddle.net/jfmdev/L43zcmq4/

Advanced: http://jsfiddle.net/jfmdev/78ktpaqv/

How to use
----------

**Step 1:** Add references to the files of _jQuery_ and _jqEye_ in the header section of the HTML document.

``` html
    <script type="text/javascript" src="jquery-1.11.1.min.js"></script>
    <script type="text/javascript" src="jqeyes-1.0.js"></script>
```

**Step 2:** Define, in the body of the HTML document, the element which is going to act as the pupil. 
Note that the initial position of this element is going to be considered as the centre of the eye.

``` html
    <div style="width:50px; height:50px; position:relative; border:1px solid gray; border-radius:25px;">
        <div id="Pupil" style="width:10px; height:10px; left:20px; top:20px; border-radius:5px; background-color:blue; position:relative;"></div>
    </div>
```

**Step 3:** Select the element, using _jQuery_, and invoke the method _jqEye()_.

``` javascript
    jQuery(document).ready(function() {
        jQuery("#Pupil").jqEye();
    });
```

By default, the eyes has a circular shape and the pupil can move within a radius of 20 pixels. However this can be changed by using the "_options_" parameter:

 * The property "options.shape" defines the shape of the eye, it can be 'circle', 'ellipse', 'rectangle' and 'rounded rectangle';
 * The property "options.radius" defines the radius of the eye, if the shape is a circle, or the radius of his corners, if the shape is a rounded rectangle;
 * The properties "options.width" and "options.height" defines the width and height of the eye, if the shape is a rectangle or an ellipse.

For example:

``` javascript
    jQuery(document).ready(function() {
        jQuery("#Pupil_1").jqEye({shape: "circle", radius:10});
        jQuery("#Pupil_2").jqEye({shape: "ellipse", width:40, height:20});
        jQuery("#Pupil_3").jqEye({shape: "rectangle", width:40, height:20});
        jQuery("#Pupil_4").jqEye({shape: "rounded rectangle", width:40, height:40, radius:10});

    });
```


