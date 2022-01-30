// FORTRAN Namelist形式データ読み込み

class Namelist {
    constructor(rule) {
        this.error = [];
        this.warning = [];
        this.ignore = [];
        this.data = this._deepCopy(rule, true);
        // Initialize variables
        for(var group in this.data)
            for(var title in this.data[group])
                this.data[group][title].val = this._genDefault(group, title);
    }

    parse(code) {
        var err = [], warn = [];
        var group = "";
        var line = code.split(/\r?\n/);
        for(var i=0; i<line.length; i++) {
            var str = line[i];

            // スペースとコメントを削除
            str = str.replace(/^\s*/, "");
            str = str.replace(/\s*(!.*)?$/, "");
            
            // 空行は読み飛ばす
            if (!str) continue;
            
            // グループ開始部分(&xxxx)を検出
            var tmp = str.match(/^&(\w+)$/);
            if (tmp) {
                // 前回のグループがまだ閉じていない場合
                if (group)
                    err.push({lineno:i+1, msg:"previous group is not closed!"});
                group = tmp[1].toLowerCase();
                // 未定義のグループ名の場合
                if (this._isUndefinedGroup(group))
                    warn.push({lineno:i+1, msg:"group name is invalid!"});
                continue;
            }

            // グループ終了部分を検出
            var tmp = str.match(/^\/$/);
            if (tmp) {
                // グループがまだ閉じていない場合
                if (! group)
                    err.push({lineno:i+1, msg:"group is not opened!"});
                group = "";
                continue;
            }

            if (this.ignore.includes(group)) continue;

            // 代入文を検出
            var tmp = str.match(/^(\w+)\s*(\(.*\))?\s*=\s*(.+)$/);
            if (tmp) {
                var title = tmp[1].toLowerCase();

                if (! ((group in this.data) && (title in this.data[group]))) {
                    warn.push({lineno:i+1, msg:"undefined variable name or group!"});
                    continue;
                }

                var indices = tmp[2];
                var values = tmp[3];
                var err_tmp = this._assign(group, title, indices, values);
                if (err_tmp)
                    err.push({lineno:i+1, msg:err_tmp});

                continue;
            }
            
            err.push({lineno:i+1, msg:"invalid syntax!"});
        }

        this.error = err;
        this.warning = warn;
    }

    _deepCopy(x, lower=false) {
        var tmp = JSON.stringify(x);
        if (lower) tmp = tmp.toLowerCase();
        return JSON.parse(tmp);
    }

    _isUndefinedGroup(group) {
        return ! ((group in this.data) || (this.ignore.includes(group)));
    }

    _getArrayDimension(group, title) {
        var tmp = this.data[group][title];
        // if (tmp.kmax != undefined) return 3;
        if (tmp.jmax != undefined) return 2;
        if (tmp.imax != undefined) return 1;
        return 0;
    }

    _parseFortranValue(str, type) {
        if (type.match(/^integer/i)) {
            if (str.match(/^\s*[+-]?\s*\d+\s*$/)) {
                var tmp = parseInt(str);
                if (! isNaN(tmp)) return tmp;
            }
        } else if (type.match(/^real/i)) {
            if (str.match(/^\s*[+-]?\s*\d*\.?\d+([ed][+-]?\d+)?\s*$/i)) {                
                var tmp = parseFloat(str.replace(/d/i, "e"));
                if (! isNaN(tmp)) return tmp;
            }
        } else if (type.match(/^character/i)) {
            var tmp = str.match(/'(.*)'/);
            if (tmp) return tmp[1];
            var tmp = str.match(/"(.*)"/);
            if (tmp) return tmp[1];
            return str;
        }
        return undefined;
    }


    _genDefault(group, title) {
        var target = this.data[group][title];
        // 初期値が指定されている場合は単純コピーを行う
        if (target.default_val instanceof Object)
            return this._deepCopy(target.default_val);
        // 初期値がスカラの場合は配列を生成する
        switch (this._getArrayDimension(group, title)) {
        case 0:
            return target.default_val;
        case 1:
            var imax = target.imax;
            var imin = (target.imin == undefined) ? 1 : target.imin;
            var tmp = {};
            for(var i=imin; i<=imax; i++)
                tmp[i] = target.default_val;
            return tmp;
        case 2:
            var imax = target.imax;
            var imin = (target.imin == undefined) ? 1 : target.imin;
            var jmax = target.jmax;
            var jmin = (target.jmin == undefined) ? 1 : target.jmin;
            var tmp = {}
            for (var i=imin; i<=imax; i++) {
                tmp[i] = {};
                for (var j=jmin; j<jmax; j++) {
                    tmp[i][j] = target.default_val;
                }
            }
            return tmp;
        }
    }

    _assign(group, title, indices, values) {
        var target = this.data[group][title];
        switch (this._getArrayDimension(group, title)) {
        case 0: // スカラ変数の代入
            var x = this._parseFortranValue(values, target.type);
            if (x == undefined) return "invalid format of " + target.type;
            this.data[group][title].val = x;
            break;
        case 1: // 一次元配列の代入
            if (indices == undefined) return "unsupported assginment style";
            // 要素指定型の代入
            var imax = target.imax;
            var imin = (target.imin == undefined) ? 1 : target.imin;
            var tmp = indices.match(/\(\s*([+-]?\s*\d+)\s*\)/);
            if (tmp) {
                i = parseInt(tmp[1]);
                if (! (imin <= i && i <= imax)) return "out of index range";
                var x = this._parseFortranValue(values, target.type);
                if (x == undefined) return "invalid format of " + target.type;
                this.data[group][title].val[i] = x;
                break;
            }
            // スライス型代入
            var tmp = indices.match(/\(\s*([+-]?\s*\d*)\s*:\s*([+-]?\s*\d*)\s*\)/);
            if (tmp) {
                var iimin = (tmp[1] == undefined) ? imin : parseInt(tmp[1]);
                var iimax = (tmp[2] == undefined) ? imax : parseInt(tmp[2]);
                if (! (imin <= iimin && iimin <= iimax && iimax <= imax))
                    return "out of index range";
                var tmp = values.split(/\s*,\s*/);
                if (tmp.length != (iimax - iimin + 1))
                    return "assignment array size mismatch";
                for (var i=iimin; i<=iimax; i++) {
                    var x = this._parseFortranValue(tmp[i-imin], target.type);
                    if (x == undefined) return "invalid format of " + target.type;
                    this.data[group][title].val[i] = x;
                }
                break;
            }
            return "unsupported assginment style";
        }
        return;
    }


}
