// 結晶構造描画クラス
class Crystal3D {

    constructor(canvas) {
        // グローバル変数
        // 描画先オブジェクト
        this.canvas = canvas;
        // 格子関連変数
        this.vec_a1 = new THREE.Vector3(); // 並進ベクトル
        this.vec_a2 = new THREE.Vector3(); // 並進ベクトル
        this.vec_a3 = new THREE.Vector3(); // 並進ベクトル
        this.ncell1 = 1 // 反復
        this.ncell2 = 1 // 反復
        this.ncell3 = 1 // 反復
        this.pbc1 = true; // 周期境界条件
        this.pbc2 = true; // 周期境界条件 
        this.pbc3 = true; // 周期境界条件
        this.atom_data = []; // 原子座標関連変数
        this.atom_select = -1; // 選択された原子
        this.bond_length = 4.5; // 最大原子間距離
        // プライベート変数
        // THREE.js レンダラー関連
        this.renderer = new THREE.WebGLRenderer({"canvas": this.canvas});
        this.camera = new THREE.OrthographicCamera();
        this.scene = new THREE.Scene();
        // 三次元オブジェクト
        this.axes = new THREE.Group(); // 軸オブジェクト
        this.model = new THREE.Group(); // 原子＋セル＋結合（表示モデル全体）
        this.atom = new THREE.Group(); // 原子
        this.cell = new THREE.Group(); // セル
        this.bond = new THREE.Group(); // 結合
        // トレーサー
        this.raycaster = new THREE.Raycaster();
        // オブジェクト回転関連（一時変数）
        this.qtmp = new THREE.Quaternion();
        this.xtmp = 0.0;
        this.ytmp = 0.0;
        // 単位ベクトル
        this.ex = new THREE.Vector3(1, 0, 0);
        this.ey = new THREE.Vector3(0, 1, 0);
        this.ez = new THREE.Vector3(0, 0, 1);
        this.e0 = new THREE.Vector3(0, 0, 0);
        // マテリアル
        this.line_material = new THREE.LineBasicMaterial({color: 0x000000});
        this.bond_material = new THREE.MeshLambertMaterial({color: 0xaaaaaa});
        
        // レンダラの初期設定
        // 背景色
        this.renderer.setClearColor(0xffffff, 1.0);
        // カメラ
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(0, 0, 0);
        this.camera.zoom = 1;
        // オブジェクト
        this.model.add(this.atom);
        this.model.add(this.cell);
        this.model.add(this.bond);
        // セレクタ
        const geometry_selector = new THREE.SphereGeometry(1.01, 8, 8);
        const edge_selector = new THREE.EdgesGeometry(geometry_selector);
        this.selector = new THREE.LineSegments(edge_selector, this.line_material);
        this.selector.visible = false;
        this.model.add(this.selector);
        // 照明
        const light_a = new THREE.AmbientLight(0xFFFFFF, 0.60);
        const light_d = new THREE.DirectionalLight(0xFFFFFF, 0.40);
        light_d.position.set(1, 1, 1);
        // シーン作成
        this.scene.add(light_a);
        this.scene.add(light_d);
        this.scene.add(this.model);
        this.scene.add(this.axes);
        // フォッグ
        this.scene.fog = new THREE.Fog(0xFFFFFF, 3, 5);

        // マウス操作イベント
        this.flag_drag = false;
        // ドラッグ開始
        this.canvas.addEventListener('mousedown', (e)=>{
            this.drag_start(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener('touchstart', (e)=>{
            this.drag_start(e.touches[0].clientX, e.touches[0].clientY);
        });
        // ドラッグ中
        this.canvas.addEventListener('mousemove', (e)=>{
            if (e.buttons > 0) 
                this.drag(e.offsetX, e.offsetY);
        });
        this.canvas.addEventListener('touchmove', (e)=>{
            this.drag(e.touches[0].clientX, e.touches[0].clientY);
        });
        // ドラッグ終了またはオブジェクト選択
        this.canvas.addEventListener('mouseup', (e)=>{
            if (! this.flag_drag)
                this.select(e.offsetX, e.offsetY);
        })
        this.canvas.addEventListener('touchend', (e)=>{
            if (! this.flag_drag)
                this.select(e.touches[0].clientX, e.touches[0].clientY);
        })
    }


    redraw(resize=true) {
        if (resize) {
            // 表示サイズ計算
            this.width = parseFloat(this.canvas.clientWidth);
            this.height = parseFloat(this.canvas.clientHeight);
            this.unit = 0.5 * Math.min(this.width, this.height);
            // カメラ設定変更
            this.camera.left = -0.5 * this.width / this.unit
            this.camera.right = +0.5 * this.width / this.unit
            this.camera.bottom = -0.5 * this.height / this.unit
            this.camera.top = +0.5 * this.height / this.unit
            this.camera.updateProjectionMatrix();
            this.renderer.setSize(this.width, this.height);
        }
        // レンダリング
        this.renderer.render(this.scene, this.camera);
    }

    clear() {
        // 既存のオブジェクトを消去
        this.axes.clear();
        this.atom.clear();
        this.bond.clear();
        this.cell.clear();
        // セレクタを解除
        this.selected_index = -1;
        this.selector.visible = false;
    }

    plot(origin_center=true) {
        // ローカル変数
        const n1 = this.ncell1;
        const n2 = this.ncell2;
        const n3 = this.ncell3;
        const a1 = this.vec_a1;
        const a2 = this.vec_a2;
        const a3 = this.vec_a3;
        // 消去
        this.clear();
        // 座標軸描画
        this.axes.add(this.create_axes_object());
        this.axes.position.set(-0.75, 0.75, 0.75);
        // 基準位置計算
        const o1 = origin_center ? 0 : -0.5*n1;
        const o2 = origin_center ? 0 : -0.5*n2;
        const o3 = origin_center ? 0 : -0.5*n3;
        // 原子球の配置
        const atom_geometry = new THREE.SphereGeometry(1.0, 8, 8);
        const m1 = this.pbc1 ? 9 : 0;
        const m2 = this.pbc2 ? 9 : 0;
        const m3 = this.pbc3 ? 9 : 0;
        for(var i=0; i<this.atom_data.length; i++) {
            const t1 = this.atom_data[i].t1;
            const t2 = this.atom_data[i].t2;
            const t3 = this.atom_data[i].t3;
            const iz = this.atom_data[i].iz;
            for(var j1=-m1; j1<=m1; j1++) {
                const s1 = t1 + j1 + o1;
                if (Math.abs(s1) - 0.5*n1 > 0.01) continue;
                for(var j2=-m2; j2<=m2; j2++) {
                    const s2 = t2 + j2 + o2;
                    if (Math.abs(s2) - 0.5*n2 > 0.01) continue;
                    for(var j3=-m3; j3<=m3; j3++) {
                        const s3 = t3 + j3 + o3;
                        if (Math.abs(s3) - 0.5*n3 > 0.01) continue;
                        // r = s1 a1 + s2 a2 + s3 a3
                        var r = new THREE.Vector3(0, 0, 0);
                        r.addScaledVector(a1, s1);
                        r.addScaledVector(a2, s2);
                        r.addScaledVector(a3, s3);
                        // 原子作成
                        const color = parseInt("0x" + atom_color_table[iz]);
                        const material = new THREE.MeshLambertMaterial({color: color});
                        var sphere = new THREE.Mesh(atom_geometry, material);
                        sphere.position.copy(r);
                        sphere.tag = {"i": i, "j1": j1, "j2": j2, "j3": j3};
                        this.atom.add(sphere);
                    }
                }
            }
        }
        //  結合軸の作成
        this.plot_bond()
        // 格子の作成        
        this.plot_cell()
        // スケーリング調整
        // （表示領域サイズの見積もり）
        const lx = n1*Math.abs(a1.x) + n2*Math.abs(a2.x) + n3*Math.abs(a3.x);
        const ly = n1*Math.abs(a1.y) + n2*Math.abs(a2.y) + n3*Math.abs(a3.y);
        const lz = n1*Math.abs(a1.z) + n2*Math.abs(a2.z) + n3*Math.abs(a3.z);
        const l = Math.max(lx, ly, lz);
        this.model.scale.set(1/l,1/l,1/l)
        // 描画
        this.redraw();
    }

    plot_bond() {
        // 結合軸の作成
        this.bond.clear();
        for(var i=0; i<this.atom.children.length; i++) {
            const ri = this.atom.children[i].position;
            for(var j=0; j<i; j++) {
                const rj = this.atom.children[j].position;
                // d := rj - ri
                var d = new THREE.Vector3();
                d.subVectors(rj, ri);
                if (d.length() > this.bond_length) continue;
                // g := (ri + rj) / 2
                var g = new THREE.Vector3();
                g.addVectors(ri, rj).multiplyScalar(0.5);
                const geometry = new THREE.CylinderGeometry(0.1, 0.1, d.length()-2, 8);
                const cylinder = new THREE.Mesh(geometry, this.bond_material);
                cylinder.position.copy(g)
                cylinder.quaternion.setFromUnitVectors(this.ey, d.normalize());
                this.bond.add(cylinder);
            }
        }
    }

    plot_cell() {
        this.cell.clear()
        const vdir = [this.vec_a1, this.vec_a2, this.vec_a3];
        for(var i=0; i<3; i++) {
            const vi = vdir[i];
            const vj1 = vdir[(i+1) % 3];
            const vj2 = vdir[(i+2) % 3];
            for(var j1=0; j1<=1; j1++) {
                for(var j2=0; j2<=1; j2++) {
                    var p1 = new THREE.Vector3(0, 0, 0);
                    var p2 = new THREE.Vector3(0, 0, 0);
                    // p1 = -0.5vi -0.5vj1 -0.5vj2
                    // p2 = +0.5vi -0.5vj1 -0.5vj2
                    p1.addScaledVector(vj1, j1-0.5);
                    p1.addScaledVector(vj2, j2-0.5);
                    p1.addScaledVector(vi, -0.5);
                    p2.addScaledVector(vj1, j1-0.5);
                    p2.addScaledVector(vj2, j2-0.5);
                    p2.addScaledVector(vi, +0.5);
                    const line_geometry = new THREE.BufferGeometry().setFromPoints( [p1, p2] );
                    const line = new THREE.Line(line_geometry, this.line_material );
                    this.cell.add(line);
                }
            }
        }
    }


    drag_start(x, y) {
        this.flag_drag = false;
        this.xtmp = x;
        this.ytmp = y;
        this.qtmp.copy(this.model.quaternion);
    }

    drag(x, y) {
        // 移動距離を計算
        if (Math.abs(x - this.xtmp) < 5 && Math.abs(y - this.ytmp) < 5) {
            this.flag_drag = false;
        } else {
            this.flag_drag = true;
            const dx = +(x - this.xtmp) * (1.0 / this.unit);
            const dy = -(y - this.ytmp) * (1.0 / this.unit);
            var d = new THREE.Vector3(dx, dy, 0.50);
            d.normalize();
            // 回転クオータにオンを計算
            var q = new THREE.Quaternion();
            q.setFromUnitVectors(this.ez, d);
            q.multiply(this.qtmp);

            this.model.quaternion.copy(q.normalize());
            this.axes.quaternion.copy(q.normalize());
            // 再描画
            this.redraw(resize);
        }
    }

    select(x, y) {
        const vx = +(x - this.width * 0.5) / this.width * 2;
        const vy = -(y - this.height * 0.5) / this.height * 2;
        const v = new THREE.Vector2(vx, vy);
        this.raycaster.setFromCamera(v, this.camera);
        var intersects = this.raycaster.intersectObjects(this.atom.children);
        if (intersects.length > 0) {
            this.selected_index = intersects[0].object.tag.i;
            this.selector.position.copy(intersects[0].object.position);
            this.selector.visible = true;
        } else {
            this.selected_index = -1;
            this.selector.visible = false;
        }
        this.redraw(false);
    }
    

    create_arrow_object(material, r1, r2, h1, h2) {
        var arrow = new THREE.Group();
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r1, r1, h1, 8), material);
        var cone = new THREE.Mesh(new THREE.ConeGeometry(r2, h2, 8), material);
        cylinder.translateY(0.5 * h1);
        cone.translateY(h1 + 0.5 * h2);
        arrow.add(cylinder);
        arrow.add(cone);
        return arrow;
    }

    create_arrow_object2(material, r1, r2, v1, v2, a=0.25) {
        var arrow = new THREE.Group();
        var cylinder = new THREE.Mesh(new THREE.CylinderGeometry(r1, r1, h1, 8), material);
        var cone = new THREE.Mesh(new THREE.ConeGeometry(r2, h2, 8), material);
        cylinder.translateY(0.5 * h1);
        cone.translateY(h1 + 0.5 * h2);
        arrow.add(cylinder);
        arrow.add(cone);
        return arrow;
    }

    create_axes_object(r1=0.01, r2=0.03, h1=0.10, h2=0.05) {
        var dir1 = this.vec_a1.clone();
        var dir2 = this.vec_a2.clone();
        var dir3 = this.vec_a3.clone();
        dir1.normalize();
        dir2.normalize();
        dir3.normalize();
        var material1 = new THREE.MeshLambertMaterial({color: 0xff0000});
        var material2 = new THREE.MeshLambertMaterial({color: 0x00ff00});
        var material3 = new THREE.MeshLambertMaterial({color: 0x0000ff});
        var arrow1 = this.create_arrow_object(material1, r1, r2, h1, h2);
        var arrow2 = this.create_arrow_object(material2, r1, r2, h1, h2);
        var arrow3 = this.create_arrow_object(material3, r1, r2, h1, h2);
        arrow1.quaternion.setFromUnitVectors(this.ey, dir1);
        arrow2.quaternion.setFromUnitVectors(this.ey, dir2);
        arrow3.quaternion.setFromUnitVectors(this.ey, dir3);
        var axes = new THREE.Group();
        axes.add(arrow1);
        axes.add(arrow2);
        axes.add(arrow3);
        return axes;
    }
};

const atom_symbol_table = {
    1: 'H', 2: 'He', 3: 'Li', 4: 'Be', 5: 'B', 6: 'C', 7: 'N', 8: 'O', 9: 'F', 10: 'Ne',
    11: 'Na', 12: 'Mg', 13: 'Al', 14: 'Si', 15: 'P', 16: 'S', 17: 'Cl', 18: 'Ar', 19: 'K', 20: 'Ca',
    21: 'Sc', 22: 'Ti', 23: 'V', 24: 'Cr', 25: 'Mn', 26: 'Fe', 27: 'Co', 28: 'Ni', 29: 'Cu', 30: 'Zn',
    31: 'Ga', 32: 'Ge', 33: 'As', 34: 'Se', 35: 'Br', 36: 'Kr', 37: 'Rb', 38: 'Sr', 39: 'Y', 40: 'Zr',
    41: 'Nb', 42: 'Mo', 43: 'Tc', 44: 'Ru', 45: 'Rh', 46: 'Pd', 47: 'Ag', 48: 'Cd', 49: 'In', 50: 'Sn',
    51: 'Sb', 52: 'Te', 53: 'I', 54: 'Xe', 55: 'Cs', 56: 'Ba', 57: 'La', 58: 'Ce', 59: 'Pr', 60: 'Nd',
    61: 'Pm', 62: 'Sm', 63: 'Eu', 64: 'Gd', 65: 'Tb', 66: 'Dy', 67: 'Ho', 68: 'Er', 69: 'Tm', 70: 'Yb',
    71: 'Lu', 72: 'Hf', 73: 'Ta', 74: 'W', 75: 'Re', 76: 'Os', 77: 'Ir', 78: 'Pt', 79: 'Au', 80: 'Hg',
    81: 'Tl', 82: 'Pb', 83: 'Bi', 84: 'Po', 85: 'At', 86: 'Rn', 87: 'Fr', 88: 'Ra', 89: 'Ac', 90: 'Th',
    91: 'Pa', 92: 'U', 93: 'Np', 94: 'Pu', 95: 'Am', 96: 'Cm', 97: 'Bk', 98: 'Cf', 99: 'Es', 100: 'Fm',
    101: 'Md', 102: 'No', 103: 'Lr', 104: 'Rf', 105: 'Db', 106: 'Sg', 107: 'Bh', 108: 'Hs', 109: 'Mt', 110: 'Ds',
    111: 'Rg', 112: 'Cn', 113: 'Nh', 114: 'Fl', 115: 'Mc', 116: 'Lv', 117: 'Ts', 118: 'Og'
};

const atom_color_table = {
    1: 'ffffff', 2: 'd9ffff', 3: 'cc80ff', 4: 'c2ff00', 5: 'ffb5b5',
    6: '909090', 7: '3050f8', 8: 'ff0d0d', 9: '90e050', 10: 'b3e3f5',
    11: 'ab5cf2', 12: '8aff00', 13: 'bfa6a6', 14: 'f0c8a0', 15: 'ff8000',
    16: 'ffff30', 17: '1ff01f', 18: '80d1e3', 19: '8f40d4', 20: '3dff00',
    21: 'e6e6e6', 22: 'bfc2c7', 23: 'a6a6ab', 24: '8a99c7', 25: '9c7ac7',
    26: 'e06633', 27: 'f090a0', 28: '50d050', 29: 'c88033', 30: '7d80b0',
    31: 'c28f8f', 32: '668f8f', 33: 'bd80e3', 34: 'ffa100', 35: 'a62929',
    36: '5cb8d1', 37: '702eb0', 38: '00ff00', 39: '94ffff', 40: '94e0e0',
    41: '73c2c9', 42: '54b5b5', 43: '3b9e9e', 44: '248f8f', 45: '0a7d8c',
    46: '006985', 47: 'c0c0c0', 48: 'ffd98f', 49: 'a67573', 50: '668080',
    51: '9e63b5', 52: 'd47a00', 53: '940094', 54: '429eb0', 55: '57178f',
    56: '00c900', 57: '70d4ff', 58: 'ffffc7', 59: 'd9ffc7', 60: 'c7ffc7',
    61: 'a3ffc7', 62: '8fffc7', 63: '61ffc7', 64: '45ffc7', 65: '30ffc7',
    66: '1fffc7', 67: '00ff9c', 68: '00e675', 69: '00d452', 70: '00bf38',
    71: '00ab24', 72: '4dc2ff', 73: '4da6ff', 74: '2194d6', 75: '267dab',
    76: '266696', 77: '175487', 78: 'd0d0e0', 79: 'ffd123', 80: 'b8b8d0',
    81: 'a6544d', 82: '575961', 83: '9e4fb5', 84: 'ab5c00', 85: '754f45',
    86: '428296', 87: '420066', 88: '007d00', 89: '70abfa', 90: '00baff',
    91: '00a1ff', 92: '008fff', 93: '0080ff', 94: '006bff', 95: '545cf2',
    96: '785ce3', 97: '8a4fe3', 98: 'a136d4', 99: 'b31fd4', 100: 'b31fba',
    101: 'b30da6', 102: 'bd0d87', 103: 'c70066', 104: 'cc0059', 105: 'd1004f',
    106: 'd90045', 107: 'e00038', 108: 'e6002e', 109: 'eb0026', 110: 'eb0026',
    111: 'eb0026', 112: 'eb0026', 113: 'eb0026', 114: 'eb0026', 115: 'eb0026',
    116: 'eb0026', 117: 'eb0026', 118: 'eb0026',    
};

