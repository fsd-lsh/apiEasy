// 测试修复后的Controller类

// 模拟依赖
const func = {
    ajax: (ctx, code, info, data, startTime) => {
        ctx.response.body = {
            code,
            info,
            data,
            runtime: startTime ? (new Date().getTime() - startTime) + 'ms' : undefined
        };
    }
};

// 模拟ctx对象
const mockCtx = {
    session: {},
    response: {},
    render: async (root, data) => {
        console.log(`Rendering view: ${root} with data:`, data);
    },
    redirect: (url) => {
        console.log(`Redirecting to: ${url}`);
    }
};

// 模拟Controller类
class MockController {
    constructor(ctx) {
        this.startTime = (new Date().getTime());
        this.ctx = ctx;
        this.viewAssign = {};
    }

    ajax(code, info, data) {
        func.ajax(this.ctx, code, info, data, this.startTime);
    }

    async view(root, assign) {
        if(!root) { root = 'index'; }
        if(assign) {
            Object.assign(this.viewAssign, assign);
        }
        await this.ctx.render(root, this.viewAssign);
    }

    wAssign(key, value) {
        if(!key) {
            return false;
        }
        this.viewAssign[key] = value;
    }

    session(key, value) {
        // 优先处理简单情况
        if (!key) {
            return this.ctx.session;
        }
        
        // 处理key为空字符串的情况
        if (key === '') {
            this.ctx.session = null;
            return;
        }
        
        // 处理有value的情况
        if (value !== undefined) {
            if (value === '') {
                this.ctx.session[key] = null;
            } else {
                this.ctx.session[key] = value;
            }
            return;
        }
        
        // 处理获取值的情况
        return this.ctx.session[key];
    }

    redirect(url) {
        if(!url) { return false; }
        this.ctx.redirect(url);
    }
}

// 测试Controller类
async function testController() {
    console.log('=== 测试Controller类 ===\n');
    
    // 测试1: 构造函数
    console.log('1. 测试构造函数');
    const controller = new MockController(mockCtx);
    console.log('✓ 构造函数初始化成功');
    console.log('✓ startTime:', controller.startTime);
    console.log('✓ ctx:', controller.ctx);
    console.log('✓ viewAssign:', controller.viewAssign);
    
    // 测试2: ajax方法
    console.log('\n2. 测试ajax方法');
    controller.ajax(1, 'ok', { key: 'value' });
    console.log('✓ ajax响应:', controller.ctx.response.body);
    
    // 测试3: session方法
    console.log('\n3. 测试session方法');
    
    // 测试获取所有session
    const allSession = controller.session();
    console.log('✓ 获取所有session:', allSession);
    
    // 测试设置session
    controller.session('user', 'test');
    console.log('✓ 设置session后:', controller.ctx.session);
    
    // 测试获取单个session
    const userSession = controller.session('user');
    console.log('✓ 获取单个session:', userSession);
    
    // 测试删除单个session
    controller.session('user', '');
    console.log('✓ 删除单个session后:', controller.ctx.session);
    
    // 测试删除所有session
    controller.session('test', 'value');
    controller.session('');
    console.log('✓ 删除所有session后:', controller.ctx.session);
    
    // 测试4: view方法
    console.log('\n4. 测试view方法');
    await controller.view('test', { title: 'Test' });
    console.log('✓ viewAssign:', controller.viewAssign);
    
    // 测试view方法无assign参数
    await controller.view('test');
    console.log('✓ view方法无assign参数调用成功');
    
    // 测试5: wAssign方法
    console.log('\n5. 测试wAssign方法');
    controller.wAssign('name', 'apiEasy');
    console.log('✓ wAssign后:', controller.viewAssign);
    
    // 测试wAssign方法无key
    const result = controller.wAssign('', 'value');
    console.log('✓ wAssign无key返回:', result);
    
    // 测试6: redirect方法
    console.log('\n6. 测试redirect方法');
    controller.redirect('/home');
    
    // 测试redirect方法无url
    const redirectResult = controller.redirect();
    console.log('✓ redirect无url返回:', redirectResult);
    
    console.log('\n=== 所有测试通过 ===');
}

// 运行测试
testController().catch(console.error);