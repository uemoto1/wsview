// SALMON v 2.1.0 principal input parameters




salmon210_sample = `!########################################################################################!
! Excercise 06: Electron dynamics in crystalline silicon under a pulsed electric field   !
!----------------------------------------------------------------------------------------!
! * The detail of this excercise is explained in our manual(see chapter: 'Exercises').   !
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
  unit_system = 'A_eV_fs'
/

&system
  !periodic boundary condition
  yn_periodic = 'y'
  
  !grid box size(x,y,z)
  al(1:3) = 5.43d0, 5.43d0, 5.43d0
  
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
  dt = 0.002d0
  nt = 6000
/

&emfield
  !envelope shape of the incident pulse('Acos2': cos^2 type envelope for vector potential)
  ae_shape1 = 'Acos2'
  
  !peak intensity(W/cm^2) of the incident pulse
  I_wcm2_1 = 1.0d12
  
  !duration of the incident pulse
  tw1 = 10.672d0
  
  !mean photon energy(average frequency multiplied by the Planck constant) of the incident pulse
  omega1 = 1.55d0
  
  !polarization unit vector(real part) for the incident pulse(x,y,z)
  epdir_re1(1:3) = 0.0d0, 0.0d0, 1.0d0
  !--- Caution ---------------------------------------------------------!
  ! Definition of the incident pulse is written in:                     !
  ! https://www.sciencedirect.com/science/article/pii/S0010465518303412 !
  !---------------------------------------------------------------------!
/

&analysis
  !energy grid size and number of energy grids for output files
  de      = 0.01d0
  nenergy = 3000
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

function _parseFString(x) {
    return x.replace(/"|'/g, "")
}

function _parseFString1d(x) {
    var tmp = {}
    for (var i in x) {
        tmp[i] = _parseFString(x[i])
    }
    return tmp
}

function _parseFFloat(x) {
    return parseFloat(x.replace(/d|D/,"e"))
}

function _parseFFloat1d(x) {
    var tmp = {}
    for (var i in x) {
        tmp[i] = _parseFFloat(x[i])
    }
    return tmp
}

function _parseFFloat2d(x) {
    var tmp = {}
    for (var i in x) {
        tmp[i] = {}
        for (var j in x[i]) {
            tmp[i][j] = _parseFFloat(x[i][j])
        }
    }
    return tmp
}

function _parseInt1d(x) {
    var tmp = {}
    for (var i in x) {
        tmp[i] = parseInt(x[i])
    }
    return tmp
}

class SALMON210 {



    constructor() {
        this.nml = new Namelist();
        this.nml.add_group("units");
        this.nml.add_group("system");
        this.nml.add_group("pseudo");
        this.nml.add_group("rgrid");
        this.nml.add_group("tgrid");
        this.nml.add_group("emfield");
        this.nml.add_group("maxwell");
        this.nml.add_group("multiscale");
        this.nml.add_variable("units", "unit_system", [], "a.u.")
        this.nml.add_variable("system", "yn_periodic", [], "n")
        this.nml.add_variable("system", "al_vec1", [[1, 3]], "0")
        this.nml.add_variable("system", "al_vec2", [[1, 3]], "0")
        this.nml.add_variable("system", "al_vec3", [[1, 3]], "0")
        this.nml.add_variable("system", "al", [[1, 3]], "0")
        this.nml.add_variable("system", "nelem", [], "0")
        this.nml.add_variable("system", "natom", [], "0")
        this.nml.add_variable("pseudo", "izatom", [[1,99]], "0")
        this.nml.add_variable("rgrid", "num_rgrid", [[1, 3]], "0")
        this.nml.add_variable("rgrid", "dl", [[1, 3]], "0")
        this.nml.add_variable("tgrid", "dt", [], "0")
        this.nml.add_variable("tgrid", "nt", [], "0")
        this.nml.add_variable("emfield", "e_impulse", [], "0")
        this.nml.add_variable("emfield", "ae_shape1", [], "none")
        this.nml.add_variable("emfield", "e_amplitude1", [], "0")
        this.nml.add_variable("emfield", "i_wcm2_1", [], "0")
        this.nml.add_variable("emfield", "tw1", [], "0")
        this.nml.add_variable("emfield", "omega1", [], "0")
        this.nml.add_variable("emfield", "epdir_re1", [[1, 3]], "0")
        this.nml.add_variable("emfield", "epdir_im1", [[1, 3]], "0")
        this.nml.add_variable("emfield", "phi_cep1", [], "0")
        this.nml.add_variable("emfield", "ae_shape2", [], "none")
        this.nml.add_variable("emfield", "e_amplitude2", [], "0")
        this.nml.add_variable("emfield", "i_wcm2_2", [], "0")
        this.nml.add_variable("emfield", "tw2", [], "0")
        this.nml.add_variable("emfield", "omega2", [], "0")
        this.nml.add_variable("emfield", "epdir_re2", [[1, 3]], "0")
        this.nml.add_variable("emfield", "epdir_im2", [[1, 3]], "0")
        this.nml.add_variable("emfield", "phi_cep2", [], "0")
        this.nml.add_variable("emfield", "t1_t2", [], "0")
        this.nml.add_variable("emfield", "t1_start", [], "0")
        this.nml.add_variable("maxwell", "n_s", [], "0")
        this.nml.add_variable("maxwell", "id_s", [[1, 8]], "0")
        this.nml.add_variable("maxwell", "typ_s", [[1, 8]], "")
        this.nml.add_variable("maxwell", "ori_s", [[1, 8], [1, 3]], "0")
        this.nml.add_variable("maxwell", "inf_s", [[1, 8], [1, 5]], "0")
        this.nml.add_variable("maxwell", "al_em", [[1, 3]], "0")
        this.nml.add_variable("maxwell", "num_rgrid_em", [[1, 3]], "0")
        this.nml.add_variable("maxwell", "at_em", [], "0")
        this.nml.add_variable("multiscale", "nx_m", [], "1")
        this.nml.add_variable("multiscale", "ny_m", [], "1")
        this.nml.add_variable("multiscale", "nz_m", [], "1")
        this.nml.add_variable("multiscale", "hx_m", [], "1.00")
        this.nml.add_variable("multiscale", "hy_m", [], "1.00")
        this.nml.add_variable("multiscale", "hz_m", [], "1.00")
    }

    parse(inputfile) {
        const inputfile_nml = this._exclude_atomic_coor(inputfile)
        this.nml.parse(inputfile_nml);

        // Namelist読み込み時にエラーが検出された場合は終了する
        if (! this.nml.success) {
            this.errorLineNum = this.nml.errorLineNum;
            return;
        }

        this.unit_system = _parseFString(this.nml.data.units.unit_system)
        this.yn_periodic = _parseFString(this.nml.data.system.yn_periodic)
        this.al_vec1 = _parseFFloat1d(this.nml.data.system.al_vec1)
        this.al_vec2 = _parseFFloat1d(this.nml.data.system.al_vec2)
        this.al_vec3 = _parseFFloat1d(this.nml.data.system.al_vec3)
        this.al = _parseFFloat1d(this.nml.data.system.al)
        this.nelem = parseInt(this.nml.data.system.nelem)
        this.izatom = _parseInt1d(this.nml.data.pseudo.izatom)
        this.natom = parseInt(this.nml.data.pseudo.natom)
        this.num_rgrid = _parseInt1d(this.nml.data.rgrid.num_rgrid)
        this.dl = _parseFFloat1d(this.nml.data.rgrid.dl)
        this.dt = _parseFFloat(this.nml.data.tgrid.dt)
        this.nt = parseInt(this.nml.data.tgrid.nt)
        this.e_impulse = _parseFFloat(this.nml.data.emfield.e_impulse)
        this.ae_shape1 = _parseFString(this.nml.data.emfield.ae_shape1)
        this.e_amplitude1 = _parseFFloat(this.nml.data.emfield.e_amplitude1)
        this.i_wcm2_1 = _parseFFloat(this.nml.data.emfield.i_wcm2_1)
        this.tw1 = _parseFFloat(this.nml.data.emfield.tw1)
        this.omega1 = _parseFFloat(this.nml.data.emfield.omega1)
        this.epdir_re1 = _parseFFloat1d(this.nml.data.emfield.epdir_re1)
        this.epdir_im1 = _parseFFloat1d(this.nml.data.emfield.epdir_im1)
        this.phi_cep1 = _parseFFloat(this.nml.data.emfield.phi_cep1)
        this.ae_shape2 = _parseFString(this.nml.data.emfield.ae_shape2)
        this.e_amplitude2 = _parseFFloat(this.nml.data.emfield.e_amplitude2)
        this.i_wcm2_2 = _parseFFloat(this.nml.data.emfield.i_wcm2_2)
        this.tw2 = _parseFFloat(this.nml.data.emfield.tw2)
        this.omega2 = _parseFFloat(this.nml.data.emfield.omega2)
        this.epdir_re2 = _parseFFloat1d(this.nml.data.emfield.epdir_re2)
        this.epdir_im2 = _parseFFloat1d(this.nml.data.emfield.epdir_im2)
        this.phi_cep2 = _parseFFloat(this.nml.data.emfield.phi_cep2)
        this.t1_t2 = _parseFFloat(this.nml.data.emfield.t1_t2)
        this.t1_start = _parseFFloat(this.nml.data.emfield.t1_start)
        this.n_s = parseInt(this.nml.data.maxwell.n_s)
        this.id_s = _parseInt1d(this.nml.data.maxwell.id_s)
        this.typ_s = _parseFString1d(this.nml.data.maxwell.typ_s)
        this.ori_s = _parseFFloat2d(this.nml.data.maxwell.ori_s)
        this.inf_s = _parseFFloat2d(this.nml.data.maxwell.inf_s)
        this.nx_m = parseInt(this.nml.data.multiscale.nx_m)
        this.ny_m = parseInt(this.nml.data.multiscale.ny_m)
        this.nz_m = parseInt(this.nml.data.multiscale.nz_m)
        this.hx_m = _parseFFloat(this.nml.data.multiscale.hx_m)
        this.hy_m = _parseFFloat(this.nml.data.multiscale.hy_m)
        this.hz_m = _parseFFloat(this.nml.data.multiscale.hz_m)
        this.al_em = _parseFFloat1d(this.nml.data.maxwell.al_em)
        this.num_rgrid_em = _parseInt1d(this.nml.data.maxwell.num_rgrid_em)
        this.at_em = _parseFFloat(this.nml.data.maxwell.at_em)

        // 単位系の計算
        if (this.unit_system == "A_eV_fs") {
            this.unit_length = 0.52917721067;
            this.unit_time = 0.02418884326505;
            this.unit_efield = 51.4220674763;
            this.unit_energy = 27.211386245988034;
        } else {
            this.unit_length = 1.0;
            this.unit_time = 1.0;
            this.unit_efield = 1.0;
            this.unit_energy = 1.0;
        }


        this.al_vec1 = {
            1: this.al_vec1[1] / this.unit_length,
            2: this.al_vec1[2] / this.unit_length,
            3: this.al_vec1[3] / this.unit_length
        }
        this.al_vec2 = {
            1: this.al_vec2[1] / this.unit_length,
            2: this.al_vec2[2] / this.unit_length,
            3: this.al_vec2[3] / this.unit_length
        }
        this.al_vec3 = {
            1: this.al_vec3[1] / this.unit_length,
            2: this.al_vec3[2] / this.unit_length,
            3: this.al_vec3[3] / this.unit_length
        }
        this.al = {
            1: this.al[1] / this.unit_length,
            2: this.al[2] / this.unit_length,
            3: this.al[3] / this.unit_length
        }
        this.dl = {
            1: this.dl[1] / this.unit_length,
            2: this.dl[2] / this.unit_length,
            3: this.dl[3] / this.unit_length
        }
        this.dt = this.dt / this.unit_time
        this.e_impulse = this.e_impulse / this.unit_efield
        this.e_amplitude1 = this.e_amplitude1 / this.unit_efield
        this.tw1 = this.tw1 / this.unit_time
        this.omega1 = this.omega1 / this.unit_energy
        this.e_amplitude2 = this.e_amplitude2 / this.unit_efield
        this.tw2 = this.tw2 / this.unit_time
        this.omega2 = this.omega2 / this.unit_energy
        this.t1_t2 = this.t1_t2 / this.unit_time
        this.t1_start = this.t1_start / this.unit_time
        // this.al_em = this.al_em / this.unit_length
        this.at_em = this.at_em / this.unit_time

        this.vec_a1 = {};
        this.vec_a2 = {};
        this.vec_a3 = {};
        this.vec_a1.x = this.al_vec1[1]
        this.vec_a1.y = this.al_vec1[2]
        this.vec_a1.z = this.al_vec1[3]
        this.vec_a2.x = this.al_vec2[1]
        this.vec_a2.y = this.al_vec2[2]
        this.vec_a2.z = this.al_vec2[3]
        this.vec_a3.x = this.al_vec3[1]
        this.vec_a3.y = this.al_vec3[2]
        this.vec_a3.z = this.al_vec3[3]
        this.vec_a1.x += this.al[1]
        this.vec_a2.y += this.al[2]
        this.vec_a3.z += this.al[3]
        this.vec_a1.x += this.num_rgrid[1] * this.dl[1]
        this.vec_a2.y += this.num_rgrid[2] * this.dl[2]
        this.vec_a3.z += this.num_rgrid[3] * this.dl[3]

        // 原子座標データを読み込む
        this.atom_data = this._read_atomic_coor(inputfile)

        this.error = [];

        return;
    }

    _is_non_orthogonal() {
        var flag = false;
        var tmp = [
            this.nml.data.system.al_vec1,
            this.nml.data.system.al_vec2,
            this.nml.data.system.al_vec3
        ];
        for (var i in tmp)
            for (var j in tmp[i])
                if (tmp[i][j] != 0) flag = true
        return flag;
    }

    _exclude_atomic_coor(inputfile) {
        var buf = [];
        var flag = true;
        const line = inputfile.split(/\r?\n/);
        for(var i=0; i<line.length; i++) {
            const tmp = line[i]
            if (tmp.match(/^\s*&atomic_(red_)?coor\s*$/)) {
                flag = false;
            }
            if (flag) {
                buf = buf.concat([tmp])
            } else {
                buf + buf.concat(["!" + tmp])
            }
            if ((! flag) && (tmp.match(/\s*\/\s*/))) {
                flag = true;
            }
        }
        return buf.join("\n");
    }


    _read_atomic_coor(inputfile) {
        // Parse atomic coordinate

        var buf = []
        var flag = false;
        var reduced = false;
        var line = inputfile.split(/\r?\n/);
        for(var i=0; i<line.length; i++) {
            var str = line[i];
            str = str.replace(/^\s*/, "");
            str = str.replace(/\s*(!.*)?$/, "");
            if (! str) continue;

            if (str.match(/^&atomic_red_coor$/i)) {
                flag = true; reduced = true; continue;
            }

            if (str.match(/^&atomic_coor$/i)) {
                flag = true; reduced = false; continue;
            }

            if (! flag) continue;

            if (str.match(/^\/$/)) break;

            // 座標データの読み込み
            var tmp = str.split(/\s+/);
            if (tmp.length != 5) {
                this.error.push({lineNum:i+1, msg:"invalid coordinate format"});
                continue;
            }
            var e = tmp[0];
            var t1 = _parseFFloat(tmp[1]);
            var t2 = _parseFFloat(tmp[2]);
            var t3 = _parseFFloat(tmp[3]);
            if (reduced == false) {
                t1 = t1 / this.nml.data.system.al[1];
                t2 = t2 / this.nml.data.system.al[2];
                t3 = t3 / this.nml.data.system.al[3];
            }
            var ik = parseInt(tmp[4]);
            if (isNaN(t1) || isNaN(t2) || isNaN(t3) || isNaN(ik)) {
                // this.error.push({lineNum:i+1, msg:"invalid numeric format"});
                continue;
            }
            if (! (1 <= ik && ik <= this.nml.data.system.nelem)) {
                // this.error.push({lineNum:i+1, msg:"undefined element index"});
            }
            var iz = this.izatom[ik];
            buf.push({t1:t1, t2:t2, t3:t3, iz:iz, lineNum:(i+1)});

        }
        return buf;
    }



}

