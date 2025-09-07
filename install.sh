#!/bin/bash

# NVIDIA NeMo Agent Toolkit AI对话机器人 - 一键安装脚本
# 支持 Linux/macOS/Windows(WSL)

set -e

echo "🚀 NVIDIA NeMo Agent Toolkit AI对话机器人 - 一键安装"
echo "=================================================="

# 检测操作系统
detect_os() {
    if [[ "$OSTYPE" == "linux-gnu"* ]]; then
        echo "检测到操作系统: Linux"
        OS="linux"
    elif [[ "$OSTYPE" == "darwin"* ]]; then
        echo "检测到操作系统: macOS"
        OS="macos"
    elif [[ "$OSTYPE" == "msys" ]] || [[ "$OSTYPE" == "cygwin" ]]; then
        echo "检测到操作系统: Windows"
        OS="windows"
    else
        echo "⚠️  未知操作系统: $OSTYPE"
        echo "请在 Linux、macOS 或 Windows WSL 环境中运行此脚本"
        exit 1
    fi
}

# 检查必要工具
check_requirements() {
    echo "📋 检查系统要求..."
    
    # 检查Python
    if ! command -v python3 &> /dev/null; then
        echo "❌ Python 3 未安装"
        echo "请先安装 Python 3.12 或更高版本"
        exit 1
    fi
    
    python_version=$(python3 --version | cut -d' ' -f2 | cut -d'.' -f1-2)
    echo "✅ Python 版本: $python_version"
    
    # 检查Node.js
    if ! command -v node &> /dev/null; then
        echo "❌ Node.js 未安装"
        echo "请先安装 Node.js 18 或更高版本"
        exit 1
    fi
    
    node_version=$(node --version)
    echo "✅ Node.js 版本: $node_version"
    
    # 检查Git
    if ! command -v git &> /dev/null; then
        echo "❌ Git 未安装"
        echo "请先安装 Git"
        exit 1
    fi
    
    echo "✅ Git 已安装"
}

# 安装uv包管理器
install_uv() {
    echo "📦 安装 uv 包管理器..."
    
    if ! command -v uv &> /dev/null; then
        echo "正在下载并安装 uv..."
        curl -LsSf https://astral.sh/uv/install.sh | sh
        
        # 添加到PATH
        export PATH="$HOME/.local/bin:$PATH"
        
        if ! command -v uv &> /dev/null; then
            echo "❌ uv 安装失败"
            exit 1
        fi
    fi
    
    echo "✅ uv 包管理器已安装"
}

# 克隆和设置项目
setup_project() {
    echo "📥 设置项目..."
    
    # 如果目录不存在，克隆项目
    if [ ! -d "NeMo-Agent-Toolkit" ]; then
        echo "正在克隆 NVIDIA NeMo Agent Toolkit..."
        git clone https://github.com/NVIDIA/NeMo-Agent-Toolkit.git
        cd NeMo-Agent-Toolkit
        
        echo "正在初始化子模块..."
        git submodule update --init --recursive
    else
        echo "项目目录已存在，进入目录..."
        cd NeMo-Agent-Toolkit
    fi
    
    # 创建Python虚拟环境
    echo "正在创建Python虚拟环境..."
    uv venv --seed .venv --python 3.12
    
    # 激活虚拟环境并安装依赖
    echo "正在安装Python依赖..."
    source .venv/bin/activate
    uv pip install -e .
    uv pip install -e '.[langchain]'
    uv pip install tavily-python
    
    echo "✅ 后端依赖安装完成"
}

# 设置前端
setup_frontend() {
    echo "🎨 设置前端..."
    
    cd external/aiqtoolkit-opensource-ui
    
    echo "正在安装前端依赖..."
    npm install
    
    echo "✅ 前端依赖安装完成"
    cd ../..
}

