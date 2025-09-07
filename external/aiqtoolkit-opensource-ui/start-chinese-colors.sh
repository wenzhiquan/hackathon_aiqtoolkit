#!/bin/bash

# 中式色彩探索启动脚本
echo "🎨 启动中式色彩探索应用..."

# 检查 Node.js 是否安装
if ! command -v node &> /dev/null; then
    echo "❌ Node.js 未安装，请先安装 Node.js"
    exit 1
fi

# 检查 npm 是否安装
if ! command -v npm &> /dev/null; then
    echo "❌ npm 未安装，请先安装 npm"
    exit 1
fi

# 安装依赖
echo "📦 安装依赖包..."
npm install

# 检查是否安装成功
if [ $? -ne 0 ]; then
    echo "❌ 依赖安装失败"
    exit 1
fi

echo "✅ 依赖安装完成"

# 启动开发服务器
echo "🚀 启动开发服务器..."
echo "🌈 中式色彩探索应用将在 http://localhost:3000 启动"
echo "📚 功能特性："
echo "   • 与AI对话探索中国传统颜色"
echo "   • 动态主题切换"
echo "   • 中式设计风格"
echo "   • 文化内涵展示"
echo ""
echo "💡 试试问AI："
echo "   • 胭脂色是什么颜色？"
echo "   • 红色系的传统颜色有哪些？"
echo "   • 翡翠色的文化含义"
echo ""

npm run dev
