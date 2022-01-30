// SALMON v 2.0.2 principal input parameters
salmon202_ignore = [
    'opt', 'md', 'poisson', 'band',
    'singlescale', 'maxwell', 'jellium',
    'code', 'atomic_red_coor', 'atomic_coor'
];

salmon202_namelist = {
    'calculation': {
        'theory': {type:'character(32)', default_val:'tddft'},
        'yn_md': {type:'character(1)'},
        'yn_opt': {type:'character(1)'},
    },
    'control': {
        'sysname': {type:'character(256)', default_val:'default'},
        'base_directory': {type:'character(256)'},
        'yn_restart': {type:'character(1)'},
        'directory_read_data': {type:'character(256)'},
        'yn_self_checkpoint': {type:'character(1)'},
        'checkpoint_interval': {type:'integer'},
        'yn_reset_step_restart': {type:'character(1)'},
        'read_gs_restart_data': {type:'character(256)'},
        'write_gs_restart_data': {type:'character(256)'},
        'time_shutdown': {type:'real(8)'},
        'method_wf_distributor': {type:'character(20)'},
        'nblock_wf_distribute': {type:'integer'},
        'read_gs_dns_cube': {type:'character(1)'},
        'write_gs_wfn_k': {type:'character(1)'},
        'write_rt_wfn_k': {type:'character(1)'},
    },
    'parallel': {
        'nproc_k': {type:'integer', default_val:0},
        'nproc_ob': {type:'integer', default_val:0},
        'nproc_rgrid': {type:'integer', imin:1, imax:3, default_val:0},
        'yn_ffte': {type:'character(1)'},
        'yn_scalapack': {type:'character(1)'},
        'yn_eigenexa': {type:'character(1)'},
        'yn_diagonalization_red_mem': {type:'character(1)'},
        'process_allocation': {type:'character(32)'},
    },
    'units': {
        'unit_system': {type:'character(16)', default_val:"a.u."},
    },
    'system': {
        'yn_periodic': {type:'character(1)', default_val:'n'},
        'spin': {type:'character(16)'},
        'al': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'al_vec1': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'al_vec2': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'al_vec3': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'nstate': {type:'integer', default_val:0},
        'nelec': {type:'integer', default_val:0},
        'nelec_spin': {type:'integer', imin:1, imax:2, default_val:0},
        'temperature': {type:'real(8)'},
        'temperature_k': {type:'real(8)'},
        'nelem': {type:'integer', default_val:0},
        'natom': {type:'integer', default_val:0},
        'file_atom_coor': {type:'character(256)'},
        'file_atom_red_coor': {type:'character(256)'},
        'yn_spinorbit': {type:'character(1)'},
        'yn_symmetry': {type:'character(3)'},
        'absorbing_boundary': {type:'character(16)'},
        'imagnary_potential_w0': {type:'real(8)'},
        'imagnary_potential_dr': {type:'real(8)'},
    },
    'scf': {
        'method_init_wf': {type:'character(8)'},
        'iseed_number_change': {type:'integer'},
        'method_min': {type:'character(8)'},
        'ncg': {type:'integer'},
        'ncg_init': {type:'integer'},
        'method_mixing': {type:'character(8)'},
        'mixrate': {type:'real(8)'},
        'nmemory_mb': {type:'integer'},
        'alpha_mb': {type:'real(8)'},
        'nmemory_p': {type:'integer'},
        'beta_p': {type:'real(8)'},
        'yn_auto_mixing': {type:'character(1)'},
        'update_mixing_ratio': {type:'real(8)'},
        'nscf': {type:'integer'},
        'yn_subspace_diagonalization': {type:'character(1)'},
        'convergence': {type:'character(16)'},
        'threshold': {type:'real(8)'},
        'nscf_init_redistribution': {type:'integer'},
        'nscf_init_no_diagonal': {type:'integer'},
        'nscf_init_mix_zero': {type:'integer'},
        'conv_gap_mix_zero': {type:'real(8)'},
        'method_init_density': {type:'character(2)'},
    },
    'rgrid': {
        'dl': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'num_rgrid': {type:'integer', imin:1, imax:3, default_val:0},
    },
    'kgrid': {
        'num_kgrid': {type:'integer', imin:1, imax:3, default_val:1},
        'file_kw': {type:'character(256)'},
    },
    'tgrid': {
        'nt': {type:'integer', default_val:0},
        'dt': {type:'real(8)', default_val:0.0},
        'gram_schmidt_interval': {type:'integer'},
    },
    'functional': {
        'xc': {type:'character(64)'},
        'cname': {type:'character(64)'},
        'xname': {type:'character(64)'},
        'alibx': {type:'character(64)'},
        'alibc': {type:'character(64)'},
        'alibxc': {type:'character(64)'},
        'cval': {type:'real(8)'},
    },
    'emfield': {
        'trans_longi': {type:'character(2)', default_val:'tr'},
        'ae_shape1': {type:'character(16)', default_val:'none'},
        'file_input1': {type:'character(256)'},
        'e_impulse': {type:'real(8)', default_val:0.0},
        'e_amplitude1': {type:'real(8)', default_val:0.0},
        'i_wcm2_1': {type:'real(8)', default_val:-1e0},
        'tw1': {type:'real(8)', default_val:0.0},
        'omega1': {type:'real(8)', default_val:0.0},
        'epdir_re1': {type:'real(8)', imin:1, imax:3, default_val:{1:1.0,2:0.0,3:0.0}},
        'epdir_im1': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'phi_cep1': {type:'real(8)', default_val:0.0},
        'ae_shape2': {type:'character(16)', default_val:'none'},
        'e_amplitude2': {type:'real(8)', default_val:0.0},
        'i_wcm2_2': {type:'real(8)', default_val:-1e0},
        'tw2': {type:'real(8)', default_val:0.0},
        'omega2': {type:'real(8)', default_val:0.0},
        'epdir_re2': {type:'real(8)', imin:1, imax:3, default_val:{1:1,2:0,3:0}},
        'epdir_im2': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'phi_cep2': {type:'real(8)', default_val:0.0},
        't1_t2': {type:'real(8)', default_val:0.0},
        't1_start': {type:'real(8)', default_val:0.0},
        'num_dipole_source': {type:'integer', default_val:0},
        'vec_dipole_source': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'cood_dipole_source': {type:'real(8)', imin:1, imax:3, default_val:0.0},
        'rad_dipole_source': {type:'real(8)', default_val:2e0},
    },
    'ewald': {
        'newald': {type:'integer'},
        'aewald': {type:'real(8)'},
        'cutoff_r': {type:'real(8)'},
        'cutoff_r_buff': {type:'real(8)'},
        'cutoff_g': {type:'real(8)'},
    },
    'pseudo': {
        'file_pseudo': {type:'character(256)', imin:1, imax:99, default_val:'none'},
        'lmax_ps': {type:'integer', imin:1, imax:99, default_val:-1},
        'lloc_ps': {type:'integer', imin:1, imax:99, default_val:-1},
        'izatom': {type:'integer', imin:1, imax:99, default_val:-1},
        'yn_psmask': {type:'character(1)'},
        'alpha_mask': {type:'real(8)'},
        'gamma_mask': {type:'real(8)'},
        'eta_mask': {type:'real(8)'},
    },
    'propagation': {
        'n_hamil': {type:'integer'},
        'propagator': {type:'character(16)'},
        'yn_fix_func': {type:'character(1)'},
        'yn_predictor_corrector': {type:'character(1)'},
    },
    'analysis': {
        'projection_option': {type:'character(2)'},
        'out_projection_step': {type:'integer'},
        'nenergy': {type:'integer'},
        'de': {type:'real(8)'},
        'out_rt_energy_step': {type:'integer'},
        'yn_out_psi': {type:'character(1)'},
        'yn_out_dos': {type:'character(1)'},
        'yn_out_dos_set_fe_origin': {type:'character(1)'},
        'out_dos_start': {type:'real(8)'},
        'out_dos_end': {type:'real(8)'},
        'out_dos_nenergy': {type:'integer'},
        'out_dos_width': {type:'real(8)'},
        'out_dos_function': {type:'character(16)'},
        'yn_out_pdos': {type:'character(1)'},
        'yn_out_dns': {type:'character(1)'},
        'yn_out_dns_rt': {type:'character(1)'},
        'yn_out_dns_ac_je': {type:'character(1)'},
        'out_dns_rt_step': {type:'integer'},
        'out_dns_ac_je_step': {type:'integer'},
        'out_old_dns': {type:'character(1)'},
        'yn_out_dns_trans': {type:'character(1)'},
        'out_dns_trans_energy': {type:'real(8)'},
        'yn_out_elf': {type:'character(1)'},
        'yn_out_elf_rt': {type:'character(1)'},
        'out_elf_rt_step': {type:'integer'},
        'yn_out_estatic_rt': {type:'character(1)'},
        'out_estatic_rt_step': {type:'integer'},
        'yn_out_rvf_rt': {type:'character(1)'},
        'out_rvf_rt_step': {type:'integer'},
        'yn_out_tm': {type:'character(1)'},
        'out_ms_step': {type:'integer'},
        'format_voxel_data': {type:'character(16)'},
        'nsplit_voxel_data': {type:'integer'},
        'yn_out_perflog': {type:'character(1)'},
        'format_perflog': {type:'character(6)'},
    },
}



