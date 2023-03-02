// 結晶構造描画クラス
class Shape3D {

    constructor(canvas) {
        // グローバル変数
        // 描画先オブジェクト
        this.canvas = canvas;
        // モデル関連変数
        this.ix_min = -10 // x軸下限
        this.ix_max =  10 // x軸上限
        this.iy_min = -10 // y軸下限
        this.iy_max = 10 // y軸上限
        this.iz_min = -10 // z軸下限
        this.iz_max = 10 // z軸上限
        this.hx = 1.00
        this.hy = 1.00
        this.hz = 1.00
        this.n_s = 0 // 形状オブジェクト層数
        this.typ_s = {} // 形状名称
        this.ori_s = {} // 形状補助
        this.inf_s = {} // 形状補助
        this.id_s = {} // 
        this.shape_table = {
            "ellipsoid": 0,
            "half-ellipsoid": 1,
            "elliptic-cylinder": 2,
            "triangular-cylinder": 3,
            "rectangular-cylinder": 4,
            "elliptic-cone": 5,
            "triangular-cone": 6,
            "rectangular-cone": 7,
            "elliptic-ring": 8
        }
        // 可視化関連
        this.zoom = 1.0 // 拡大倍率
        // プライベート変数
        // THREE.js レンダラー関連
        this.renderer = new THREE.WebGLRenderer({"canvas": this.canvas});
        this.camera = new THREE.OrthographicCamera();
        this.scene = new THREE.Scene();
        // 三次元オブジェクト
        this.axes = new THREE.Group(); // 軸オブジェクト
        this.model = new THREE.Group(); // 描画対象
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
        this.face_material = {
            1: new THREE.MeshLambertMaterial({color: 0x1f77b4}),
            2: new THREE.MeshLambertMaterial({color: 0xff7f0e}),
            3: new THREE.MeshLambertMaterial({color: 0x2ca02c}),
            4: new THREE.MeshLambertMaterial({color: 0xd62728}),
            5: new THREE.MeshLambertMaterial({color: 0x9467bd}),
            6: new THREE.MeshLambertMaterial({color: 0x8c564b}),
            7: new THREE.MeshLambertMaterial({color: 0xe377c2}),
            8: new THREE.MeshLambertMaterial({color: 0x7f7f7f})
        }
        // レンダラの初期設定
        // 背景色
        this.renderer.setClearColor(0xffffff, 1.0);
        // カメラ
        this.camera.position.set(0, 0, 3);
        this.camera.lookAt(0, 0, 0);
        this.camera.zoom = this.zoom;
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

    redraw() {
        // 表示サイズ計算
        this.width = parseFloat(this.canvas.clientWidth);
        this.height = parseFloat(this.canvas.clientHeight);
        this.unit = 0.5 * Math.min(this.width, this.height);
        // カメラ設定変更
        this.camera.left = -0.5 * this.width / this.unit
        this.camera.right = +0.5 * this.width / this.unit
        this.camera.bottom = -0.5 * this.height / this.unit
        this.camera.top = +0.5 * this.height / this.unit
        this.camera.zoom = this.zoom;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(this.width, this.height);
        // レンダリング
        this.renderer.render(this.scene, this.camera);
    }


    clear() {
        // 既存のオブジェクトを消去
        this.axes.clear();
        this.model.clear();
        // セレクタを解除
        // this.selected_index = -1;
        // this.selector.visible = false;
    }

    plot() {
        // 消去
        this.clear();
        // 座標軸描画
        this.axes.add(this.create_axes_object());
        this.axes.position.set(-0.75, 0.75, 0.75);
        const nx = this.ix_max - this.ix_min + 1
        const ny = this.iy_max - this.iy_min + 1
        const nz = this.iz_max - this.iz_min + 1
        const lx = nx * this.hx;
        const ly = ny * this.hy;
        const lz = nz * this.hz;

        var imat = new Int8Array(nx * ny * nz);
        for (var i=1; i<=this.n_s; i++) {
                [imat, this.typ_s[i], 
                this.ori_s[i][1], this.ori_s[i][2], this.ori_s[i][3],
                this.inf_s[i][1], this.inf_s[i][2], this.inf_s[i][3], this.inf_s[i][4], this.inf_s[i][5], this.id_s[i]
            ]
            this.fill_shape(imat, this.typ_s[i], 
                this.ori_s[i][1], this.ori_s[i][2], this.ori_s[i][3],
                this.inf_s[i][1], this.inf_s[i][2], this.inf_s[i][3], this.inf_s[i][4], this.inf_s[i][5], this.id_s[i]);
        }

        this.remove_useless_cell(imat);
        const geometry = new THREE.BoxGeometry(this.hx, this.hy, this.hz);
        for(var jx=0; jx<nx; jx++) {
            for(var jy=0; jy<ny; jy++) {
                for(var jz=0; jz<nz; jz++) {
                    const m = imat[jx*ny*nz+jy*nz+jz];
                    
                    if (m > 0) {
                        const cube = new THREE.Mesh(geometry, this.face_material[m]);
                        cube.position.x = (jx - nx * 0.5) * this.hx
                        cube.position.y = (jy - ny * 0.5) * this.hy
                        cube.position.z = (jz - nz * 0.5) * this.hz
                        this.model.add(cube);
                    }
                }
            }
        }

        var l = Math.max(lx, ly, lz)
        this.model.scale.set(1/l,1/l,1/l)
        // 描画
        this.redraw();
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
            const dx = +(x - this.xtmp) * (1.0 / this.unit / this.zoom);
            const dy = -(y - this.ytmp) * (1.0 / this.unit / this.zoom);
            var d = new THREE.Vector3(dx, dy, 0.50);
            d.normalize();
            // 回転クオータにオンを計算
            var q = new THREE.Quaternion();
            q.setFromUnitVectors(this.ez, d);
            q.multiply(this.qtmp);

            this.model.quaternion.copy(q.normalize());
            this.axes.quaternion.copy(q.normalize());
            // 再描画
            this.redraw();
        }
    }

