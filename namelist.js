// FORTRAN Namelist形式データ読み込み

class Namelist {
    constructor() {
        this.arr_range = {}
        this.data = {}
        this.success = undefined
        this.errorLineNum = undefined
    }

    add_group(group) {
        this.arr_range[group] = {}
        this.data[group] = {}
    }

    add_variable(group, var_name, arr_range=[], default_val="") {
        this.arr_range[group][var_name] = arr_range
        switch (arr_range.length) {
        case 0:
            this.data[group][var_name] = default_val
            break
        case 1:
            this.data[group][var_name] = {}
            for (var i = arr_range[0][0]; i <= arr_range[0][1]; i++) {
                this.data[group][var_name][i] = default_val
            }
            break
        case 2:
            this.data[group][var_name] = {}
            for (var i = arr_range[0][0]; i <= arr_range[0][1]; i++) {
                this.data[group][var_name][i] = {}
                for (var j = arr_range[1][0]; j <= arr_range[1][1]; j++) {
                    this.data[group][var_name][i][j] = default_val
                }
            }
            break
        }
    }


    set_array_var(group, var_name, index_str, val) {
        if (this.data[group] === undefined) return true;
        if (this.data[group][var_name] === undefined) return true;
        const arr_range = this.arr_range[group][var_name]
        var tmp_val = val.split(/,/)
        var tmp_index;
        if (index_str) {
            tmp_index = index_str.split(/,/);
        }
        switch (arr_range.length) {
        case 0:
            this.data[group][var_name] = tmp_val[0].trim()
            break
        case 1:
            var arr_range0 = this._get_range(tmp_index[0], arr_range[0][0], arr_range[0][1])
            if (arr_range0 === undefined) return false
            var n = 0
            for(var i=arr_range0[0]; i<=arr_range0[1]; i++) {
                if (n == tmp_val.length) return false
                this.data[group][var_name][i] = tmp_val[n].trim()
                n++
            }
            break
        case 2:
            var arr_range0 = this._get_range(tmp_index[0], arr_range[0][0], arr_range[0][1])
            var arr_range1 = this._get_range(tmp_index[1], arr_range[1][0], arr_range[1][1])
            if (arr_range0 === undefined) return false
            if (arr_range1 === undefined) return false
            var n = 0
            for(var j=arr_range1[0]; j<=arr_range1[1]; j++) {
                for(var i=arr_range0[0]; i<=arr_range0[1]; i++) {
                    if (n == tmp_val.length) return false
                    this.data[group][var_name][i][j] = tmp_val[n].trim()
                    n++
                }
            }
            break
        }
        return true
    }

    parse(code) {
        this.success = true
        this.errorLineNum = undefined

        var group = ""
        var line = code.split(/\r?\n/)
        for(var i=0; i<line.length; i++) {
            var tmpLine = line[i]

            // コメントを削除
            tmpLine = tmpLine.replace(/!.*$/, "")
            tmpLine = tmpLine.replace(/#.*$/, "")

            // 空行は読み飛ばす
            if (tmpLine.match(/^\s*$/)) continue

            // グループ開始部分(&xxxx)を検出
            var tmp = tmpLine.match(/^\s*&(\w+?)\s*$/)
            if (tmp) {
                group = tmp[1].toLowerCase()
                continue
            }

            if (group.length > 0) {
                // グループ終了部分(/)を検出
                var tmp = tmpLine.match(/^\s*\/\s*$/)
                if (tmp) {
                    group = ""
                    continue
                }

                // 代入文を検出
                var tmp = tmpLine.match(/^\s*(\w+)\s*(\((.+?)\))?\s*=\s*(.+?)\s*$/)
                if (tmp) {
                    var var_name = tmp[1].toLowerCase()
                    var index_str = tmp[3]
                    var val_str = tmp[4]
                    this.set_array_var(group, var_name, index_str, val_str)
                    continue;
                }
            }

            // 文法違反
            console.log(group,line[i])
            this.success = false
            this.errorLineNum = i+1
            break;
        }         
        return this.success;   
    }
    
    _get_range(range_str1, imin0, imax0) {
        var imin, imax
        var tmp = range_str1.match(/^\s*(\d+)\s*$/)
        if (tmp) {
            imin = parseInt(tmp[1])
            if (isNaN(imin)) return undefined
            imax = imin
            return [imin, imax]
        }
        tmp = range_str1.match(/^\s*(\d*)\s*:\s*(\d*)\s*$/)
        if (tmp) {
            if (tmp[1]) {
                imin = parseInt(tmp[1])
                if (isNaN(imin)) return undefined
            } else {
                imin = imin0
            }
            if (tmp[2]) {
                imax = parseInt(tmp[2])
                if (isNaN(imax)) return undefined
            } else {
                imax = imax0
            }
            return [imin, imax]
        }
        return undefined
    }
}


