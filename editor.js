class Editor {

    constructor(parentDiv) {
        this.parent = parentDiv
        this.parent.className = "editor";
        this.lineNum = document.createElement("div");
        this.textarea = document.createElement("textarea");

        // Generate Linenumbers:
        var tmp = "";
        for(var i=1; i<1000; i++)
            tmp += "<p>" + i + "&nbsp;</p>";
        this.lineNum.innerHTML = tmp;

        // Setup
        this.textarea.setAttribute("wrap", "off")

        this.parent.appendChild(this.lineNum);
        this.parent.appendChild(this.textarea);
        this.resize();

        // Set event lister
        this.textarea.addEventListener('scroll', (e)=>{
            this.lineNum.style.top = (-editor.textarea.scrollTop) + "px";
        });
    }


    resize() {
        this.textarea.style.left = this.lineNum.offsetWidth + "px";
        this.textarea.style.width = (this.parent.clientWidth - this.textarea.offsetLeft - 5) + "px";
        this.textarea.style.height = this.parent.clientHeight + "px";
    };

    mark(mark=[], err=[]) {
        var tmp = this.lineNum.children;
        for(var i=0; i<tmp.length; i++) {
            if (mark.includes(i+1)) {
                tmp[i].className = "mark";
            } else if (err.includes(i+1)) {
                tmp[i].className = "err";
            } else {
                tmp[i].className = "";
            }
        }
    }

    jump(l) {
        var tmp = this.lineNum.children;
        if (1 <= l && l <= tmp.length)
            this.textarea.scrollTo(0, tmp[l-1].offsetTop);
    }
}


