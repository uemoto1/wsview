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


// Resizing Problem
samplecode = `!########################################################################################!
! Excercise 06: Electron dynamics in crystalline silicon under a pulsed electric field   !
!----------------------------------------------------------------------------------------!
! * The detail of this excercise is expained in our manual(see chapter: 'Exercises').    !
!   The manual can be obtained from: https://salmon-tddft.jp/documents.html              !
! * Input format consists of group of keywords like:                                     !
!     &group                                                                             !
!       input keyword = xxx                                                              !
!     /                                                                                  !
!   (see chapter: 'List of input keywords' in the manual)                                !
!----------------------------------------------------------------------------------------!
! * Conversion from unit_system = 'a.u.' to 'A_eV_fs':                                   !
!   Length: 1 [a.u.] = 0.52917721067    [Angstrom]                                       !
!   Energy: 1 [a.u.] = 27.21138505      [eV]                                             !
!   Time  : 1 [a.u.] = 0.02418884326505 [fs]                                             !
!----------------------------------------------------------------------------------------!
! * Copy the ground state data directory('data_for_restart') (or make symbolic link)     !
!   calculated in 'samples/exercise_04_bulkSi_gs/' and rename the directory to 'restart/'!
!   in the current directory.                                                            !
!########################################################################################!

&calculation
  !type of theory
  theory = 'tddft_pulse'
/

&control
  !common name of output files
  sysname = 'Si'
/

&units
  !units used in input and output files
  unit_system = 'a.u.'
/

&system
  !periodic boundary condition
  yn_periodic = 'y'
  
  !grid box size(x,y,z)
  al(1:3) = 10.26d0, 10.26d0, 10.26d0
  
  !number of elements, atoms, electrons and states(bands)
  nelem  = 1
  natom  = 8
  nelec  = 32
  nstate = 32
/

&pseudo
  !name of input pseudo potential file
  file_pseudo(1) = './Si_rps.dat'
  
  !atomic number of element
  izatom(1) = 14
  
  !angular momentum of pseudopotential that will be treated as local
  lloc_ps(1) = 2
  !--- Caution -------------------------------------------!
  ! Index must correspond to those in &atomic_red_coor.   !
  !-------------------------------------------------------!
/

&functional
  !functional('PZ' is Perdew-Zunger LDA: Phys. Rev. B 23, 5048 (1981).)
  xc = 'PZ'
/

&rgrid
  !number of spatial grids(x,y,z)
  num_rgrid(1:3) = 12, 12, 12
/

&kgrid
  !number of k-points(x,y,z)
  num_kgrid(1:3) = 4, 4, 4
/

&tgrid
  !time step size and number of time grids(steps)
  dt = 0.08d0
  nt = 6000
/

&emfield
  !envelope shape of the incident pulse('Acos2': cos^2 type envelope for vector potential)
  ae_shape1 = 'Acos2'
  
  !peak intensity(W/cm^2) of the incident pulse
  I_wcm2_1 = 5.0d11
  
  !duration of the incident pulse
  tw1 = 441.195136248d0
  
  !mean photon energy(average frequency multiplied by the Planck constant) of the incident pulse
  omega1 = 0.05696145187d0
  
  !polarization unit vector(real part) for the incident pulse(x,y,z)
  epdir_re1(1:3) = 0.0d0, 0.0d0, 1.0d0
  !--- Caution ---------------------------------------------------------!
  ! Defenition of the incident pulse is wrriten in:                     !
  ! https://www.sciencedirect.com/science/article/pii/S0010465518303412 !
  !---------------------------------------------------------------------!
/

&atomic_red_coor
  !cartesian atomic reduced coodinates
  'Si'	.0	.0	.0	1
  'Si'	.25	.25	.25	1
  'Si'	.5	.0	.5	1
  'Si'	.0	.5	.5	1
  'Si'	.5	.5	.0	1
  'Si'	.75	.25	.75	1
  'Si'	.25	.75	.75	1
  'Si'	.75	.75	.25	1
  !--- Format ---------------------------------------------------!
  ! 'symbol' x y z index(correspond to that of pseudo potential) !
  !--------------------------------------------------------------!
/
`;

function setup() {
    editor.textarea.value =samplecode;
}


rule = {
    "calculation": {
        "theory": {type:'character(64)', default_val:"", },
    },
    "control": {
        "sysname": {type:'character(64)', default_val:"", },
    },
    "units": {
        "unit_system": {type:'character(64)', default_val:"", },
    },
    "system": {
        "yn_periodic": {type:'character(64)', default_val:"", },
        "al": {type:'real(8)', default_val:0.0, imin:1, imax:3, },
        "nelem": {type:'integer', default_val:0, },
        "natom": {type:'integer', default_val:0, },
        "nelec": {type:'integer', default_val:0, },
        "nstate": {type:'integer', default_val:0, },
    },
    "pseudo": {
        "file_pseudo": {type:'character(64)', default_val:"", imin:1, imax:99 },
        "izatom": {type:'integer', default_val:0, imin:1, imax:99},
        "lloc_ps": {type:'integer', default_val:0, imin:1, imax:99},
    },
    "functional": {
        "xc": {type:'character(64)', default_val:"", },
    },
    "rgrid": {
        "num_rgrid": {type:'integer', default_val:0, imin:1, imax:3},
    },
    "kgrid": {
        "num_kgrid": {type:'integer', default_val:0, imin:1, imax:3},
    },
    "tgrid": {
        "dt": {type:'real(8)', default_val:0.0, },
        "nt": {type:'integer', default_val:0, },
    },
    "emfield": {
        "ae_shape1": {type:'character(64)', default_val:"", },
        "i_wcm2_1": {type:'real(8)', default_val:0.0, },
        "tw1": {type:'real(8)', default_val:0.0, },
        "omega1": {type:'real(8)', default_val:0.0, },
        "epdir_re1": {type:'real(8)', default_val:0.0, imin:1, imax:3, },
    },
}


function plot() {
    var nml = new Namelist(rule);
    nml.ignore = ["atomic_red_coor"];
    nml.parse(editor.textarea.value);

    err = []; warn = [];
    for (var tmp in nml.error)
      err.push(nml.error[tmp].lineno);
    for (var tmp in nml.warning)
    warn.push(nml.warn[tmp].lineno);

    console.log(err,warn);
    editor.mark(warn, err);
    
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