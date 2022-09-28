/**@type {[{id,name,kind,create_desc,render_desc:[string],desc,params,return,render:Function}]} */
var BlockConfig = [

    {
        id: "nodelist",
        kind: "nodelist",
        desc: "${nodelist}<br>${inster,node,双击插入}",
        detail: "${nodelist}<br>${inster,node,双击插入}",
        render_desc: [
            "${nodelist}",
            "${inster,node,双击插入}"
        ],
        params: [
            {
                type: "node"
            }
        ],
        render_desc: function (params) {
            return params.map(v => v.render_desc()).concat("${inster,双击插入}")

        }
        // function (params, element_id) {
        //     return [
        //         "<a href=\'javascript:void(0)\'  onclick='append(this," + element_id + ",\"node\")'>--------inster-----</a>"
        //     ]
        // }
    },

    {
        id: "for",
        name: "循环",
        kind: "node",
        return: "node",
        params: [
            {
                type: "int",
                default: 10
            },
            {
                type: "nodelist",
            }
        ],
        create: "循环${0}次",
        desc: "循环${0}次<br>${inster,node,双击插入}"
    },

    // {
    //     id: "for a",
    //     name: "循环变量A",
    //     render_desc: [
    //         "循环变量A"
    //     ]
    // },

    {
        id: "set_int_var",
        name: "设置整型变量",
        return: "node",
        kind: "node",
        params: [
            {
                type: "string",
                default: 10
            },
            {
                type: "int",
                default: 10
            },
        ],
        render_create: function () {
            return "设置整型变量 ${0,string} 为 ${1,int}"
        },
        detail: "设置整型变量 ${0} 为 ${1}"

    },

    {
        id: "get_int_var",
        return: "int",
        detail: "获取变量 ",
        params: [
            {
                type: "string",
                default: "name"
            }
        ],
        desc: "获取int变量${0}"
    },
    {
        id: "get_str_var",
        return: "string",
        detail: "获取变量 ",
        params: [
            {
                type: "string",
                default: "name"
            }
        ],
        desc: "获取string变量${0}"
    },

    // {
    //     id: "int",
    //     return: "int",
    //     sort: -1,
    //     render_create: function (params, element_id) {
    //         return "<input id='" + element_id + "' class='input'  type='number'></input>"
    //     },
    //     render_desc: function (params) {
    //         return params[0] + ""
    //     }


    // },
]