



class CIFReader {

    constructor(cif_data) {
        // グローバル変数
        // 格子定数
        this.a = 1.0;
        this.b = 1.0;
        this.c = 1.0;
        
    }

    _removeComment(text) {
        return text.replace(/^\s*(.*?)\s*(#.*)$/, "$1");
    }
    




    parseCIF(code) {
        var line = code.split(/\r?\n/);

        this.data = {}
        var text, result;1z
        var i = 0;
        while (i < line.length) {
            // Skip comment line
            text = this._removeComment(line[i]);
            result;
            if (text.length > 0) {
                // data_ section
                result = text.match(/^data_(.*)$/);
                if (result) {
                    this.data[r[1]] = result[2];
                    i++;
                    continue;
                }
                // loop_ section
                result = text.match(/^loop_$/);
                if (result) {
                    i++;
                    col = [];
                    while (i < line.length) {
                        result = text.match(/^_(.*)$/);
                        if (result) {
                            col = col.concat([result[1]]);
                            i++;
                            continue;
                        } else {
                            break;
                        }
                    }
                    while (i < line.length) {
                        result = this._split2()
                        if (result) {
                            col = col.concat([result[1]]);
                            i++;
                            continue;
                        } else {
                            break;
                        }
                    }



                        

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
    )



function splitEx(text) {
    var tmp1 = text.split(/['"]/);
    var tmp2 = [];
    for (var i=0; i<tmp1.length; i++) {
        if (i % 2 == 0) {
            tmp2 = tmp2.concat(tmp1[i].trim().split(/\s+/));
        } else {
            tmp2 = tmp2.concat([tmp1[i]]);
        }
    }
    return tmp2;
}

