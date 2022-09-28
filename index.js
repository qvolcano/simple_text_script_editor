function guid() {
    function S4() {
        return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
    }
    return ("_" + S4() + S4() + S4() + S4() + S4() + S4() + S4() + S4());
}
class Block {
    uuid = guid()
    type = ""
    value = null
    /**@type {[Block]} */
    params = []

    constructor(type) {
        this.type = type
    }
    find(uuid) {
        if (this.uuid == uuid) {
            return this
        } else {
            for (let i of this.params) {
                let block = i.find(uuid)
                if (block) {
                    return block
                }
            }
        }
    }
}

view_mgr = {}

class EditorView {
    /**@type {Block} */
    block
    uuid = guid()
    constructor(node) {
        /**@type {HTMLElement} */
        this.node = node
    }

    render() {
        let desc = createBlockDesc(this.uuid, this.block)
        this.node.innerHTML = desc
    }

    render_block(uuid) {
        let child_block = this.block.find(uuid)
        let child_node = this.node.querySelector("#" + uuid)
        if (child_node) {
            child_node.innerHTML = createBlockDesc(this.uuid, child_block, 0, 0, true)
        }
    }
}

class ParamView {
    /**@type {Block} */
    block = null
    uuid = guid()

    /**
     * 
     * @param {HTMLElement} node 
     * @param {BlockConfig} configs
     */
    constructor(node, configs, block) {

        /**@type {HTMLElement} */
        this.node = node
        /**@type {HTMLFormElement} */
        this.content = node.querySelector("#content")
        /**@type {HTMLSelectElement} */
        this.select = node.querySelector("select")
        this.content.onsubmit = (event) => this.onsubmit(event)
        this.onConfirm = null
        this.onClose = null
        /**@type {BlockConfig} */
        this.configs = configs
        let options = configs.map(v => new Option(v.id, v.id))
        for (let i of options) {
            this.select.options.add(i)
        }

        /**@type {HTMLButtonElement} */
        let btnCancel = node.querySelector("#btnCancel")
        btnCancel.onclick = () => {
            this.close()
        }
        this.updateSelect()
    }

    /**@param {Block} param */
    setParam(index, param) {
        this.block.params[index] = param
        this.render()
    }

    updateSelect() {
        let selected = this.select.selectedOptions[0]
        let config = getConfig(selected.value)
        this.block = createBlock(config.id)
        console.log(this.node.id, "!!!!")
        setTimeout(() => {

            let content = this.node.querySelector(".input")
            if (content) {
                content.onchange = () => {
                    console.log(content.value)
                    this.block.params = [content.value]
                }
            }
        })

        this.render()
    }

    render() {
        let desc = createBlockDesc(this.uuid, this.block, 1)
        let node = document.getElementById(this.block.uuid)
        if (node) {
            node.innerHTML = desc;
        } else {
            this.node.querySelector("#desc").innerHTML = desc
        }
    }

    onsubmit(event) {
        try {
            this.onConfirm && this.onConfirm(this.block)

        } catch (error) {

        }
        return false
    }

    close() {
        this.node.parentNode.removeChild(this.node)
        delete view_mgr[this.uuid]
    }
}

function getConfig(id) {
    return BlockConfig.filter(v => v.id == id)[0]
}

function getConfigs(type) {
    return BlockConfig.filter(v => v.return == type)
}

function popupParamView(type, block) {
    let configs = getConfigs(type)
    configs.sort((a, b) => {
        return Number(a.sort || 0) - Number(b.sort || 0)
    })

    /**@type {HTMLDivElement} */
    let prefab = document.getElementById("dialog").cloneNode(true)
    prefab.style.display = ""
    document.body.appendChild(prefab)
    let view = new ParamView(prefab, configs, block)
    prefab.id = view.uuid
    view_mgr[view.uuid] = prefab["view"] = view

    return view



}

function findView(a) {
    let node = a
    while (node) {
        if (view_mgr[node.id]) {
            return view_mgr[node.id]
        } else {
            node = node.parentElement
        }
    }
}

function onInsterClick(event, view_uuid, block_uuid, param_type) {
    let view = view_mgr[view_uuid]
    let cur_block = view.block.find(block_uuid)
    onAchorClick(event, view_uuid, cur_block.uuid, cur_block.params.length, "node")
    return false
}