salmon202_sample = `!########################################################################################!
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



class SALMON202 {



    constructor() {
        this.namelist = new Namelist(salmon202_namelist);
        this.namelist.ignore = salmon202_ignore;
        this.error = [];
        this.warning = [];
    }

    parse(inputfile) {

        this.namelist.parse(inputfile);
        // Namelist読み込み時にエラーが検出された場合は終了する
        this.error = this.namelist.error;
        this.warning = this.namelist.warning;
        if (this.namelist.error.length > 0) return;

        // ベクトル計算
        if (this.namelist.data.units.unit_system.val == "A_eV_fs") {
            this.unit_length = 0.52917721067;
            this.unit_time = 0.02418884326505;
        } else {
            this.unit_length = 1.0;
            this.unit_time = 1.0;
        }

        this.vec_a1 = {};
        this.vec_a2 = {};
        this.vec_a3 = {};
        var system = this.namelist.data.system;
        var f = 1.0 / this.unit_length;
        if (this._is_non_orthogonal()) {
            this.vec_a1.x = system.al_vec1.val[1] * f;
            this.vec_a1.y = system.al_vec1.val[2] * f;
            this.vec_a1.z = system.al_vec1.val[3] * f;
            this.vec_a2.x = system.al_vec2.val[1] * f;
            this.vec_a2.y = system.al_vec2.val[2] * f;
            this.vec_a2.z = system.al_vec2.val[3] * f;
            this.vec_a3.x = system.al_vec3.val[1] * f;
            this.vec_a3.y = system.al_vec3.val[2] * f;
            this.vec_a3.z = system.al_vec3.val[3] * f;
        } else {
            this.vec_a1.x = system.al.val[1] * f;
            this.vec_a1.y = 0.0;
            this.vec_a1.z = 0.0;
            this.vec_a2.x = 0.0;
            this.vec_a2.y = system.al.val[2] * f;
            this.vec_a2.z = 0.0;
            this.vec_a3.x = 0.0;
            this.vec_a3.y = 0.0;
            this.vec_a3.z = system.al.val[3] * f;
        }

        // 原子座標データを読み込む
        this.atom_data = this._read_atomic_coor(inputfile)
        console.log(this.atom_data);
    }

    _is_non_orthogonal() {
        var flag = false;
        var tmp = [
            this.namelist.data.system.al_vec1.val,
            this.namelist.data.system.al_vec2.val,
            this.namelist.data.system.al_vec3.val
        ];
        for (var i in tmp)
            for (var j in tmp[i])
                if (tmp[i][j] != 0) flag = true
        return flag;
    }

    _read_atomic_coor(inputfile) {
        // Parse atomic coordinate

        var buf = []
        var flag = false;
        var line = inputfile.split(/\r?\n/);
        for(var i=0; i<line.length; i++) {
            var str = line[i];
            str = str.replace(/^\s*/, "");
            str = str.replace(/\s*(!.*)?$/, "");
            if (! str) continue;

            if (str.match(/^&atomic(_red)?_coor$/i)) {
                flag = true;
                continue;
            }

            if (! flag) continue;

            if (str.match(/^\/$/)) break;

            // 座標データの読み込み
            var tmp = str.split(/\s+/);
            if (tmp.length != 5) {
                this.error.push({lineno:i+1, msg:"invalid coordinate format"});
                continue;
            }
            var e = tmp[0];
            var t1 = this._parseFortranFloat(tmp[1]);
            var t2 = this._parseFortranFloat(tmp[2]);
            var t3 = this._parseFortranFloat(tmp[3]);
            var ik = parseInt(tmp[4]);
            if (isNaN(t1) || isNaN(t2) || isNaN(t3) || isNaN(ik)) {
                this.error.push({lineno:i+1, msg:"invalid numeric format"});
                continue;
            }
            if (! (1 <= ik && ik <= this.namelist.data.system.nelem.val)) {
                this.error.push({lineno:i+1, msg:"undefined element index"});
            }
            var iz = this.namelist.data.pseudo.izatom.val[ik];
            buf.push({t1:t1, t2:t2, t3:t3, iz:iz, lineno:(i+1)});

        }
        return buf;
    }

    _parseFortranFloat(x) {
        if (x.match(/\s*[+-]?\s*\d*\.\d+([de][+-]?\d+)?\s*$/i))
            return parseFloat(x.replace(/d/i, "e"));
        return NaN;
    }



}

