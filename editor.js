class Crystal3D {

    constructor(parentDiv) {
        this.parent = parentDiv
        this.parent.className = "editor";
        this.lineno = document.createElement("div");
        this.textarea = document.createElement("textarea");

        // Generate Linenumbers:
        tmp = "";
        for(var i=1; i<1000; i++)
            tmp += "<p>" + i + "</p>";
        this.lineno.innerHTML = tmp;

        this.parent.appendChild(this.lineno);
        this.parent.appendChild(this.textarea);
    }


    resize() {
        target.style.width = window.innerWidth+"px";
        target.style.height = window.innerHeight+"px";
        this.textarea.style.height = this.parent.offsetHeight + "px";
        this.textarea.style.width = (this.parent.offsetWidth - this.textarea.offsetLeft) + "px";
    };
}


