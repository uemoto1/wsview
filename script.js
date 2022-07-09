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
btnCif = document.getElementById("btnCif");
boxElement = document.getElementById("boxElement");

selectN1 = document.getElementById("selectN1");
selectN2 = document.getElementById("selectN2");
selectN3 = document.getElementById("selectN3");
selectBond = document.getElementById("selectBond");

rangeZoom =  document.getElementById("rangeZoom");

// エディタ画面を初期化
const editor = ace.edit("panelEditor");

var salmon210 = new SALMON210;

var crystal3d = new Crystal3D(plotCrystal);

var waveplot = new Waveplot(plotWaveform);

function setup() {
    editor.setValue(salmon210_sample);
    ace.config.setModuleUrl("ace/mode/salmon", "mode-salmon.js")
    editor.session.setMode("ace/mode/salmon");
    editor.clearSelection();

    // Set event Listener
    btnPlot.onclick = plot;
    selectN1.onchange = changeN;
    selectN2.onchange = changeN;
    selectN3.onchange = changeN;
    selectBond.onchange = changeBond;
    rangeZoom.onchange = changeZoom;

    plotCrystal.onclick = selectAtom;

    plot();
    resize();
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
        tmp += "<span class='rounded-pill' style='margin:4px;padding:16px;background-color:#" + color +";'>" + symbol + "</span>";
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

      var cif = crystal3d.to_cif();
      var blob = new Blob([cif], {"type": "text/plain"});
      if (window.navigator.msSaveBlob) {
        window.navigator.msSaveBlob(blob, "export.cif");
        window.navigator.msSaveOrOpenBlob(blob, "export.cif");
      } else {
        btnCif.href = window.URL.createObjectURL(blob);
      }

    }
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
    editor.resize();
}

function changeN() {
  crystal3d.ncell1 = (parseInt(selectN1.value));
  crystal3d.ncell2 = (parseInt(selectN2.value));
  crystal3d.ncell3 = (parseInt(selectN3.value));
  plot();
}

function changeBond() {
  crystal3d.bond_length = (parseInt(selectBond.value));
  plot();
}

function changeZoom() {
  crystal3d.zoom = parseInt(rangeZoom.value) * 0.01;
  crystal3d.redraw();
}

function selectAtom() {
  var i = crystal3d.selected_index;
  if (i >= 0) {
    var iz = crystal3d.atom_data[i].iz;
    var t1 = crystal3d.atom_data[i].t1;
    var t2 = crystal3d.atom_data[i].t2;
    var t3 = crystal3d.atom_data[i].t3;
    var lineNum = crystal3d.atom_data[i].lineNum;
    panelFooter.innerText = "Atom " + i + " Z=" + iz +" (" + t1 + ", " + t2 + ", " + t3 + ")";
    // editor.selection.moveCursorToPosition({row: lineNum, col: 0});
    // editor.selection.selectLine();
    editor.gotoLine(lineNum, 0, true);
  }
}




var resize_timer = undefined;
window.onresize = function() {
    if (resize_timer != undefined) clearTimeout(resize_timer);
    resize_timer = setTimeout(resize, 50);
};

// Start main program...
setup();
