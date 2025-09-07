# 🎨 中式色彩探索 - 使用指南

<div align="center">

![Project Banner](https://img.shields.io/badge/中式色彩探索-传统文化×AI技术-red?style=for-the-badge)

[![React](https://img.shields.io/badge/React-18.0+-61DAFB?style=flat-square&logo=react)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Milvus](https://img.shields.io/badge/Milvus-2.6+-00D4AA?style=flat-square)](https://milvus.io/)
[![NVIDIA](https://img.shields.io/badge/NVIDIA_AI-Embeddings-76B900?style=flat-square&logo=nvidia)](https://www.nvidia.com/)

**🌟 让千年传统色彩在人工智能时代重新绽放光彩 🌟**

</div>

---

## 📋 **项目简介**

**中式色彩探索**是一个创新的文化科技融合项目，通过AI对话的方式让用户探索中国传统色彩文化。项目收录了162种传统颜色，每种颜色都承载着深厚的历史底蕴和诗词典故。

### ✨ **核心特色**

- 🎯 **智能主题切换**: 根据用户询问的颜色自动切换界面主题
- 🎨 **敦煌壁画背景**: 对应颜色的敦煌壁画图案动态背景
- 📝 **Markdown渲染**: AI响应支持完整的Markdown格式
- 👤 **精美头像系统**: 中式设计的用户和助手头像
- 🔄 **完整对话管理**: 新建、切换、保存多个对话
- 🌈 **162种传统颜色**: 涵盖9大色系的完整传统色彩体系

---

## 🚀 **快速开始**

### 📋 **环境要求**

- **Python**: 3.8+
- **Node.js**: 16+
- **Docker**: 最新版本 (用于运行 Milvus)
- **操作系统**: Windows 10+/macOS 10.15+/Ubuntu 20.04+

### 🛠️ **安装步骤**

#### 第一步：安装 Milvus 向量数据库

> **重要**: Milvus 是项目的核心依赖，用于存储和检索传统色彩数据

```bash
# 进入 Milvus 目录
cd external/milvus

# 启动 Milvus 服务 (使用 Docker Compose)
docker-compose up -d

# 验证 Milvus 服务状态
docker-compose ps
```

**预期输出**:
```
NAME                COMMAND                  SERVICE             STATUS              PORTS
milvus-etcd         etcd -advertise-clie...  etcd                running             2379-2380/tcp
milvus-minio        /usr/bin/docker-entr...  minio               running             9000/tcp
milvus-standalone   /tini -- milvus run ...  standalone          running             0.0.0.0:19530->19530/tcp
```

#### 第二步：配置环境变量

```bash
# 复制环境变量模板
cp external/milvus/.env.example external/milvus/.env

# 编辑环境变量文件
nano external/milvus/.env
```

**配置内容**:
```env
# NVIDIA API 配置 (必需)
NVIDIA_API_KEY=your_nvidia_api_key_here

# Milvus 配置 (可选，使用默认值)
MILVUS_URI=http://127.0.0.1:19530
MILVUS_COLLECTION_NAME=chinese_traditional_colors

# 嵌入模型配置 (可选，使用默认值)
NVIDIA_EMBEDDING_MODEL=nvidia/nv-embedqa-e5-v5
EMBEDDING_DIMENSION=1024
```

> **获取 NVIDIA API 密钥**: 访问 [NVIDIA NGC](https://build.nvidia.com/explore/discover) 注册并获取免费 API 密钥

#### 第三步：导入传统色彩数据

```bash
# 运行数据导入脚本
python external/milvus/load_chinese_colors.py
```

**预期输出**:
```
🎨 开始加载中国传统颜色数据到 Milvus...
📚 成功加载 162 种传统颜色数据
🔧 配置 NVIDIA 嵌入模型: nvidia/nv-embedqa-e5-v5
🗄️  配置 Milvus 向量存储: http://127.0.0.1:19530
📊 开始创建向量索引...
✅ 数据导入完成！共导入 162 条颜色记录
🎉 中式色彩探索数据库准备就绪！
```

#### 第四步：启动项目

```bash
# 返回项目根目录
cd hackathon_aiqtoolkit

# 运行启动脚本
./start.sh
```

**启动脚本会自动**:
- 安装前端依赖
- 启动开发服务器
- 配置环境变量
- 初始化应用

#### 第五步：访问应用

打开浏览器访问: **http://localhost:3000**

---

## 🎯 **使用方法**

### 🌈 **体验智能主题切换**

尝试询问不同的传统颜色，界面会自动切换主题：

```
用户输入: "胭脂色是什么颜色？"
界面效果: 🔴 自动切换为红色主题，显示凤凰和宝相花背景

用户输入: "翡翠色的文化含义"
界面效果: 🟢 自动切换为绿色主题，显示莲花和飞天背景

用户输入: "蔚蓝色的历史背景"
界面效果: 🔵 自动切换为蓝色主题，显示云纹和几何背景
```

### 📝 **Markdown 格式响应**

AI 会以丰富的 Markdown 格式回答您的问题：

```markdown
# 胭脂色 (#9d2933)

胭脂色是中国传统红色系中的**经典颜色**。

## 基本信息
- **HEX值**: `#9d2933`
- **RGB值**: `157, 41, 51`
- **色系**: 红色系

## 文化内涵
> "红豆生南国，春来发几枝。愿君多采撷，此物最相思。"
> —— 王维《相思》

### 历史渊源
1. 起源于古代女子化妆用的胭脂
2. 逐渐成为传统色彩体系的重要组成
3. 广泛应用于服饰、建筑、艺术等领域
```

### 🔄 **对话管理**

- **新建对话**: 点击左上角"新建对话"按钮
- **切换对话**: 使用对话选择器在多个对话间切换
- **自动保存**: 所有对话内容自动保存到本地

### 🎨 **主题切换**

- **自动切换**: 询问颜色时自动切换主题
- **手动切换**: 点击右上角的色彩圆点手动切换
- **9大色系**: 红、绿、蓝、黄、紫、白、黑、金银、苍色

---

## 🔧 **故障排除**

### ❌ **常见问题**

#### 1. **Milvus 连接失败**
```bash
# 检查 Milvus 服务状态
docker-compose ps

# 重启 Milvus 服务
docker-compose restart

# 查看日志
docker-compose logs
```

#### 2. **NVIDIA API 密钥错误**
```bash
# 检查环境变量
echo $NVIDIA_API_KEY

# 重新设置 API 密钥
export NVIDIA_API_KEY="your_api_key_here"
```

#### 3. **数据导入失败**
```bash
# 清理并重新导入
python external/milvus/load_chinese_colors.py --reset

# 检查数据库连接
python -c "
from pymilvus import connections
connections.connect('default', host='127.0.0.1', port='19530')
print('✅ Milvus 连接成功')
"
```

#### 4. **前端启动失败**
```bash
# 清理依赖并重新安装
cd external/aiqtoolkit-opensource-ui
rm -rf node_modules package-lock.json
npm install

# 重新启动
npm run dev
```

### 🆘 **获取帮助**

如果遇到问题，请：

1. **查看日志**: 检查控制台输出的错误信息
2. **检查环境**: 确认所有依赖服务正常运行
3. **重启服务**: 尝试重启 Milvus 和前端服务
4. **联系支持**: 提供详细的错误信息和环境配置

---

## 🎉 **开始探索**

现在您可以开始探索中国传统色彩的魅力了！

### 🌟 **推荐体验**

1. **询问经典颜色**: "朱砂色"、"孔雀蓝"、"藕荷色"
2. **了解文化背景**: "这个颜色在古代有什么寓意？"
3. **探索诗词典故**: "有哪些诗词描述了这个颜色？"
4. **对比不同颜色**: "胭脂色和朱红色有什么区别？"

### 🎨 **特色功能**

- **动态背景**: 每种颜色都有对应的敦煌壁画图案
- **文化深度**: 每种颜色都有详细的历史文化介绍
- **视觉美感**: 精美的中式设计和动画效果
- **智能交互**: 基于AI的自然语言对话

**🌈 让我们一起在数字时代重新发现传统色彩的美丽！** 🎨✨

---

*© 2025 中式色彩探索项目组. 传统文化与现代技术的完美融合.*
