if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
        loaded();
    });
} else if (document.attachEvent) {
  document.attachEvent("onreadystatechange", function() {
      loaded;
  });
}

function loaded() {

        setInterval(loop, 350);

}

var x = 0;

var titleText = ["f","fa","far","fark","farky","farky.","farky.x","farky.xy","farky.xyz","farky.xyz","farky.xy","farky.x","farky.","farky","fark","far","fa","f"];
function loop() {

        document.getElementsByTagName("title")[0].innerHTML = titleText[x++%titleText.length];

}
