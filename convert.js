

template_from_cif = `

&calculation
    !type of theory
    theory = 'tddft_pulse'
/

&control
    !common name of output files
    sysname = '%SYSNAME%'
/

&units
    !units used in input and output files
    unit_system = 'A_eV_fs'
!   unit_system = 'au'
/

&system
    !periodic boundary condition
    yn_periodic = 'y'
%LATTICE_INFO%

    !number of elements, atoms, electrons and states(bands)
    nelem  = %NELEM%
    natom  = %NATOM%
    nelec  = %NELEC%
    nstate = %NSTATE%
/

&pseudo
    !name of input pseudo potential file  
    !atomic number of element
    !angular momentum of pseudopotential that will be treated as local
%FILE_PSEUDO%
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

!&scf
!    !maximum number of scf iteration and threshold of convergence
!    nscf      = 300
!    threshold = 1.0d-9
!/

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
%COORDINATES%
    !--- Format ---------------------------------------------------!
    ! 'symbol' x y z index(correspond to that of pseudo potential) !
    !--------------------------------------------------------------!
/

`;

pptable = {
    "H": {"izatom": 1, "nelec": 1, "lloc_ps": 2, "file_pseudo": "01-H.LDA.fhi"},
    "He": {"izatom": 2, "nelec": 2, "lloc_ps": 2, "file_pseudo": "02-He.LDA.fhi"},
    "Li": {"izatom": 3, "nelec": 1, "lloc_ps": 2, "file_pseudo": "03-Li.LDA.fhi"},
    "Be": {"izatom": 4, "nelec": 2, "lloc_ps": 2, "file_pseudo": "04-Be.LDA.fhi"},
    "B": {"izatom": 5, "nelec": 3, "lloc_ps": 2, "file_pseudo": "05-B.LDA.fhi"},
    "C": {"izatom": 6, "nelec": 4, "lloc_ps": 2, "file_pseudo": "06-C.LDA.fhi"},
    "N": {"izatom": 7, "nelec": 5, "lloc_ps": 2, "file_pseudo": "07-N.LDA.fhi"},
    "O": {"izatom": 8, "nelec": 6, "lloc_ps": 2, "file_pseudo": "08-O.LDA.fhi"},
    "F": {"izatom": 9, "nelec": 7, "lloc_ps": 2, "file_pseudo": "09-F.LDA.fhi"},
    "Ne": {"izatom": 10, "nelec": 8, "lloc_ps": 2, "file_pseudo": "10-Ne.LDA.fhi"},
    "Na": {"izatom": 11, "nelec": 1, "lloc_ps": 2, "file_pseudo": "11-Na.LDA.fhi"},
    "Mg": {"izatom": 12, "nelec": 2, "lloc_ps": 2, "file_pseudo": "12-Mg.LDA.fhi"},
    "Al": {"izatom": 13, "nelec": 3, "lloc_ps": 2, "file_pseudo": "13-Al.LDA.fhi"},
    "Si": {"izatom": 14, "nelec": 4, "lloc_ps": 2, "file_pseudo": "14-Si.LDA.fhi"},
    "P": {"izatom": 15, "nelec": 5, "lloc_ps": 2, "file_pseudo": "15-P.LDA.fhi"},
    "S": {"izatom": 16, "nelec": 6, "lloc_ps": 2, "file_pseudo": "16-S.LDA.fhi"},
    "Cl": {"izatom": 17, "nelec": 7, "lloc_ps": 2, "file_pseudo": "17-Cl.LDA.fhi"},
    "Ar": {"izatom": 18, "nelec": 8, "lloc_ps": 2, "file_pseudo": "18-Ar.LDA.fhi"},
    "K": {"izatom": 19, "nelec": 1, "lloc_ps": 0, "file_pseudo": "19-K.LDA.fhi"},
    "Ca": {"izatom": 20, "nelec": 2, "lloc_ps": 0, "file_pseudo": "20-Ca.LDA.fhi"},
    "Sc": {"izatom": 21, "nelec": 3, "lloc_ps": 1, "file_pseudo": "21-Sc.LDA.fhi"},
    "Ti": {"izatom": 22, "nelec": 4, "lloc_ps": 1, "file_pseudo": "22-Ti.LDA.fhi"},
    "V": {"izatom": 23, "nelec": 5, "lloc_ps": 1, "file_pseudo": "23-V.LDA.fhi"},
    "Cr": {"izatom": 24, "nelec": 6, "lloc_ps": 1, "file_pseudo": "24-Cr.LDA.fhi"},
    "Mn": {"izatom": 25, "nelec": 7, "lloc_ps": 1, "file_pseudo": "25-Mn.LDA.fhi"},
    "Fe": {"izatom": 26, "nelec": 8, "lloc_ps": 1, "file_pseudo": "26-Fe.LDA.fhi"},
    "Co": {"izatom": 27, "nelec": 9, "lloc_ps": 1, "file_pseudo": "27-Co.LDA.fhi"},
    "Ni": {"izatom": 28, "nelec": 10, "lloc_ps": 0, "file_pseudo": "28-Ni.LDA.fhi"},
    "Cu": {"izatom": 29, "nelec": 11, "lloc_ps": 0, "file_pseudo": "29-Cu.LDA.fhi"},
    "Zn": {"izatom": 30, "nelec": 12, "lloc_ps": 0, "file_pseudo": "30-Zn.LDA.fhi"},
    "Ga": {"izatom": 31, "nelec": 3, "lloc_ps": 0, "file_pseudo": "31-Ga.LDA.fhi"},
    "Ge": {"izatom": 32, "nelec": 4, "lloc_ps": 0, "file_pseudo": "32-Ge.LDA.fhi"},
    "As": {"izatom": 33, "nelec": 5, "lloc_ps": 2, "file_pseudo": "33-As.LDA.fhi"},
    "Se": {"izatom": 34, "nelec": 6, "lloc_ps": 2, "file_pseudo": "34-Se.LDA.fhi"},
    "Br": {"izatom": 35, "nelec": 7, "lloc_ps": 2, "file_pseudo": "35-Br.LDA.fhi"},
    "Kr": {"izatom": 36, "nelec": 8, "lloc_ps": 2, "file_pseudo": "36-Kr.LDA.fhi"},
    "Rb": {"izatom": 37, "nelec": 1, "lloc_ps": 0, "file_pseudo": "37-Rb.LDA.fhi"},
    "Sr": {"izatom": 38, "nelec": 2, "lloc_ps": 0, "file_pseudo": "38-Sr.LDA.fhi"},
    "Y": {"izatom": 39, "nelec": 3, "lloc_ps": 1, "file_pseudo": "39-Y.LDA.fhi"},
    "Zr": {"izatom": 40, "nelec": 4, "lloc_ps": 1, "file_pseudo": "40-Zr.LDA.fhi"},
    "Nb": {"izatom": 41, "nelec": 5, "lloc_ps": 1, "file_pseudo": "41-Nb.LDA.fhi"},
    "Mo": {"izatom": 42, "nelec": 6, "lloc_ps": 1, "file_pseudo": "42-Mo.LDA.fhi"},
    "Tc": {"izatom": 43, "nelec": 7, "lloc_ps": 1, "file_pseudo": "43-Tc.LDA.fhi"},
    "Ru": {"izatom": 44, "nelec": 8, "lloc_ps": 1, "file_pseudo": "44-Ru.LDA.fhi"},
    "Rh": {"izatom": 45, "nelec": 9, "lloc_ps": 1, "file_pseudo": "45-Rh.LDA.fhi"},
    "Pd": {"izatom": 46, "nelec": 10, "lloc_ps": 1, "file_pseudo": "46-Pd.LDA.fhi"},
    "Ag": {"izatom": 47, "nelec": 11, "lloc_ps": 1, "file_pseudo": "47-Ag.LDA.fhi"},
    "Cd": {"izatom": 48, "nelec": 12, "lloc_ps": 1, "file_pseudo": "48-Cd.LDA.fhi"},
    "In": {"izatom": 49, "nelec": 3, "lloc_ps": 0, "file_pseudo": "49-In.LDA.fhi"},
    "Sn": {"izatom": 50, "nelec": 4, "lloc_ps": 0, "file_pseudo": "50-Sn.LDA.fhi"},
    "Sb": {"izatom": 51, "nelec": 5, "lloc_ps": 0, "file_pseudo": "51-Sb.LDA.fhi"},
    "Te": {"izatom": 52, "nelec": 6, "lloc_ps": 0, "file_pseudo": "52-Te.LDA.fhi"},
    "I": {"izatom": 53, "nelec": 7, "lloc_ps": 0, "file_pseudo": "53-I.LDA.fhi"},
    "Xe": {"izatom": 54, "nelec": 8, "lloc_ps": 0, "file_pseudo": "54-Xe.LDA.fhi"},
    "Cs": {"izatom": 55, "nelec": 1, "lloc_ps": 1, "file_pseudo": "55-Cs.LDA.fhi"},
    "Ba": {"izatom": 56, "nelec": 2, "lloc_ps": 0, "file_pseudo": "56-Ba.LDA.fhi"},
    "Ce": {"izatom": 58, "nelec": 4, "lloc_ps": 0, "file_pseudo": "58-Ce.LDA.fhi"},
    "Nd": {"izatom": 60, "nelec": 6, "lloc_ps": 0, "file_pseudo": "60-Nd.LDA.fhi"},
    "Pm": {"izatom": 61, "nelec": 7, "lloc_ps": 0, "file_pseudo": "61-Pm.LDA.fhi"},
    "Sm": {"izatom": 62, "nelec": 8, "lloc_ps": 0, "file_pseudo": "62-Sm.LDA.fhi"},
    "Gd": {"izatom": 64, "nelec": 10, "lloc_ps": 0, "file_pseudo": "64-Gd.LDA.fhi"},
    "Er": {"izatom": 68, "nelec": 14, "lloc_ps": 0, "file_pseudo": "68-Er.LDA.fhi"},
    "Tm": {"izatom": 69, "nelec": 15, "lloc_ps": 0, "file_pseudo": "69-Tm.LDA.fhi"},
    "Yb": {"izatom": 70, "nelec": 16, "lloc_ps": 0, "file_pseudo": "70-Yb.LDA.fhi"},
    "Lu": {"izatom": 71, "nelec": 17, "lloc_ps": 0, "file_pseudo": "71-Lu.LDA.fhi"},
    "Hf": {"izatom": 72, "nelec": 4, "lloc_ps": 1, "file_pseudo": "72-Hf.LDA.fhi"},
    "Ta": {"izatom": 73, "nelec": 5, "lloc_ps": 1, "file_pseudo": "73-Ta.LDA.fhi"},
    "W": {"izatom": 74, "nelec": 6, "lloc_ps": 3, "file_pseudo": "74-W.LDA.fhi"},
    "Re": {"izatom": 75, "nelec": 7, "lloc_ps": 1, "file_pseudo": "75-Re.LDA.fhi"},
    "Os": {"izatom": 76, "nelec": 8, "lloc_ps": 1, "file_pseudo": "76-Os.LDA.fhi"},
    "Ir": {"izatom": 77, "nelec": 9, "lloc_ps": 1, "file_pseudo": "77-Ir.LDA.fhi"},
    "Pt": {"izatom": 78, "nelec": 10, "lloc_ps": 1, "file_pseudo": "78-Pt.LDA.fhi"},
    "Au": {"izatom": 79, "nelec": 11, "lloc_ps": 1, "file_pseudo": "79-Au.LDA.fhi"},
    "Hg": {"izatom": 80, "nelec": 12, "lloc_ps": 1, "file_pseudo": "80-Hg.LDA.fhi"},
    "Tl": {"izatom": 81, "nelec": 3, "lloc_ps": 0, "file_pseudo": "81-Tl.LDA.fhi"},
    "Pb": {"izatom": 82, "nelec": 14, "lloc_ps": 0, "file_pseudo": "82-Pb.LDA.fhi"},
    "Bi": {"izatom": 83, "nelec": 5, "lloc_ps": 0, "file_pseudo": "83-Bi.LDA.fhi"},
    "Po": {"izatom": 84, "nelec": 6, "lloc_ps": 0, "file_pseudo": "84-Po.LDA.fhi"},
    "At": {"izatom": 85, "nelec": 7, "lloc_ps": 0, "file_pseudo": "85-At.LDA.fhi"},
    "Rn": {"izatom": 86, "nelec": 8, "lloc_ps": 0, "file_pseudo": "86-Rn.LDA.fhi"},
};



