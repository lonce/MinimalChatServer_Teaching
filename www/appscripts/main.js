define(
[],
function () {

    // From you previous homework
    var hSlider = document.getElementById("hSlider");
    var sSlider = document.getElementById("sSlider");
    var lSlider = document.getElementById("lSlider");

    document.getElementById("clearButton").addEventListener('click',function(){
        paper.clear();
    });

    //=================================================================
    var iosocket = io.connect();

    var typingBox = document.getElementById("outgoingChatMessage");
    var chatBox = document.getElementById("chatBox");

    var uname = prompt("Please enter your name");
    var uname = uname || "anon";

    iosocket.on('connect', function () {
        console.log("Yo.........connected!");

        iosocket.on('message', function(m) {
        	if (m.mtype==="text"){
        		chatBox.value += m.uname + "> " + m.data + "\n";
        	} else if (m.mtype==="path"){
                console.log("received a path!");
                //paper.path(m.data);
                paper.path(m.data[0]).attr({"stroke": m.data[1], "stroke-width" : m.data[2]});
            }
        });
        iosocket.on('disconnect', function() {
            console.log("Disconnected")
        });
    });

    // When the user is typing and hits 'return', add the 
    //     message to the chat window and send the text to the server (and thus to others)
    typingBox.addEventListener('keypress', function(event){
    	var mymessage; // holds tet from the typingBox
    	if(event.which == 13) { // 'return' key
    		event.preventDefault();
 
             //-----------get text, construct message object and send ------------------------------
            mymessage = typingBox.value;
            chatBox.value += uname + "> " + mymessage + "\n";
            iosocket.send({"uname": uname, "mtype": "text", "data": mymessage});
            typingBox.value = "";
            //-------------------------------------------------------------
            //-------------------------------------------------------------
    	}
    });

    //---------------------------------------------

    var paper = new Raphael(document.getElementById("svgcanvas"));

    var raphaelPath;
    var pathString;
    var mousePushed=false;

    var colorString = "hsl(" + hSlider.value + "," + sSlider.value + "," + lSlider.value + ")";;


    var svgdiv = document.getElementById("svgcanvas");
    svgdiv.addEventListener("mousedown", function(e){

    	pathString = "M " + e.offsetX + "," + e.offsetY + " "
        //console.log("pathString is " + pathString);
       	raphaelPath=paper.path(pathString);

        colorString = "hsl(" + hSlider.value + "," + sSlider.value + "," + lSlider.value + ")";
        raphaelPath.attr({"stroke": colorString, "stroke-width" : strokeSlider.value});

    	mousePushed=true;

    });

    svgdiv.addEventListener("mousemove", function(e){
    	if (mousePushed){

	    	pathString += "L " + e.offsetX + "," + e.offsetY + " ";
	    	raphaelPath.attr({path: pathString});
	    	//console.log("pathString is " + pathString);
	    }
    });

    svgdiv.addEventListener("mouseup", function(e){

    	pathString += "L " + e.offsetX + "," + e.offsetY + " ";
    	raphaelPath.attr({path: pathString});
    	//console.log("pathString is " + pathString);
        iosocket.send({"uname" : uname, mtype: "path", "data": [pathString, colorString, strokeSlider.value]});

    	mousePushed=false;
    });



});

 

