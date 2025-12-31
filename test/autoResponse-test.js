// 测试autoResponse方法的优化效果

// 模拟func.ajax函数
const func = {
    ajax: (ctx, code, info, data) => {
        console.log(`Response: { code: ${code}, info: '${info}', data: ${JSON.stringify(data)} }`);
    }
};

// 模拟Bootstrap类的autoResponse方法
class MockBootstrap {
    constructor() {
        this.settingCnf = {
            autoResponse: {
                enable: true,
                success: { code: 1, info: 'ok' },
                error: { code: 0, info: 'fail' }
            }
        };
    }

    // 优化后的autoResponse方法
    autoResponse(ctx, data) {
        if(data && this.settingCnf.autoResponse.enable) {
            const hasContent = typeof data !== 'object' ? true : Array.isArray(data) ? data.length : Object.keys(data).length;
            func.ajax(ctx, hasContent ? this.settingCnf.autoResponse.success.code : this.settingCnf.autoResponse.error.code, hasContent ? this.settingCnf.autoResponse.success.info : this.settingCnf.autoResponse.error.info, hasContent ? data : undefined);
        }
    }
}

// 测试不同数据类型
function testAutoResponse() {
    console.log('=== 测试autoResponse方法 ===');
    const bootstrap = new MockBootstrap();
    
    // 测试用例
    const testCases = [
        { name: '空数组', data: [] },
        { name: '非空数组', data: [1, 2, 3] },
        { name: '空对象', data: {} },
        { name: '非空对象', data: { key: 'value' } },
        { name: '空字符串', data: '' },
        { name: '非空字符串', data: 'hello' },
        { name: '数字0', data: 0 },
        { name: '数字1', data: 1 },
        { name: '布尔值false', data: false },
        { name: '布尔值true', data: true },
        { name: 'null', data: null },
        { name: 'undefined', data: undefined }
    ];
    
    testCases.forEach(testCase => {
        console.log(`\n测试: ${testCase.name}`);
        console.log(`输入: ${JSON.stringify(testCase.data)}`);
        bootstrap.autoResponse({}, testCase.data);
    });
    
    console.log('\n=== 测试完成 ===');
}

// 运行测试
testAutoResponse();