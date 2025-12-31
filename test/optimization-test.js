// 简单的测试脚本，验证优化逻辑

// 模拟控制器缓存机制测试
class MockBootstrap {
    constructor() {
        this.controllerCache = new Map();
    }

    // 模拟getController方法
    async getController(controllerPath) {
        console.log(`Requesting controller: ${controllerPath}`);
        if (this.controllerCache.has(controllerPath)) {
            console.log(`Cache hit for: ${controllerPath}`);
            return this.controllerCache.get(controllerPath);
        }
        console.log(`Cache miss for: ${controllerPath}, loading...`);
        // 模拟异步加载
        const controller = { name: `Controller_${controllerPath}` };
        this.controllerCache.set(controllerPath, controller);
        return controller;
    }

    // 模拟precompileRoute方法
    precompileRoute(routePath, method = 'all') {
        const urlPath = routePath === '/' ? '/index' : routePath;
        let controllerPath = urlPath.slice(0, urlPath.lastIndexOf('/'));
        let className = urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length);
        let funcName = method === 'all' ? urlPath.slice(urlPath.lastIndexOf('/')+1, urlPath.length) : method;
        
        if (!controllerPath) controllerPath = '/index';
        if (!className) className = 'index';
        if (!funcName || funcName === '/') funcName = 'index';
        
        return {
            controllerPath,
            className,
            funcName
        };
    }
}

// 测试缓存机制
async function testControllerCache() {
    console.log('=== 测试控制器缓存机制 ===');
    const bootstrap = new MockBootstrap();
    
    // 第一次请求，应该缓存miss
    const controller1 = await bootstrap.getController('/index');
    
    // 第二次请求，应该缓存hit
    const controller2 = await bootstrap.getController('/index');
    
    // 第三次请求不同的控制器
    const controller3 = await bootstrap.getController('/rpc_demo');
    
    console.log('Controller 1:', controller1.name);
    console.log('Controller 2:', controller2.name);
    console.log('Controller 3:', controller3.name);
    console.log('Cache size:', bootstrap.controllerCache.size);
    console.log('=== 缓存测试完成 ===\n');
}

// 测试路由预编译
function testRoutePrecompile() {
    console.log('=== 测试路由预编译 ===');
    const bootstrap = new MockBootstrap();
    
    const routes = [
        '/',
        '/rpc_demo/go/hi',
        '/restful_demo/go'
    ];
    
    for (const route of routes) {
        const rpcInfo = bootstrap.precompileRoute(route, 'all');
        const getInfo = bootstrap.precompileRoute(route, 'get');
        console.log(`Route: ${route}`);
        console.log('  RPC:', rpcInfo);
        console.log('  GET:', getInfo);
    }
    
    console.log('=== 路由预编译测试完成 ===');
}

// 运行测试
async function runTests() {
    await testControllerCache();
    testRoutePrecompile();
}

runTests().catch(console.error);