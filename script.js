// target = document.getElementById("target");
// console.log("Start");


// waveplot = new Waveplot(target);

// waveplot.plot();

panelLeft = document.getElementById("panelLeft");
panelRight = document.getElementById("panelRight");
panelViewer = document.getElementById("panelViewer");
panelFooter = document.getElementById("panelFooter");
panelEditor = document.getElementById("panelEditor")
btnPlot = document.getElementById("btnPlot");

// エディタ画面を初期化
var editor = new Editor(panelEditor);
editor.textarea.onscroll = function(){editor.scroll()};

var salmon202 = new SALMON202;

function setup() {
    editor.textarea.value = salmon202_sample;
}

function plot() {
  salmon202.parse(editor.textarea.value);

    // err = []; warn = [];
    // for (var tmp in nml.error)
    //   err.push(nml.error[tmp].lineno);
    // for (var tmp in nml.warning)
    // warn.push(nml.warn[tmp].lineno);

    // console.log(err,warn);
    // editor.mark(warn, err);

}

function resize() {
    // Setup Panel size
    panelLeft.style.height = (window.innerHeight - panelLeft.offsetTop - panelFooter.offsetHeight) + "px";
    panelRight.style.height = (window.innerHeight - panelRight.offsetTop - panelFooter.offsetHeight) + "px";
    panelViewer.style.height = (window.innerHeight - panelViewer.offsetTop - panelFooter.offsetHeight) + "px";
    panelEditor.style.height = (window.innerHeight - panelEditor.offsetTop - panelFooter.offsetHeight - 8) + "px";
    editor.resize();
}

var resize_timer = undefined;
window.onresize = function() {
    if (resize_timer != undefined) clearTimeout(resize_timer);
    resize_timer = setTimeout(resize, 50);
};

btnPlot.onclick = plot;

setup();

resize();