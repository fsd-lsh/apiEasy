export default {
    ajax: (ctx, code, info, data) => {
        ctx.body = {
            code: Number(code),
            info: info ? info : '',
            data: data ? data : [],
        }
    },
}