// target = document.getElementById("target");
// console.log("Start");


// waveplot = new Waveplot(target);

// waveplot.plot();

panelLeft = document.getElementById("panelLeft");
panelRight = document.getElementById("panelRight");
panelViewer = document.getElementById("panelViewer");
panelFooter = document.getElementById("panelFooter");
panelEditor = document.getElementById("panelEditor")
plotCrystal = document.getElementById("plotCrystal")
plotWaveform = document.getElementById("plotWaveform")
btnPlot = document.getElementById("btnPlot");
boxElement = document.getElementById("boxElement");


// エディタ画面を初期化
var editor = new Editor(panelEditor);

var salmon202 = new SALMON202;

var crystal3d = new Crystal3D(plotCrystal);

function setup() {
    editor.textarea.value = salmon202_sample;
    plot();
}

function plot() {
  salmon202.parse(editor.textarea.value);
  err = [];
  var yn_periodic = salmon202.namelist.data.system.yn_periodic.val;


    // err = []; warn = [];
    if (salmon202.error.length > 0) {
      msg = "";
      for (var i in salmon202.error) {
        var tmp = salmon202.error[i];
        if (tmp.lineNum != undefined) {
          err.push(tmp.lineNum);
          msg += "Line " + tmp.lineNum + ":" + tmp.msg + "!\n";
        }
        crystal3d.clear();
        crystal3d.redraw();

      }
      editor.mark([], err);
    if (err.length > 0)
      editor.jump(err[0]);
      alert(msg);
    } else {
      crystal3d.vec_a1.x = salmon202.vec_a1.x;
      crystal3d.vec_a1.y = salmon202.vec_a1.y;
      crystal3d.vec_a1.z = salmon202.vec_a1.z;
      crystal3d.vec_a2.x = salmon202.vec_a2.x;
      crystal3d.vec_a2.y = salmon202.vec_a2.y;
      crystal3d.vec_a2.z = salmon202.vec_a2.z;
      crystal3d.vec_a3.x = salmon202.vec_a3.x;
      crystal3d.vec_a3.y = salmon202.vec_a3.y;
      crystal3d.vec_a3.z = salmon202.vec_a3.z;

      crystal3d.atom_data = salmon202.atom_data;
      crystal3d.plot((yn_periodic != 'y'));

      var tmp = ``;
      for (var i in salmon202.izatom) {
        var iz = salmon202.izatom[i];
        var symbol = atom_symbol_table[iz];
        var color = atom_color_table[iz];
        tmp += "<span style='background-color:#" + color +";'>" + symbol + "</span>";
      }
      boxElement.innerHTML = tmp;

    }





    // for (var tmp in nml.warning)
    // warn.push(nml.warn[tmp].lineNum);

    // console.log(err,warn);

}

function resize() {
    // Setup Panel size
    panelLeft.style.height = (window.innerHeight - panelLeft.offsetTop - panelFooter.offsetHeight) + "px";
    panelRight.style.height = (window.innerHeight - panelRight.offsetTop - panelFooter.offsetHeight) + "px";
    panelViewer.style.height = (window.innerHeight - panelViewer.offsetTop - panelFooter.offsetHeight) + "px";
    panelEditor.style.height = (window.innerHeight - panelEditor.offsetTop - panelFooter.offsetHeight - 8) + "px";

    plotCrystal.style.width = (panelViewer.clientWidth) + "px";
    plotCrystal.style.height = (panelViewer.clientHeight * 0.75) + "px";
    plotWaveform.style.width = (panelViewer.clientWidth) + "px";
    plotWaveform.style.height = (panelViewer.clientHeight * 0.25) + "px";
    editor.resize();
    crystal3d.redraw();
}

var resize_timer = undefined;
window.onresize = function() {
    if (resize_timer != undefined) clearTimeout(resize_timer);
    resize_timer = setTimeout(resize, 50);
};

btnPlot.onclick = plot;

setup();

resize();