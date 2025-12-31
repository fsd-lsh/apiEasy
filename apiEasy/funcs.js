export default {

    ajax(ctx, code, info, data, startTime) {
        let body = { 
            code: Number(code),
            info: info ? info : '',
        }
        if(data && data[0] !== '') {
            body.data = data;
        }
        ctx.body = body;
        if(global.settingCnf.debug && startTime) {
            Object.assign(ctx.body, {
                runtime: (new Date().getTime()) - startTime + 'ms',
            });
        }
    },

    projectFlag() {
        let temp = process.argv[1].slice(0, process.argv[1].lastIndexOf('/'));
        return temp.slice(temp.lastIndexOf('/')+1, process.argv[1].lastIndexOf('/'))
    },

    urlParse(url) {
        if(url.indexOf('?') !== -1) {
            return url.slice(0, url.indexOf('?'));
        }else {
            return url;
        }
    }
}