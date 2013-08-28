var first;
var popped;
var startX;
var startY;
var newX;
var newY;
var moveX;
var moveY;
var count = 1;
var dragType;
var highlighted;
var droptarget;
var droptarget_node;
var dragged;

var removeaccess;
var grantaccess;

var trash = document.getElementById("trash");
var allusers = document.getElementsByClassName("rightuser");
var background = document.getElementsByClassName("background");


var aid;


document.onmousedown = mouseDown;
document.onmouseup = mouseUp;


function mouseDown(e) 
{
	var target = e.target;
	if ((e.button === 0) && (target.className === 'albumDrag_pop' || target.className === 'userDrag_pop'))
	{
		dragType = target.className;

		var id = target.id
		popped = document.getElementById(id);

		running = 0;
		count = 1;
		highlighted =0;

		startX = e.clientX;
		newX = e.clientX;
		startY =  e.clientY;
		newY = e.clientY;
		moveY = 0;
		moveX = 0;
		popped.style.opacity = "0.5";
		document.onmousemove = mouseMove;	
		document.body.focus();
		return false;
	}
}


function mouseUp(e)
{	
	var target = e.target;

	if (e.button === 0 && highlighted === 1)
	{
		if (target.className === 'albumDrag_pop')
		{
			addAccess(target.id,droptarget);
			target.style.opacity= "0";	
			running = 1;
			droptarget_node.remove();
			goBack();

		}
		else if (target.className === 'userDrag_pop')
		{
			removeAccess(target);
		}

		document.onmousemove = null;
		dragType = null;
	}
	else
	{
		running = 1;
		goBack();
		document.onmousemove = null;
		dragType = null;
	}
	trash.style.backgroundColor='#FFFFFF';
	for (var i=0; i < allusers.length; i++)	allusers[i].style.backgroundColor='#FFFFFF';
	highlighted=0;
}

function goBack() 
{
	newY = moveY - count*moveY/10;
	newX = moveX - count*moveX/10;

	count++;
	if (count < 12 && running === 1)
	{		
	popped.style.top = newY+'px';
	popped.style.left = newX+'px';
		var t = setTimeout("goBack()", 1);
	}
	if (count === 12 && running === 1) 
	{
		running = 0;
		popped.style.opacity = "0";
	}	
}



function mouseMove(e)
{
	var target = e.target;
	
	moveX = e.clientX - startX;
	moveY = e.clientY - startY;
	popped.style.left = moveX+'px';
	popped.style.top = moveY+'px';

	if (dragType === 'albumDrag_pop')
	{
		for (var i=0; i < allusers.length; i++)
		{
			if (((e.clientX+window.pageXOffset )>= findPos(allusers[i])[0]) && ((e.clientY+window.pageYOffset)>= findPos(allusers[i])[1]) && ((e.clientX+window.pageXOffset) <= (findPos(allusers[i])[0] + allusers[i].offsetWidth)) && ((e.clientY + window.pageYOffset) <= (findPos(allusers[i])[1] + allusers[i].offsetHeight))) 
			{
				allusers[i].style.backgroundColor = '#FFFF00';
				trash.style.backgroundColor = '#FFFFFF';
				droptarget = allusers[i].firstChild.nodeValue;
				droptarget_node = allusers[i];
				highlighted = 1;
			}
			else 
			{
				allusers[i].style.backgroundColor = '#FFFFFF';
			}
		}
	
		if ( (e.clientX+window.pageXOffset) < findPos(allusers[0])[0] || (e.clientX+window.pageXOffset) > (findPos(allusers[0])[0]+allusers[0].offsetWidth) || (e.clientY+window.pageYOffset) < findPos(allusers[0])[1] || (e.clientY+window.pageYOffset) > (findPos(allusers[0])[1]+(allusers[0].offsetWidth*(allusers.length-1))))
		{
			trash.style.backgroundColor ='#FFFFFF'; 
			for (var i=0; i < allusers.length; i++)
			{
			allusers[i].style.backgroundColor = '#FFFFFF';
			}
			highlighted=0;	
		}
	}
	else if (dragType === 'userDrag_pop') 
	{
		if ((((e.clientX+window.pageXOffset )>= findPos(trash)[0]) && ((e.clientY+window.pageYOffset )>= findPos(trash)[1]) && ((e.clientX+window.pageXOffset) <= (findPos(trash)[0] + trash.offsetWidth)) && ((e.clientY + window.pageYOffset) <= (findPos(trash)[1] + trash.offsetHeight))))
		{
			trash.style.backgroundColor = '#FFFF00';
			for (var i=0; i < allusers.length; i++)
			{
			allusers[i].style.backgroundColor = '#FFFFFF';
			}
			dropTarget = trash.firstChild.nodeValue;
			highlighted = 1;
		}	
		else 
		{
			highlighted = 0;
			trash.style.backgroundColor = '#FFFFFF';
			for (var i=0; i < allusers.length; i++)
			{
			allusers[i].style.backgroundColor = '#FFFFFF';
			}
		}
	}
	
}

function findPos(obj) {
	var curleft = curtop = 0;
	do {
		curleft += obj.offsetLeft;
		curtop += obj.offsetTop;
	} while (obj = obj.offsetParent);
	return [curleft, curtop];
}

function addAccess(aid,user)
{
	cellid = aid+"cell";
	var x = document.createElement('div');
	x.className = 'draggable_container';
	var y = document.createElement('div');
	y.className = 'userDrag';
	y.id = user;
	y.title = user;
	y.appendChild(document.createTextNode(user));

	var z = document.createElement('div');
	z.className = 'userDrag_pop';
	z.id = user + '_pop';
	z.title = user;
	z.appendChild(document.createTextNode('Move to trash?'));
		
	x.appendChild(y);
	x.appendChild(z);	
	document.getElementById(cellid).appendChild(x);
} 


function removeAccess(obj)
{
user = obj.title;
aid = obj.getAttribute("name");
console.log(obj);
var x = document.createElement('div');
x.className = 'rightuser';
x.name = obj.title;
x.innerText = obj.title;
document.getElementsByClassName('rightside')[0].appendChild(x);
obj.parentNode.parentNode.removeChild(obj.parentNode);
}

function confirm_delete()
{
	return confirm("Are you Sure you Want to Delete?");

}
