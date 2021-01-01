//
// Torbert, 18 December 2019
//
var c = document . getElementById( 'myCanvas' ) ;
var ctx = c . getContext( '2d' ) ;
var width  = c.width  ;
var height = c.height ;
//
var myImageData = ctx.createImageData( width , height ) ;
//
var remin = -2.0 ;
var remax =  2.0 ;
var immin = -1.5 ;
var immax =  1.5 ;
//
var tmax = 10 ;
//
var mousedown = false ;
//
//
//------------------------------------------------------
//
function f( re , im , n )
{
    var j = 0 ;
    //
    var a = 0 ;
    var b = 0 ;
    //
    var anew = 0 ;
    var bnew = 0 ;
    //
    while( j < n )
    {
        if( a*a + b*b > 4 ) break ;
        //
        anew = a*a - b*b + re ;
        bnew = 2.0 * a * b + im ;
        //
        a = anew ;
        b = bnew ;
        //
        j++ ;
    }
    //
    return j ;
}
//
function draw()
{
    var data = myImageData . data ;
    //
    var x = 0 ;
    var y = 0 ;
    //
    var red , gre , blu ;
    //
    var re , im , t ;
    //
    for (var i = 0 ; i < data . length ; i += 4 )
    {
        re = remin + x * ( remax - remin ) / width ;
        im = immin + y * ( immax - immin ) / height ;
        //
        t = f( re , im , tmax ) ;
        //
        if( t == tmax )
        {
            red = 0 ;
            gre = 0 ;
            blu = 0 ;
        }
        else
        {
            red = 255 * t * 1.0 / tmax ;
            gre = 255 * t * 1.0 / tmax;
            blu = 255 * t * 1.0 / tmax;
        }
        //
        x++ ;
        //
        if( x == width )
        {
            x = 0 ;
            y++ ;
        }
        //
        data[i]     = red ;
        data[i + 1] = gre ;
        data[i + 2] = blu ;
        data[i + 3] = 255 ; // alpha - transparency
    }
    //
    ctx . putImageData( myImageData , 0 , 0 ) ;
}
//
//------------------------------------------------------
//
function line(x1,y1,x2,y2)
{
    ctx . strokeStyle = "#FF0000" ; // red
    //
    ctx . beginPath() ;
    //
    ctx . moveTo( x1 , y1 ) ;
    //
    ctx . lineTo( x2 , y2 ) ;
    //
    ctx . closePath() ;
    //
    ctx . stroke() ;
}
//
//------------------------------------------------------
//
function press(x,y)
{
    draw() ;
    //
    var re = remin + x * ( remax - remin ) / width ;
    var im = immin + y * ( immax - immin ) / height ;
    //
    x = ( 0.0 - remin ) * width  / ( remax - remin ) ;
    y = ( 0.0 - immin ) * height / ( immax - immin ) ;
    //
    var xnew ;
    var ynew ;
    //
    var t = 0 ;
    //
    var a = 0 ;
    var b = 0 ;
    //
    var anew = 0 ;
    var bnew = 0 ;
    //
    while( t < tmax )
    {
        if( a*a + b*b > 4 ) break ;
        //
        anew = a*a - b*b + re ;
        bnew = 2.0 * a * b + im ;
        //
        xnew = ( anew - remin ) * width  / ( remax - remin ) ;
        ynew = ( bnew - immin ) * height / ( immax - immin ) ;
        //
        line( x , y , xnew , ynew ) ;
        //
        x = xnew ;
        y = ynew ;
        //
        a = anew ;
        b = bnew ;
        //
        t++ ;
    }
}
function release()
{
    //
    // nothing
    //
}
//
//------------------------------------------------------
//
document.addEventListener('keydown', function(evnt) {
  if( evnt.key == 'ArrowUp' )
  {
    tmax *= 2 ;
    //
    draw() ;
  }
  else if( evnt.key == 'ArrowDown' )
  {
      tmax /= 2 ;
      //
      if( tmax < 5 ) tmax = 5 ;
      //
      draw() ;
  }
}
) ;
//
//------------------------------------------------------
//
function getMousePos( canvas , evnt )
{
    var rect = canvas . getBoundingClientRect() ;
    //
    return {
        x : evnt.clientX - rect.left ,
        y : evnt.clientY - rect.top
    } ;
}
//
c.onmousemove = function(evnt)
{
    var mousePos = getMousePos( c , evnt ) ;
    //
    var x = mousePos.x ;
    var y = mousePos.y ; 
    //
    if(mousedown) press( x , y ) ;
} ;
//
c.onmousedown = function(evnt)
{
    var mousePos = getMousePos( c , evnt ) ;
    //
    var x = mousePos.x ;
    var y = mousePos.y ; 
    //
    mousedown = false ;
    //
    if( evnt . which == 1 ) // left click zoom
    {
        var re = remin + x * ( remax - remin ) / width ;
        var im = immin + y * ( immax - immin ) / height ;
        //
        var dre = remax - remin ;
        var dim = immax - immin ;
        //
        dre *= 0.5 ;
        dim *= 0.5 ;
        //
        remax = re + dre * 0.5 ;
        remin = re - dre * 0.5 ;
        immax = im + dim * 0.5 ;
        immin = im - dim * 0.5 ;
        //
        console.log( remin , remax , immin , immax ) ;
        //
        draw() ;
    }
    else if( evnt . which == 3 ) // right click show iteration
    {
        mousedown = true ;
        //
        press( x , y ) ;
    }
} ;
//
c.onmouseup = function(evnt)
{
    mousedown = false ;
    //
    var mousePos = getMousePos( c , evnt ) ;
    //
    var x = mousePos.x ;
    var y = mousePos.y ; 
    //
    release() ;
} ;
// ------------------------------------------------------
//
// https://developer.mozilla.org/en-US/docs/Web/Guide/Events/Touch_events
//
var ongoingTouches = new Array();
//
function handleStart(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  var x , y ;
        
  for (var i=0; i < touches.length; i++) {
    ongoingTouches.push(copyTouch(touches[i]));
    //
	x = touches[i].pageX ;
	y = touches[i].pageY ;
	//
	press(x,y);
  }
}
function handleMove(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  var dx , dy , theta ;

  for (var i=0; i < touches.length; i++) {
	 //
	 var x = touches[i].pageX ;
	 var y = touches[i].pageY ;
	 //
	 // do nothing
	 //
    var idx = ongoingTouchIndexById(touches[i].identifier);
    if(idx >= 0) {
      ongoingTouches.splice(idx, 1, copyTouch(touches[i]));  // swap in the new touch record
    }
    else {
      ongoingTouches.push(copyTouch(touches[i])); // could not find... start another... ???
    }
  }
}
function handleEnd(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;

  release() ;

  for (var i=0; i < touches.length; i++) {
    var idx = ongoingTouchIndexById(touches[i].identifier);
    if(idx >= 0) {
      ongoingTouches.splice(idx, 1);  // remove it; we're done
    }
  }
}
function handleCancel(evt) {
  evt.preventDefault();
  var touches = evt.changedTouches;
  for (var i=0; i < touches.length; i++) {
    ongoingTouches.splice(i, 1);  // remove it; we are done
  }
}
function copyTouch(touch) {
  return { identifier: touch.identifier, pageX: touch.pageX, pageY: touch.pageY };
}
function ongoingTouchIndexById(idToFind) {
  for (var i=0; i < ongoingTouches.length; i++) {
    var id = ongoingTouches[i].identifier;
    
    if (id == idToFind) {
      return i;
    }
  }
  return -1;    // not found
}
//
// ------------------------------------------------------
//
// main
//
var el = document . getElementById( 'myCanvas' ) ;
//
el.addEventListener("touchstart", handleStart, false);
el.addEventListener("touchend", handleEnd, false);
el.addEventListener("touchcancel", handleCancel, false);
el.addEventListener("touchleave", handleEnd, false);
el.addEventListener("touchmove", handleMove, false);
//
draw() ;
//
// end of file
//