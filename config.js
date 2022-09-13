/**@type {[{id,name,kind,create_desc,render_desc:[string],desc,params,return,render:Function}]} */
var config = [
    {
        id: "root",
        name: "root",
        kind: "nodelist",
        render_desc: [
            "${node,node}",
            "${inster,node,双击插入}"
        ],
        render: function () {
            return "<a href=\'javascript:void(0)\'  onlick=''>---insert---</a>"
        },
        render_create: function (params, element_id) {

        },
        return: "void",

    },


    {
        id: "nodelist",
        kind: "nodelist",
        render_desc: [
            "${node,node}",
            "${inster,node,双击插入}"
        ],
        render: function (params, element_id) {
            return [
                "<a href=\'javascript:void(0)\'  onclick='append(this," + element_id + ",\"node\")'>-------------</a>"
            ]
        }
    },

    {
        id: "for",
        name: "循环",
        kind: "node",
        render_desc: [
            "循环 从 ${0} 到 ${1}",
            "\t${node node}"
        ],
        render_create: function (params, element_id) {
            return "循环<a href=\'javascript:void(0)\'  onclick=\"appendParam(this," + element_id + ",\'int\')\">" + (params[0] == null ? "A" : params[0].render_desc(element_id)) + "</a>次"
        }
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
        kind: "node",
        create_desc: [
            "设置整型变量 ${0,string} 为 ${1 int}"
        ],
    },

    {
        id: "get_int_var",
        return: "int",
        render_create: function (params, element_id) {
            return "获取<a href=\'javascript:void(0)\'  onclick=\"appendParam(this," + element_id + ",\'string\')\">name</a>整型变量"
        }
    },


    {
        id: "int",
        return: "int",
        sort: -1,
        render_create: function (params, element_id) {
            return "<input id='" + element_id + "' class='input'  type='number'></input>"
        },
        render_desc: function (params) {
            return params[0] + ""
        }


    },
]