# 🚀 中式色彩探索 - 快速开始指南

## 📋 **三步启动**

### 第一步：启动 Milvus 数据库

```bash
# 进入 Milvus 目录
cd external/milvus

# 启动 Milvus 服务
docker-compose up -d

# 验证服务状态
docker-compose ps
```

### 第二步：导入传统色彩数据

```bash
# 配置 NVIDIA API 密钥 (必需)，下面二选一
1. export NVIDIA_API_KEY="your_nvidia_api_key_here" 或者
2. 进入到 external/milnus目录下，编辑 .env.example 文件，将NVIDIA_API_KEY的默认值修改为实际的NVIDIA_API_KEY，然后运行cp .env.example .env

# 创建Python虚拟环境(Python版本：Python3.12.11)
python3.12 -m venv external/milvus/.venv

# 激活虚拟环境
source external/milvus/.venv/bin/activate

# 安装依赖
pip install -r external/milvus/requirements.txt

# 运行数据导入脚本
python external/milvus/load_chinese_colors.py
```

### 第三步：启动项目

```bash
# 返回项目根目录
cd hackathon_aiqtoolkit

# 运行启动脚本
./start.sh
```

### 🌐 **访问应用**

打开浏览器访问: **http://localhost:3000**

---

## 🎯 **快速体验**

尝试询问这些传统颜色，体验智能主题切换：

- **"胭脂色是什么颜色？"** → 🔴 红色主题
- **"翡翠色的文化含义"** → 🟢 绿色主题  
- **"蔚蓝色的历史背景"** → 🔵 蓝色主题
- **"金色在古代的象征"** → 🟡 黄色主题
- **"紫色的文化内涵"** → 🟣 紫色主题

---

## ❓ **遇到问题？**

### 🔧 **常见解决方案**

**Milvus 连接失败**:
```bash
docker-compose restart
```

**API 密钥错误**:
```bash
# 获取密钥: https://ngc.nvidia.com/
export NVIDIA_API_KEY="nvapi-xxxxxxxxx"
```

**前端启动失败**:
```bash
cd external/aiqtoolkit-opensource-ui
npm install
npm run dev
```

---

## 🎨 **开始探索传统色彩之美！**

**🌈 162种传统颜色 × 敦煌壁画背景 × AI智能对话 = 独特的文化科技体验** ✨