# 创建配置文件
create_config() {
    echo "⚙️  创建配置文件..."
    
    mkdir -p configs
    
    cat > configs/hackathon_config.yml << 'EOF'
# NVIDIA NeMo Agent Toolkit 黑客松配置
# 支持用户自定义OpenAI兼容API

general:
  use_uvloop: true

functions:
  tavily_search:
    _type: tavily_internet_search
    description: "使用Tavily API进行实时网络搜索"
  
  current_datetime:
    _type: current_datetime
    description: "获取当前日期和时间"

llms:
  # 默认使用Bailian API (用户可修改)
  default_llm:
    _type: openai
    model_name: "qwen-plus"
    api_key: "Your API Key"
    base_url: "https://dashscope.aliyuncs.com/compatible-mode/v1"
    temperature: 0.7
    max_tokens: 2048

workflow:
  _type: react_agent
  tool_names:
    - tavily_search
    - current_datetime
  llm_name: default_llm
  verbose: true
  parse_agent_response_max_retries: 3
  max_iterations: 10
EOF
    
    echo "✅ 配置文件创建完成"
}

# 创建启动脚本
create_scripts() {
    echo "📝 创建启动脚本..."
    
    # 创建启动脚本
    cat > start.sh << 'EOF'
#!/bin/bash

echo "🚀 启动 NVIDIA NeMo Agent Toolkit AI对话机器人"
echo "=============================================="

# 设置环境变量
export TAVILY_API_KEY=Your API Key

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
cd external/aiqtoolkit-opensource-ui
npm run dev &
FRONTEND_PID=$!

echo ""
echo "✅ 系统启动完成！"
echo ""
echo "🌐 访问地址:"
echo "   前端界面: http://localhost:3000"
echo "   API文档:  http://localhost:8001/docs"
echo ""
echo "📝 测试建议:"
echo "   1. 天气查询: '北京今天的天气怎么样，气温是多少？'"
echo "   2. 公司信息: '帮我介绍一下NVIDIA Agent Intelligence Toolkit'"
echo "   3. 时间查询: '现在几点了？'"
echo ""
echo "🛑 停止服务: 按 Ctrl+C 或运行 ./stop.sh"
echo ""

# 保存进程ID
echo $BACKEND_PID > .backend.pid
echo $FRONTEND_PID > .frontend.pid

# 等待用户中断
wait
EOF

    # 创建停止脚本
    cat > stop.sh << 'EOF'
#!/bin/bash

echo "🛑 停止 NVIDIA NeMo Agent Toolkit AI对话机器人"
echo "=============================================="

# 停止后端服务
if [ -f .backend.pid ]; then
    BACKEND_PID=$(cat .backend.pid)
    if ps -p $BACKEND_PID > /dev/null; then
        echo "停止后端服务 (PID: $BACKEND_PID)..."
        kill $BACKEND_PID
    fi
    rm -f .backend.pid
fi

# 停止前端服务
if [ -f .frontend.pid ]; then
    FRONTEND_PID=$(cat .frontend.pid)
    if ps -p $FRONTEND_PID > /dev/null; then
        echo "停止前端服务 (PID: $FRONTEND_PID)..."
        kill $FRONTEND_PID
    fi
    rm -f .frontend.pid
fi

# 清理其他相关进程
pkill -f "aiq serve" 2>/dev/null || true
pkill -f "next dev" 2>/dev/null || true

echo "✅ 所有服务已停止"
EOF

    # 添加执行权限
    chmod +x start.sh stop.sh
    
    echo "✅ 启动脚本创建完成"
}

# 主安装流程
main() {
    detect_os
    check_requirements
    install_uv
    setup_project
    setup_frontend
    create_config
    create_scripts
    
    echo ""
    echo "🎉 安装完成！"
    echo "=============="
    echo ""
    echo "📁 项目目录: $(pwd)"
    echo ""
    echo "🚀 快速启动:"
    echo "   ./start.sh"
    echo ""
    echo "🛑 停止服务:"
    echo "   ./stop.sh"
    echo ""
    echo "⚙️  自定义配置:"
    echo "   编辑 configs/hackathon_config.yml 文件"
    echo "   可修改 API密钥、模型名称、base_url 等"
    echo ""
    echo "📚 更多信息:"
    echo "   https://github.com/NVIDIA/NeMo-Agent-Toolkit"
    echo ""
}

# 运行主函数
main "$@"

