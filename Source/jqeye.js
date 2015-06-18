/**
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU Lesser General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program. If not, see <http://www.gnu.org/licenses/>.
 */

/**
 * Definition of the jQuery plugin "jqEye", which allows to create eyes that follows the mouse's position.
 * 
 * @version 1.02
 * @author Jose F. Maldonado
 */
(function( $ ) {
    /**
     * jqEye - Add a behaviour which makes an object to behave like the pupil of an eye and 'follow' the mouse's position.
     * This is accomplished by changing the position of the pupil's object inside the boundaries of an imaginary eye.
     * 
     * The 'options' parameter allows to specify the shape and size of the eyes in which the pupils can move:
     * The property "options.shape" defines the shape of the eye, it can be 'circle', 'ellipse', 'rectangle' and 
     * 'rounded rectangle';
     * The property "options.radius" defines the radius of the eye, if the shape is a circle, or the radius of
     * his corners, if the shape is a rounded rectangle;
     * The properties "options.width" and "options.height" defines the width and height of the eye, if the shape
     * is a rectangle or an ellipse.
     * 
     * @class jqEye
     * @memberOf jQuery.fn
     * 
     * @param {object} options An object with the properties 'shape', 'radius', 'width' and 'height'.
     * @returns {object} A jQuery object (in order to support chaining).
     */
    $.fn.jqEye = function( options ) {
        // --- Set default values --- //
        var settings = $.extend({
            shape: "circle",
            radius: 20,
            width: 40,
            height: 40
            }, options );

        // --- Iterate over each of the selected elements --- //
        return this.each(function() {
            // Get the pupil.
            var pupil = $(this);
            
            // Get the eye center's position, in relative (to the pupil's parent) and absolute coordinates.
            // Note that the methods 'position()' and 'offset()' returns the coordinates of the upper left corner
            // (so in order to get the center's position, the half of the pupil's widht and height must be added).
            var center_x = $(this).position().left + $(this).width()/2;
            var center_y = $(this).position().top + $(this).height()/2;
            var abs_center_x = $(this).offset().left + $(this).width()/2;
            var abs_center_y = $(this).offset().top + $(this).height()/2;
            
            // Define the behaviour for when the mouse is moved.
            $(document).mousemove(function(e) {
                // Get mouse's position (in absolute coordinates).
                var mouse_x = e.clientX;
                var mouse_y = e.clientY;

                // Transform the mouse's position to coordinates relatives to the eye's center.
                var pos_x = mouse_x - abs_center_x + $(window).scrollLeft();
                var pos_y = mouse_y - abs_center_y + $(window).scrollTop();

                // According to the shape of the eye, verify if the mouse is inside or outside the eye.
                // If the mouse is outside the eye, calculate the position of the pupil as the intersection
                // between the eye's shape and a line between the eye's center and the mouse's position.
                if(settings.shape === "rectangle") {
                    var rec = rectangle_position(pos_x, pos_y, settings.width, settings.height);
                    pos_x = rec.x;
                    pos_y = rec.y;
                }
                if(settings.shape === "circle") {
                    var cir = circle_position(pos_x, pos_y, settings.radius);
                    pos_x = cir.x;
                    pos_y = cir.y;
                }
                if(settings.shape === "ellipse") {
                    var ell = ellipse_position(pos_x, pos_y, settings.width/2, settings.height/2);
                    pos_x = ell.x;
                    pos_y = ell.y;
                }
                if(settings.shape === "rounded rectangle") {
                    var rrp = rounded_rectangle_position(pos_x, pos_y, settings.width, settings.height, settings.radius);
                    pos_x = rrp.x;
                    pos_y = rrp.y;
                }

                // Transform the coordinates, relatives to the eye's center, to coordinates relatives to
                // the pupil's parent (these coordinates are the ones need for define the pupil's new position).
                pos_x = pos_x + center_x - pupil.width()/2;
                pos_y = pos_y + center_y - pupil.height()/2;

                // Move pupil.
                pupil.css({
                    left: pos_x,
                    top: pos_y
                });
            }); 
        });
		
        // --- Private functions --- //
        function rectangle_position(x, y, width, height) {
            // Rectangle: -w < x < w ; -h < y < h
            var res = {x: x, y: y};
            if(x > width/2) res.x = width/2;
            if(x < -width/2) res.x = -width/2;
            if(y > height/2) res.y = height/2;
            if(y < -height/2) res.y = -height/2;
            return res;
        };
        function circle_position(x, y, r) {
            // Circle: x^2 + y^2 = r^2
            var res = {x: x, y: y};
            if(x*x + y*y > r*r) {
                if(x !== 0) {
                    var m = y/x;
                    res.x = Math.sqrt(r*r / (m*m + 1));
                    res.x = (x > 0)? res.x : -res.x;
                    res.y = Math.abs(m * res.x);
                    res.y = (y > 0)? res.y : -res.y;
                } else {
                    res.y = y > 0? r : -r;
                }
            }
            return res;
        };
        function ellipse_position(x, y, a, b) {
            // Ellipse: (x/a)^2 + (y/b)^2 = 1
            var res = {x: x, y: y};
            if( (x*x)/(a*a) + (y*y)/(b*b) > 1) {
                if(x !== 0) {
                    var m = y/x;
                    res.x = Math.sqrt(1 / (1/(a*a) + (m*m)/(b*b)));
                    res.x = (x > 0)? res.x : -res.x;
                    res.y = Math.abs(m * res.x);
                    res.y = (y > 0)? res.y : -res.y;
                } else {
                    res.y = y > 0? b : -b;
                }
            }
            return res;
        };
        function rounded_rectangle_position (x, y, width, height, radius) {
            // Rounded rectangle: mix of rectangle and circle, depending of the point's position.
            var res = {x: x, y: y};
            
            // Verify if the point is near a corner.
            var limit_x = width/2 - radius;
            var limit_y = height/2 - radius;
            if(Math.abs(x) > limit_x && Math.abs(y) > limit_y) {
                // The point is near a corner.
                var cir = circle_position(Math.abs(x) - limit_x, Math.abs(y) - limit_y, radius);
                res.x = x > 0? (cir.x + limit_x) : -(cir.x + limit_x);
                res.y = y > 0? (cir.y + limit_y) : -(cir.y + limit_y);
            } else {
                // The point is not near a corner.
                res = rectangle_position(x, y, width, height);
            }
            
            return res;
        }
    };
}( jQuery ));
