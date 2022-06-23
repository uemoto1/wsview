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
const editor = ace.edit("panelEditor");

var salmon210 = new SALMON210;

var crystal3d = new Crystal3D(plotCrystal);

var waveplot = new Waveplot(plotWaveform);

function setup() {
    //editor.textarea.value = salmon210_sample;
    //plot();
    // editor.setTheme("ace/theme/twilight");
    editor.setValue(salmon210_sample);
    ace.config.setModuleUrl("ace/mode/salmon", "mode-salmon.js")
    editor.session.setMode("ace/mode/salmon");
}

function plot() {
  salmon210.parse(editor.getValue());
  err = [];
  var yn_periodic = salmon210.namelist.data.system.yn_periodic.val;


    // err = []; warn = [];
    if (salmon210.error.length > 0) {
      msg = "";
      for (var i in salmon210.error) {
        var tmp = salmon210.error[i];
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
      crystal3d.vec_a1.x = salmon210.vec_a1.x;
      crystal3d.vec_a1.y = salmon210.vec_a1.y;
      crystal3d.vec_a1.z = salmon210.vec_a1.z;
      crystal3d.vec_a2.x = salmon210.vec_a2.x;
      crystal3d.vec_a2.y = salmon210.vec_a2.y;
      crystal3d.vec_a2.z = salmon210.vec_a2.z;
      crystal3d.vec_a3.x = salmon210.vec_a3.x;
      crystal3d.vec_a3.y = salmon210.vec_a3.y;
      crystal3d.vec_a3.z = salmon210.vec_a3.z;

      crystal3d.atom_data = salmon210.atom_data;
      crystal3d.plot((yn_periodic != 'y'));

      var tmp = ``;
      for (var i in salmon210.izatom) {
        var iz = salmon210.izatom[i];
        var symbol = atom_symbol_table[iz];
        var color = atom_color_table[iz];
        tmp += "<span style='background-color:#" + color +";'>" + symbol + "</span>";
      }
      boxElement.innerHTML = tmp;


      waveplot.ae_shape1 = salmon210.ae_shape1;
      waveplot.e_impulse = salmon210.e_impulse;
      waveplot.e_amplitude1 = salmon210.e_amplitude1;
      waveplot.i_wcm2_1 = salmon210.i_wcm2_1;
      waveplot.tw1 = salmon210.tw1;
      waveplot.omega1 = salmon210.omega1;
      waveplot.epdir_re1 = salmon210.epdir_re1;
      waveplot.epdir_im1 = salmon210.epdir_im1;
      waveplot.phi_cep1 = salmon210.phi_cep1;
      waveplot.ae_shape2 = salmon210.ae_shape2;
      waveplot.e_amplitude2 = salmon210.e_amplitude2;
      waveplot.i_wcm2_2 = salmon210.i_wcm2_2;
      waveplot.tw2 = salmon210.tw2;
      waveplot.omega2 = salmon210.omega2;
      waveplot.epdir_re2 = salmon210.epdir_re2;
      waveplot.epdir_im2 = salmon210.epdir_im2;
      waveplot.phi_cep2 = salmon210.phi_cep2;
      waveplot.t1_t2 = salmon210.t1_t2;
      waveplot.t1_start = salmon210.t1_start;
      waveplot.nt = salmon210.nt;
      waveplot.dt = salmon210.dt;

      waveplot.plot();

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
    //editor.resize();
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
