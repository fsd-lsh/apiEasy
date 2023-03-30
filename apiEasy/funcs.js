export default {

    ajax(ctx, code, info, data) {
        let body = {
            code: Number(code),
            info: info ? info : '',
        }
        if(data.length) {
            body.data = data;
        }
        ctx.body = body;
        if(global.settingCnf.debug) {
            Object.assign(ctx.body, {
                runtime: (new Date().getTime()) - (global['apiEasy']) + 'ms',
            });
        }
    },

    projectFlag() {
        let temp = process.argv[1].slice(0, process.argv[1].lastIndexOf('/'));
        return temp.slice(temp.lastIndexOf('/')+1, process.argv[1].lastIndexOf('/'))
    },
}