    select(x, y) {
        // const vx = +(x - this.width * 0.5) / this.width * 2;
        // const vy = -(y - this.height * 0.5) / this.height * 2;
        // const v = new THREE.Vector2(vx, vy);
        // this.raycaster.setFromCamera(v, this.camera);
        // var intersects = this.raycaster.intersectObjects(this.atom.children);
        // if (intersects.length > 0) {
        //     this.selected_index = intersects[0].object.tag.i;
        //     this.selector.position.copy(intersects[0].object.position);
        //     this.selector.visible = true;
        // } else {
        //     this.selected_index = -1;
        //     this.selector.visible = false;
        // }
        // this.redraw();
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

    create_axes_object(r1=0.01, r2=0.03, h1=0.10, h2=0.05) {
        var dir1 = this.ex.clone();
        var dir2 = this.ey.clone();
        var dir3 = this.ez.clone();
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

    fill_shape(imat, shape_mode, x0, y0, z0, fx, fy, fz, a, b, m) {
        const nx = this.ix_max - this.ix_min + 1
        const ny = this.iy_max - this.iy_min + 1
        const nz = this.iz_max - this.iz_min + 1
        const ishape = this.shape_table[shape_mode]
        for (var jx = 0; jx < nx; jx++) {
            const x = (jx + this.ix_min) * this.hx 
            for (var jy = 0; jy < ny; jy++) {
                const y = (jy + this.iy_min) * this.hy 
                for (var jz = 0; jz < nz; jz++) {
                    const z = (jz + this.iz_min) * this.hz 
                    if (this.check_inside(ishape, x-x0, y-y0, z-z0, fx, fy, fz, a, b)) {
                        imat[jx*ny*nz+jy*nz+jz] = m
                    }
                }
            }
        }
    }

    remove_useless_cell(buf) {
        const nx = this.ix_max - this.ix_min + 1
        const ny = this.iy_max - this.iy_min + 1
        const nz = this.iz_max - this.iz_min + 1
        var kx, ky, kz, m1, m2, m3, m4, m5, m6
        for (var ix = 0; ix < nx; ix++) {
            for (var iy = 0; iy < ny; iy++) {
                for (var iz = 0; iz < nz; iz++) {
                    if (buf[ix*ny*nz+iy*nz+iz] > 0) {
                        kx =+1; ky = 0; kz = 0; m1 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        kx =-1; ky = 0; kz = 0; m2 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        kx = 0; ky =+1; kz = 0; m3 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        kx = 0; ky =-1; kz = 0; m4 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        kx = 0; ky = 0; kz =+1; m5 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        kx = 0; ky = 0; kz =-1; m6 = buf[(ix+kx)*ny*nz+(iy+ky)*nz+(iz+kz)]
                        if ((m1 > 0) && (m2 > 0) && (m3 > 0) && (m4 > 0)  && (m5 > 0) && (m6 > 0)) {
                            buf[ix*ny*nz+iy*nz+iz] = 0
                        }
                    }
                }
            }
        }
    }

    check_inside(ishape, x, y, z, fx, fy, fz, a, b) {
        var flag = false
        var tmp;
        switch(ishape) {
        case 0: // ellipsoid
            tmp = Math.pow(x / (fx / 2.0), 2) + Math.pow(y / (fy / 2.0), 2) + Math.pow(z / (fz / 2.0), 2)
            flag = (tmp <= 1.0);
            break;
        case 1: // half-ellipsoid
            tmp = Math.pow(x / (fx / 2.0), 2) + Math.pow(y / (fy / 2.0), 2) + Math.pow(z / (fz), 2)
            flag = ((tmp <= 1.0) && (z >= 0))
            break;
        case 2: // elliptic-cylinder
            tmp = Math.pow(x / (fx / 2.0), 2) + Math.pow(y / (fy / 2.0), 2)
            flag = ((tmp <= 1.0) && (z >= -fz / 2.0) && (z <= fz / 2.0))
            break;
        case 3: // triangular-cylinder
            flag = ((x >= -fx / 2.0) && (x <= fx / 2.0) && (y >= -fy / 3.0)
                && (y <= (fy / (fx / 2.0)*x + fy*2.0 / 3.0))
                && (y <= (fy / (fx / 2.0)*x + fy*2.0 / 3.0))
                && (z >= -fz / 2.0) && (z <= fz / 2.0))
            break;
        case 4: // rectangular-cylinder
            flag = ((x >= -fx / 2.0) && (x <= fx / 2.0)
                && (y >= -fy / 2.0) && (y <= fy / 2.0)
                && (z >= -fz / 2.0) && (z <= fz / 2.0))
            break;
        case 5: // elliptic-cone
            tmp = Math.pow(x / (fx / 2.0*(fz-z) / fz), 2) + Math.pow(y / (fy / 2.0*(fz-z) / fz), 2)
            flag = ((tmp <= 1.0) && (z >= 0) && (z <= fz))
            break;
        case 6: // triangular-cone
            flag = ((x >= -fx / 2.0*(fz-z) / fz)
                && (x <= fx / 2.0*(fz-z) / fz)
                && (y >= -fy / 3.0*(fz-z) / fz)
                && (y <= (fy / (fx / 2.0)*x + fy*2.0 / 3.0*(fz-z) / fz))
                && (y <= (-fy / (fx / 2.0)*x + fy*2.0 / 3.0*(fz-z) / fz))
                && (z >= 0) && (z <= fz))
            break;
        case 7: // rectangular-cone
            flag = ((x >= -fx / 2.0*(fz-z) / fz)
                && (x <= fx / 2.0*(fz-z) / fz)
                && (y >= -fy / 2.0*(fz-z) / fz)
                && (y <= fy / 2.0*(fz-z) / fz)
                && (z >= 0) && (z <= fz))
            break
        case 8: // elliptic-ring
            tmp = Math.pow(x / (fx / 2.0), 2) + Math.pow(y / (fy / 2.0), 2)
            if((tmp <= 1.0) && (z >= -fz / 2.0) && (z <= fz / 2.0)){
                tmp = (x / (a / 2.0))**2.0 + (y / (b / 2.0))**2.0
                flag = (tmp >= 1.0)
            }
            break
        }
        return flag;
    }
    


}


