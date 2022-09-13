class Context {
    /**@type {ScriptNode} */
    root
}
class ScriptNode {
    /**@type {config[0]} */
    config

    /**@type {Object<string,ScriptNode|string|number|boolean>} */
    params = []

    render() {
        let desc = this.config.render(this.params)
        return desc
    }

    render_desc(element_id) {
        let desc = this.config.render_desc(this.params, element_id)
        return desc
    }
    render_create(element_id) {
        let desc = this.config.render_create(this.params, element_id)
        return desc
    }
}

class DialogView {
    constructor(element) {
        /**@type {ScriptNode} */
        this.node = null
        /**@type {HTMLElement} */
        this.element = element
        this.element["view"] = this
        /**@type {HTMLFormElement} */
        this.content = element.querySelector("#content")
        /**@type {HTMLSelectElement} */
        let select = element.querySelector("select")
        select.onchange = () => this.updateSelect()
        this.select = select

        this.content.onsubmit = (event) => this.onsubmit(event)

        this.onSubmit = null
    }

    /**@param configs [config] */
    setData(configs) {
        let options = configs.map(v => new Option(v.id, v.id))
        for (let i of options) {
            this.select.options.add(i)
        }
        this.updateSelect()
    }

    updateSelect() {
        let selected = this.select.selectedOptions[0]
        let config = getConfig(selected.value)
        this.node = new ScriptNode();
        this.node.config = config;
        console.log(this.element.id, "!!!!")
        setTimeout(() => {

            let content = this.element.querySelector(".input")
            if (content) {
                content.onchange = () => {
                    console.log(content.value)
                    this.node.params = [content.value]
                }
            }
        })

        this.render()


    }

    render() {
        console.log(this.node.params)
        let html = this.node.render_create(this.element.id)
        let desc = this.element.querySelector("#desc")
        desc.innerHTML = html
    }

    onsubmit(event) {
        try {
            this.onSubmit && this.onSubmit(this.node)

        } catch (error) {

        }
        return false
    }
}

var context = new Context()

function ondblclick(hash) {

}

function getConfig(id) {
    return config.filter(v => v.id == id)[0]
}

function main() {
    context.root = new ScriptNode()
    context.root.config = getConfig("nodelist")

    render()

}

function render() {
    let html = context.root.render()
    document.getElementById("editor").innerHTML = html
}


var viewMap = {}
/**@param configs {[config[0]]} */
function popup(dialog_id, configs) {

    configs.sort((a, b) => {
        return Number(a.sort || 0) - Number(b.sort || 0)
    })

    /**@type {HTMLDivElement} */
    let dialog = document.getElementById("dialog").cloneNode(true)
    dialog.id = String(Math.random())
    dialog.style.display = ""
    document.body.appendChild(dialog)

    let dialogView = new DialogView(dialog)
    this.viewMap[dialog.id] = dialogView
    dialogView.setData(configs)
    dialogView.onSubmit = () => {
        let node = dialogView.node
        try {
            dialog.parentNode.removeChild(dialog)
            delete viewMap[dialog.id]
        } catch (error) {
            console.log(error)
        }
        console.log(111)

        let parent = document.getElementById(dialog_id)
        console.log(dialog_id, "!!!")

        /**@type {DialogView} */
        let view = viewMap[parent.id]
        if (parent) {
            view.node.params[0] = node
            view.render()
            console.log(node)
            console.log(params["view"])
        }


    }
    return false
}


function append(target, dialog_id, type) {
    console.log(target)
    let cfgs = config.filter(v => v.kind == type)
    popup(dialog_id, cfgs)
    return false
}

function appendParam(target, dialog_id, type) {
    console.log(target)
    let cfgs = config.filter(v => v.return == type)
    popup(dialog_id, cfgs)
    return false
}


main()