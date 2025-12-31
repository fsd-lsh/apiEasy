// 测试修复后的precompileRoute方法

// 模拟precompileRoute方法（与bootstrap.js中完全相同）
function precompileRoute(routePath, method = 'all') {
    // 处理根路径情况
    if (routePath === '/') {
        return {
            controllerPath: '/index',
            className: 'index',
            funcName: 'index'
        };
    }
    
    // 移除末尾的斜杠
    const normalizedPath = routePath.replace(/\/$/, '');
    const segments = normalizedPath.split('/').filter(Boolean);
    
    let controllerPath, className, funcName;
    
    // 特殊处理：直接匹配路由配置中的路径
    // 对于 /rpc_demo/go/hi，控制器路径是 /rpc_demo/go，类名是 go，方法名是 hi
    // 对于 /rpc_demo/go，控制器路径是 /rpc_demo/go，类名是 go，方法名是 index
    
    if (segments.length === 3) {
        // 三级路径：/a/b/c -> 控制器路径 /a/b，类名 b，方法名 c
        controllerPath = `/${segments[0]}/${segments[1]}`;
        className = segments[1];
        funcName = method === 'all' ? segments[2] : method;
    } else if (segments.length === 2) {
        // 二级路径：/a/b -> 控制器路径 /a/b，类名 b，方法名 index
        controllerPath = `/${segments[0]}/${segments[1]}`;
        className = segments[1];
        funcName = method === 'all' ? 'index' : method;
    } else if (segments.length === 1) {
        // 一级路径：/a -> 控制器路径 /a，类名 a，方法名 index
        controllerPath = `/${segments[0]}`;
        className = segments[0];
        funcName = method === 'all' ? 'index' : method;
    } else {
        // 其他情况，默认返回index
        return {
            controllerPath: '/index',
            className: 'index',
            funcName: 'index'
        };
    }
    
    return {
        controllerPath,
        className,
        funcName
    };
}

// 测试用例
function testPrecompileRoute() {
    console.log('=== 测试precompileRoute方法 ===');
    
    const testCases = [
        { route: '/', expected: { controllerPath: '/index', className: 'index', funcName: 'index' } },
        { route: '/rpc_demo/go/hi', expected: { controllerPath: '/rpc_demo/go', className: 'go', funcName: 'hi' } },
        { route: '/rpc_demo/go', expected: { controllerPath: '/rpc_demo/go', className: 'go', funcName: 'index' } },
        { route: '/restful_demo/go', expected: { controllerPath: '/restful_demo/go', className: 'go', funcName: 'index' } }
    ];
    
    let allPassed = true;
    
    testCases.forEach((testCase, index) => {
        const result = precompileRoute(testCase.route);
        
        // 打印详细信息，不只是比较JSON
        console.log(`\n测试 ${index + 1}: ${testCase.route}`);
        console.log(`预期:`);
        console.log(`  controllerPath: ${testCase.expected.controllerPath}`);
        console.log(`  className: ${testCase.expected.className}`);
        console.log(`  funcName: ${testCase.expected.funcName}`);
        console.log(`实际:`);
        console.log(`  controllerPath: ${result.controllerPath}`);
        console.log(`  className: ${result.className}`);
        console.log(`  funcName: ${result.funcName}`);
        
        // 检查结果是否符合预期
        const passed = result.controllerPath === testCase.expected.controllerPath && 
                      result.className === testCase.expected.className && 
                      result.funcName === testCase.expected.funcName;
        
        console.log(`结果: ${passed ? '✓ 成功' : '✗ 失败'}`);
        
        if (!passed) {
            allPassed = false;
        }
    });
    
    console.log(`\n=== 测试 ${allPassed ? '通过' : '失败'} ===`);
    return allPassed;
}

// 运行测试
testPrecompileRoute();