function onAchorClick(event, view_uuid, block_uuid, param_index, param_type) {
    if (event.defaultPrevented) {
        return
    }
    event.preventDefault()
    let source_view = view_mgr[view_uuid]
    if (source_view) {
        let block = source_view.block.find(block_uuid)
        if (block) {
            if (param_type == null) {
                let cfg = getConfig(block.type)
                if (cfg == null) {
                    //bass class
                    param_type = block.type
                } else {
                    param_type = cfg.kind || cfg.return
                }
            }
            let view = popupParamView(param_type, block)
            view.onConfirm = () => {
                if (block.type == "nodelist") {
                    block.params.push(view.block)
                    source_view.render_block(block_uuid)
                } else {
                    block.type = view.block.type
                    block.value = view.block.value
                    block.params = view.block.params
                    source_view.render_block(block.uuid)
                }
                view.close()
            }
            view.onClose = () => {

            }
        }
    }
    return false
}
/**
 * 
 * @param {Block} block 
 */
function createBlockDesc(view, block, mode, stack, update) {
    if (stack == null) {
        stack = 0
    }
    let config = getConfig(block.type)
    if (config == null) {
        return block.value
    }
    let src_desc = (mode == 1 ? config.create : config.desc) || config.desc
    let desc = src_desc.replace(/\$\{([^\}]+)\}/g, (substr, group) => {
        let cmds = group.split(",")
        switch (cmds[0]) {
            case "inster":
                // return "-------"
                return createBlockLink("onInsterClick", view, block.uuid, cmds[2], true)
            // return createBlockParamLink("onInsterClick", view, block.uuid, cmds[2], stack, cmds[1]);
            case "nodelist":
                let r = "";
                for (let i = 0; i < block.params.length; i++) {
                    let param = block.params[i]
                    r += createBlockDesc(view, param, mode, stack + 1)
                    // r += createBlockParamLink("onAchorClick", view, block.uuid, i, param.type, createBlockDesc(view, param, mode, stack + 1), stack + 1, param.uuid)
                }
                return r;
            default:
                let param = block.params[cmds[0]]
                if (param) {
                    let param_desc = ""
                    if (param.value != null) {
                        param_desc = param.value
                    } else {
                        param_desc = createBlockDesc(view, param, mode, stack + 1)
                    }
                    return createBlockLink("onAchorClick", view, param.uuid, param_desc)
                } else {
                    return "ss"
                }
        }
    })
    let tabs = ""
    for (let i = 0; i < stack; i++) {
        tabs += "@"
    }
    if (update) {
        return desc
    } else {
        return createBlockLink("onAchorClick", view, block.uuid, desc)
    }
}

function createBlockLink(fn, view, block_uuid, desc, disbled) {
    let target = "'" + view + "," + block_uuid + "'"
    // return "<object id='" + block_uuid + "'  class='param_label' data=" + target + " onclick=test(event) > " + desc + "</object > "
    if (disbled) {
        return " <object title='block' class='param_label'  href=\'javablock:void(0)\' onclick=\"" + fn + "(event,'" + view + "','" + block_uuid + "')\"> " + desc + " </object> "
    } else {
        return " <object title='block' id='" + block_uuid + "'  class='param_label'  href=\'javablock:void(0)\' onclick=\"" + fn + "(event,'" + view + "','" + block_uuid + "')\"> " + desc + " </object> "
    }
}

function createBlockParamLink(fn, view, block_uuid, param_desc, stack, param_type) {
    let str = " <label class='param_label param_label" + stack + "'" + " href=\'javablock:void(0)\' onclick='" + fn + "(this,'" + view + "','" + block_uuid + "'," + "'" + param_type + "')} '> " + param_desc + " </label>  "
    // if (object_uuid) {
    //     return "<object id='" + object_uuid + "'> " + str + "</object>"
    // }
    return str
}


function createBlock(id) {
    let block = new Block(id)
    let config = getConfig(id)
    for (let i in config.params) {
        if (config.params[i].default) {
            let child = new Block(config.params[i].type)
            block.params[i] = child
            child.value = config.params[i].default
        }
    }
    return block
}


var editorView = new EditorView(document.getElementById("editor"))
editorView.block = createBlock("nodelist")
view_mgr[editorView.uuid] = editorView
editorView.render()