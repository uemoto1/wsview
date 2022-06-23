define("ace/mode/salmon_highlight_rules",["require","exports","module","ace/lib/oop","ace/mode/text_highlight_rules"], function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    var TextHighlightRules = require("./text_highlight_rules").TextHighlightRules;
    
    var SalmonHighlightRules = function() {
        var keywords = (
            '&calculation|&control|&units|&parallel|&system|&pseudo'
            +'|&functional|&rgrid|&kgrid|&tgrid|&propagation|&scf'
            +'|&emfield|&singlescale|&multiscale|&maxwell|&analysis'
            +'|&poisson|&ewald|&opt|&md|&jellium|&atomic_red_coor'
            +'|&code|&band|theory|yn_md|yn_opt|sysname|base_directory'
            +'|yn_restart|directory_read_data|yn_self_checkpoint|checkpoint_interval'
            +'|yn_reset_step_restart|read_gs_restart_data|write_gs_restart_data'
            +'|time_shutdown|method_wf_distributor|nblock_wf_distribute'
            +'|read_gs_dns_cube|write_gs_wfn_k|write_rt_wfn_k|unit_system'
            +'|nproc_k|nproc_ob|nproc_rgrid|nproc_rgrid|nproc_rgrid'
            +'|yn_ffte|yn_scalapack|yn_gramschmidt_blas|yn_eigenexa'
            +'|yn_diagonalization_red_mem|process_allocation|yn_periodic'
            +'|spin|al|al|al|al_vec1|al_vec2|al_vec3|nstate|nelec'
            +'|nelec_spin|temperature|temperature_k|nelem|natom|file_atom_coor'
            +'|file_atom_red_coor|yn_spinorbit|yn_symmetry|absorbing_boundary'
            +'|imagnary_potential_w0|imagnary_potential_dr|file_pseudo'
            +'|lmax_ps|lloc_ps|izatom|file_pseudo|lmax_ps|lloc_ps'
            +'|izatom|yn_psmask|alpha_mask|gamma_mask|eta_mask|xc'
            +'|xname|cname|cval|dl|dl|dl|num_rgrid|num_rgrid|num_rgrid'
            +'|num_kgrid|num_kgrid|num_kgrid|file_kw|nt|dt|gram_schmidt_interval'
            +'|n_hamil|propagator|yn_fix_func|yn_predictor_corrector'
            +'|method_init_wf|iseed_number_change|method_min|ncg|ncg_init'
            +'|method_mixing|mixrate|nmemory_mb|alpha_mb|nmemory_p'
            +'|beta_p|yn_auto_mixing|update_mixing_ratio|nscf|yn_subspace_diagonalization'
            +'|convergence|threshold|nscf_init_redistribution|nscf_init_no_diagonal'
            +'|nscf_init_mix_zero|conv_gap_mix_zero|method_init_density'
            +'|trans_longi|ae_shape1|file_input1|e_impulse|E_amplitude1'
            +'|I_wcm2_1|tw1|omega1|epdir_re1|epdir_re1|epdir_re1|epdir_im1'
            +'|epdir_im1|epdir_im1|phi_cep1|ae_shape2|E_amplitude2'
            +'|I_wcm2_2|tw2|omega2|epdir_re2|epdir_re2|epdir_re2|epdir_im2'
            +'|epdir_im2|epdir_im2|phi_cep2|t1_t2|t1_start|num_dipole_source'
            +'|vec_dipole_source|vec_dipole_source|vec_dipole_source'
            +'|vec_dipole_source|vec_dipole_source|vec_dipole_source'
            +'|cood_dipole_source|cood_dipole_source|cood_dipole_source'
            +'|cood_dipole_source|cood_dipole_source|cood_dipole_source'
            +'|rad_dipole_source|method_singlescale|cutoff_G2_emfield'
            +'|yn_symmetrized_stencil|yn_put_wall_z_boundary|wall_height'
            +'|wall_width|fdtddim|twod_shape|nx_m|ny_m|nz_m|hx_m|hy_m'
            +'|hz_m|nksplit|nxysplit|nxvacl_m|nxvacr_m|nx_origin_m'
            +'|ny_origin_m|nz_origin_m|file_macropoint|set_ini_coor_vel'
            +'|nmacro_write_group|nmacro_chunk|al_em|al_em|al_em|dl_em'
            +'|dl_em|dl_em|num_rgrid_em|num_rgrid_em|num_rgrid_em'
            +'|dt_em|nt_em|boundary_em|boundary_em|boundary_em|boundary_em'
            +'|boundary_em|boundary_em|shape_file|media_num|media_type'
            +'|epsilon_em|mu_em|sigma_em|pole_num_ld|omega_p_ld|f_ld'
            +'|gamma_ld|omega_ld|wave_input|ek_dir1|ek_dir1|ek_dir1'
            +'|source_loc1|source_loc1|source_loc1|ek_dir2|ek_dir2'
            +'|ek_dir2|source_loc2|source_loc2|source_loc2|obs_num_em'
            +'|obs_samp_em|obs_loc_em|obs_plane_ene_em|yn_obs_plane_em'
            +'|yn_obs_plane_integral_em|yn_wf_em|film_thickness|media_id_pml'
            +'|media_id_pml|media_id_pml|media_id_pml|media_id_pml'
            +'|media_id_pml|media_id_source1|media_id_source2|bloch_k_em'
            +'|bloch_k_em|bloch_k_em|bloch_real_imag_em|bloch_real_imag_em'
            +'|bloch_real_imag_em|yn_make_shape|yn_output_shape|yn_copy_x'
            +'|yn_copy_y|yn_copy_z|rot_type|n_s|typ_s|id_s|inf_s|ori_s'
            +'|rot_s|projection_option|out_projection_step|nenergy'
            +'|de|out_rt_energy_step|yn_out_psi|yn_out_dos|yn_out_dos_set_fe_origin'
            +'|out_dos_start|out_dos_end|out_dos_nenergy|out_dos_width'
            +'|out_dos_function|yn_out_pdos|yn_out_dns|yn_out_dns_rt'
            +'|yn_out_dns_ac_je|out_dns_rt_step|out_dns_ac_je_step'
            +'|out_old_dns|yn_out_dns_trans|out_dns_trans_energy|yn_out_elf'
            +'|yn_out_elf_rt|out_elf_rt_step|yn_out_estatic_rt|out_estatic_rt_step'
            +'|yn_out_rvf_rt|out_rvf_rt_step|yn_out_tm|yn_out_gs_sgm_eps'
            +'|out_gs_sgm_eps_mu_nu|out_gs_sgm_eps_mu_nu|out_gs_sgm_eps_width'
            +'|out_ms_step|format_voxel_data|nsplit_voxel_data|yn_lr_w0_correction'
            +'|out_magnetization_step|yn_out_perflog|format_perflog'
            +'|layout_multipole|num_multipole_xyz|num_multipole_xyz'
            +'|num_multipole_xyz|lmax_multipole|threshold_cg|method_poisson'
            +'|newald|aewald|cutoff_r|cutoff_r_buff|cutoff_g|nopt'
            +'|max_step_len_adjust|convrg_opt_fmax|ensemble|thermostat'
            +'|step_velocity_scaling|step_update_ps|temperature0_ion_k'
            +'|yn_set_ini_velocity|file_ini_velocity|thermostat_tau'
            +'|yn_stop_system_momt|yn_jm|yn_charge_neutral_jm|yn_output_dns_jm'
            +'|shape_file|num_jm|rs_bohr_jm|sphere_nion_jm|sphere_loc_jm'
            +'|yn_want_stencil_hand_vectorization|yn_want_communication_overlapping'
            +'|stencil_openmp_mode|current_openmp_mode|force_openmp_mode'
            +'|lattice|nref_band|tol_esp_diff|num_of_segments|ndiv_segment'        
        );
        var keywordMapper = this.createKeywordMapper({
            "keyword": keywords,
        }, "identifier", true);
    
        this.$rules = {
            "start" : [ 
                {token: "comment", regex: /(#|!).*$/},
                {token: "keyword", regex : /^\s*\//},
                {token: "string", regex : /".*"/},
                {token: "string", regex : /'.*'/},
                {token: keywordMapper, regex : /\&?[a-zA-Z_$][a-zA-Z0-9_$]*/},
                {token : "constant.numeric", regex: /[+-]?\d+(\.\d*)?([eEdD][+-]?\d+)?\b/},
                {token : "constant.numeric", regex: /[+-]?\.\d+([eEdD][+-]?\d+)?\b/},
            ],
        };
    };
    
    oop.inherits(SalmonHighlightRules, TextHighlightRules);
    
    exports.SalmonHighlightRules = SalmonHighlightRules;
    });
    
    define("ace/mode/salmon",["require","exports","module","ace/lib/oop","ace/mode/text","ace/mode/salmon_highlight_rules","ace/range"], function(require, exports, module) {
    "use strict";
    
    var oop = require("../lib/oop");
    var TextMode = require("./text").Mode;
    var SalmonHighlightRules = require("./salmon_highlight_rules").SalmonHighlightRules;
    var Range = require("../range").Range;
    
    var Mode = function() {
        this.HighlightRules = SalmonHighlightRules;
        this.$behaviour = this.$defaultBehaviour;
    };
    oop.inherits(Mode, TextMode);
    
    (function() {
    
        this.lineCommentStart = "--";
    
        this.getNextLineIndent = function(state, line, tab) {
            var indent = this.$getIndent(line);
    
            var tokenizedLine = this.getTokenizer().getLineTokens(line, state);
            var tokens = tokenizedLine.tokens;
    
            if (tokens.length && tokens[tokens.length-1].type == "comment") {
                return indent;
            }
            if (state == "start") {
                var match = line.match(/^.*(begin|loop|then|is|do)\s*$/);
                if (match) {
                    indent += tab;
                }
            }
    
            return indent;
        };
    
        this.checkOutdent = function(state, line, input) {
            var complete_line = line + input;
            if (complete_line.match(/^\s*(begin|end)$/)) {
                return true;
            }
    
            return false;
        };
    
        this.autoOutdent = function(state, session, row) {
    
            var line = session.getLine(row);
            var prevLine = session.getLine(row - 1);
            var prevIndent = this.$getIndent(prevLine).length;
            var indent = this.$getIndent(line).length;
            if (indent <= prevIndent) {
                return;
            }
    
            session.outdentRows(new Range(row, 0, row + 2, 0));
        };
    
    
        this.$id = "ace/mode/salmon";
    }).call(Mode.prototype);
    
    exports.Mode = Mode;
    
    });                (function() {
                        window.require(["ace/mode/salmon"], function(m) {
                            if (typeof module == "object" && typeof exports == "object" && module) {
                                module.exports = m;
                            }
                        });
                    })();
                