function generateInput(code) {
    const data = readCIF(code)

    const indent = "    ";
    const a = parseFloat(data._cell_length_a);
    const b = parseFloat(data._cell_length_b);
    const c = parseFloat(data._cell_length_c);
    const alpha = parseFloat(data._cell_angle_alpha);
    const beta = parseFloat(data._cell_angle_beta);
    const gamma  = parseFloat(data._cell_angle_gamma);

    // Lattice info
    var lattice_info = "";
    if ((alpha == 90) && (beta == 90) && (gamma == 90)) {
        lattice_info += indent + "al(1:3) = " + a.toFixed(6) + "d0, ";
        lattice_info += + b.toFixed(6) + "d0, ";
        lattice_info += + c.toFixed(6) + "d0";
    } else {
        const cos_alpha = Math.cos(alpha * Math.PI / 180);
        const cos_beta  = Math.cos(beta * Math.PI / 180);
        const cos_gamma = Math.cos(gamma * Math.PI / 180);
        // Set c as z-direction:
        const cx = 0.0;
        const cy = 0.0;
        const cz = c;
        const az = a*cos_beta;
        const ax = Math.sqrt(a*a-az*az);
        const ay = 0.0;
        const bz = b*cos_alpha;
        const bx = (a*b*cos_gamma - az*bz) / b;
        const by = Math.sqrt(b*b-bx*bx-bz*bz);
        lattice_info += indent + "al_vec1(1:3) = " + ax.toFixed(6) + "d0, "
        lattice_info += ay.toFixed(6) + "d0, "
        lattice_info += az.toFixed(6) + "d0\n";
        lattice_info += indent + "al_vec2(1:3) = " + bx.toFixed(6) + "d0, "
        lattice_info += by.toFixed(6) + "d0, "
        lattice_info += bz.toFixed(6) + "d0\n";
        lattice_info += indent + "al_vec3(1:3) = " + cx.toFixed(6) + "d0, "
        lattice_info += cy.toFixed(6) + "d0, "
        lattice_info += cz.toFixed(6) + "d0\n";
    }

    // _atom_site_type_symbol
    var coordinates = "";
    var natom = 0;
    var elem = {};
    var nelem = 0;
    var nelec = 0;

    var nsym;
    if ("_symmetry_equiv_pos_as_xyz" in data) {
        nsym = data._symmetry_equiv_pos_as_xyz.length;
    } else {
        nsym = 0
    }
    
    
    const nsite = data._atom_site_fract_x.length;
        
    var file_pseudo = "";
    for (var i=0; i<nsite; i++) {
        var symbol = data._atom_site_type_symbol[i];
        var label;
        if ("_atom_site_label" in data) {
            label = data._atom_site_label[i];
        } else {
            label = symbol
        }
        var x1 = parseFloat(data._atom_site_fract_x[i]);
        var y1 = parseFloat(data._atom_site_fract_y[i]);
        var z1 = parseFloat(data._atom_site_fract_z[i]);

        var k;
        if (symbol in elem) {
            k = elem[symbol];
        } else {
            nelem++;
            k = nelem;
            elem[symbol] = k;
            file_pseudo += indent + "file_pseudo(" + k +") = '" + pptable[symbol].file_pseudo + "'\n"; 
            file_pseudo += indent + "izatom(" + k +") = " + pptable[symbol].izatom + "\n"; 
            file_pseudo += indent + "lloc_ps(" + k +") = " + pptable[symbol].lloc_ps + "\n"; 
        }

        var coord = [];
        if (nsym > 0) {
            for (var j=0; j<nsym; j++) {
                var op = data._symmetry_equiv_pos_as_xyz[j];
                var tmp = "";
                tmp += "x=" + x1 + ";";
                tmp += "y=" + y1 + ";";
                tmp += "z=" + z1 + ";";
                tmp += "[" + op + "]";
                coord = coord.concat([eval(tmp)]);
            }
        } else {
            coord = [[x1, y1, z1]];
        }
        console.log(coord);


        for (var j=0; j<coord.length; j++) {
            coordinates += indent + "'" + label + "'" 
            coordinates += " " + coord[j][0].toFixed(6) + "d0"; 
            coordinates += " " + coord[j][1].toFixed(6) + "d0"; 
            coordinates += " " + coord[j][2].toFixed(6) + "d0"; 
            coordinates += " " + k + "\n";
            nelec+= pptable[symbol].nelec;    
            natom++;
        }


    }

    
    
    var tmp = template_from_cif;
    tmp = tmp.replace("%SYSNAME%", data._chemical_formula_structural);
    tmp = tmp.replace("%LATTICE_INFO%", lattice_info);
    tmp = tmp.replace("%NATOM%", natom);
    tmp = tmp.replace("%NELEM%", nelem);
    tmp = tmp.replace("%NELEC%", nelec);
    tmp = tmp.replace("%NSTATE%", nelec);
    tmp = tmp.replace("%COORDINATES%", coordinates);
    tmp = tmp.replace("%FILE_PSEUDO%", file_pseudo);

    return tmp;
}

