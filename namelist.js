class Namelist {

    constructor(group_ignore) {
        this.namelist_rule = {};
        this.result = {};
    }

    _extract_values(values) {
        
    }

    

    parse(code) {
        // 出力先をクリア
        this.result = {};
        this.error = [];

        // 一時変数
        var i;
        var group = "";
        
        // エラー出力関数
        function write_err(x) {
            this.error.push({lineNum:i+1, msg:x});
        }

        // 読み込み開始
        var line = code.split(/\r?\n/);
        for(i=0; i<line.length; i++) {
            var text = line[i]
            
            // Remove comment and spaces
            text = text.replace(/!.*$/, "").trim();

            // Skip empty line
            if (! text) continue;

            // Detect beginning of group
            var ret = text.match(/^&(\w+)$/);
            if (ret) {
                if (group)
                    write_err("previous group is not closed!");
                group = ret[1];
                continue;
            }

            // Detect ending of group
            var ret = text.match(/^\/$/);
            if (ret) {
                if (! group)
                    write_err("previous group is not opened!");
                group = "";
                continue;
            }

            // Skip group_ignore
            if (group_ignore.includes(group)) continue;

            // Detect assignment
            var ret = text.match(/^(\w+)\s*(\(.*\))?\s*=\s*(.*)$/);
            if (ret) {
                var varname = ret[1];
                var indices = ret[2];
                var values = ret[3];

                varname = varname.toLowerCase()

                if ((indices == undefined)) {
                    // スカラ変数の代入
                    this.result[group][varname] = values;
                } else {
                    // 配列変数への代入

                    // 空要素を作成
                    if (result[group][varname] == undefined)
                        this.result[group][varname] = {};

                    // スライス代入
                    ret = indices.match(/\s*^(\d+)\s*:\s*(\d+)\s*$/)
                    if (ret) {
                        kmin = parseInt(ret[1]);
                        kmax = parseInt(ret[2]);
                        value_list = values.split(/,/);
                        if (value_list.length == (kmax-kmin+1)) {
                            for(var k=kmin; k<=kmax; k++) {
                                this.result[group][varname][k] = value_list[k-kmin];
                            }
                            continue;
                        }
                    }

                    ret = indices.match(/\s*(\d+)\s*$/);
                    if (ret) {
                        k = parseInt(ret[1]);
                        this.result[group][varname] = values;
                    }
                }
                 write_err("unsupported type assignment!");
            }
            write_err("invalid syntex!");
        }
    }
}
