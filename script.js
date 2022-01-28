target = document.getElementById("target");
console.log("Start");


waveplot = new Waveplot(target);

waveplot.plot();

panelLeft = document.getElementById("panelLeft");

var editor = new Editor(panelLeft);
// スクロールイベントの検出
editor.textarea.onscroll = function(){editor.scroll()};


// Resizing Problem

function setup() {
    panelLeft.style.top = "0px";
    panelRight.style.top = "0px";

}

function resize() {
    panelLeft.style.width = (window.innerWidth * 0.5) + "px";
    panelLeft.style.height = (window.innerHeight) + "px";
    panelRight.style.left = (window.innerWidth * 0.5) + "px";
    panelRight.style.width = (window.innerWidth * 0.5) + "px";
    panelRight.style.height = (window.innerHeight) + "px";
    editor.resize();
}


var resize_timer = null;
window.onresize = function() {
    if (resize_timer !== null) clearTimeout(resize_timer);
    resize_timer = setTimeout(resize, 50);
};

setup();

resize();