function split2(text) {
    buf = []
    tmp1 = text.trim().split(/'/);
    for(var i=0; i<tmp1.length; i++) {
        if (i % 2 == 0) {
            tmp2 = tmp1[i].trim().split(/\s+/);
            buf = buf.concat(tmp2);
        } else {
            buf = buf.concat([tmp1[i]]);
        }
    }
    return buf;
}

function readCIF(code) {
    var line = code.split(/\r?\n/);
    var data = {}
    var i = 0;
    while (i < line.length) {
        // Skip empty or comment line
        if (line[i].match(/^\s*(#.*)?$/)) {
            console.log(line[i])
            i++;
            continue;
        }
        // data_ section
        if (line[i].match(/^\s*data_.*$/)) {
            i++;
            while (i < line.length) {
                if (line[i].match(/^\s*_.*$/)) {
                    var tmp = split2(line[i]);
                    data[tmp[0]] = tmp[1];
                    i++;
                    continue;
                } else {
                    break;
                }
            }
            continue;
        }
        // loop_ section
        if (line[i].match(/^loop_.*$/)) {
            i++;
            var col = [];
            while (i < line.length) {
                if (line[i].match(/^\s*(loop|data)_.*$/)) {
                    break;
                } else if (line[i].match(/\s*_.*/)) {
                    var tag = line[i].trim();
                    col = col.concat(tag);
                    data[tag] = [];
                    i++;
                    continue;
                } else {
                    var tmp = split2(line[i]);
                    if (tmp.length > 1) {
                        for (var j=0; j<col.length; j++) {
                            var tag = col[j]
                            data[tag] = data[tag].concat([tmp[j]]);
                        }
                    }
                    i++;
                    continue;
                }
            }
            continue;
        }
        return {};
    }
    return data;
}


