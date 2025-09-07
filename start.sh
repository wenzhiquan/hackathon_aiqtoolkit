#!/bin/bash

echo "🎨 启动中式色彩探索 - 传统文化与AI技术的完美融合"
echo "=================================================="

# 设置环境变量
export TAVILY_API_KEY=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

# 激活Python虚拟环境
source .venv/bin/activate

# 启动后端服务
echo "📡 启动后端服务..."
aiq serve --config_file configs/hackathon_config.yml --host 0.0.0.0 --port 8001 &
BACKEND_PID=$!

# 等待后端启动
echo "⏳ 等待后端服务启动..."
sleep 10

# 启动前端服务
echo "🎨 启动前端服务..."
cd /Users/elvin.wen/local/hackathon_aiqtoolkit/external/aiqtoolkit-opensource-ui
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 系统启动完成！"
echo ""
echo "🌐 访问地址:"
echo "   前端界面: http://localhost:3000"
echo "   API文档:  http://localhost:8001/docs"
echo ""
echo "🎨 中式色彩探索体验:"
echo "   1. 智能主题切换: '胭脂色是什么颜色？' → 🔴 红色主题"
echo "   2. 文化探索: '翡翠色的文化含义' → 🟢 绿色主题"
echo "   3. 诗词典故: '蔚蓝色的历史背景' → 🔵 蓝色主题"
echo "   4. 颜色对比: '朱红色和胭脂色有什么区别？'"
echo "   5. 敦煌背景: 每种颜色都有对应的敦煌壁画图案"
echo ""
echo "📝 其他功能:"
echo "   1. 天气查询: '北京今天的天气怎么样？'"
echo "   2. 时间查询: '现在几点了？'"
echo "   3. 通用对话: 支持各种AI对话功能"
echo ""
echo "🛑 停止服务: 按 Ctrl+C 或运行 ./stop.sh"
echo ""

# 保存进程ID
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
wait
