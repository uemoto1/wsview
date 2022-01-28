class Editor {

    constructor(parentDiv) {
        this.parent = parentDiv
        this.parent.className = "editor";
        this.lineno = document.createElement("div");
        this.textarea = document.createElement("textarea");

        // Generate Linenumbers:
        var tmp = "";
        for(var i=1; i<1000; i++)
            tmp += "<p>" + i + "&nbsp;</p>";
        this.lineno.innerHTML = tmp;

        // Setup
        this.textarea.setAttribute("wrap", "off")

        this.parent.appendChild(this.lineno);
        this.parent.appendChild(this.textarea);
        this.resize();
    }

    scroll () {
        this.lineno.style.top = (-editor.textarea.scrollTop) + "px";
    }


    resize() {
        this.textarea.style.left = this.lineno.offsetWidth + "px";
        this.textarea.style.width = (this.parent.clientWidth - this.textarea.offsetLeft - 5) + "px";
        this.textarea.style.height = this.parent.clientHeight + "px";
    };
}


