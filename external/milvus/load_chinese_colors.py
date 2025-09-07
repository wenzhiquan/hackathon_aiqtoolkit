#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""
中国传统颜色数据导入 Milvus 脚本
将中国传统颜色信息导入到 Milvus 向量数据库中
"""

import os
import sys
import json
from llama_index.core import SimpleDirectoryReader, Document
from langchain_nvidia_ai_endpoints import NVIDIAEmbeddings
from dotenv import load_dotenv
from llama_index.core import Settings
from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.vector_stores.milvus import MilvusVectorStore
from llama_index.core.node_parser import TokenTextSplitter

load_dotenv()

# 从环境变量获取配置
nvidia_api_key = os.getenv("NVIDIA_API_KEY")
if not nvidia_api_key:
    raise ValueError("""
    请设置 NVIDIA_API_KEY 环境变量！

    方法1: 在 external/milvus/.env 文件中设置
    NVIDIA_API_KEY=your_api_key_here

    方法2: 在命令行中设置
    export NVIDIA_API_KEY=your_api_key_here

    方法3: 在运行脚本时设置
    NVIDIA_API_KEY=your_api_key_here python load_chinese_colors.py
    """)

os.environ["NVIDIA_API_KEY"] = nvidia_api_key

# 其他配置参数
MILVUS_URI = os.getenv("MILVUS_URI", "http://127.0.0.1:19530")
COLLECTION_NAME = os.getenv("MILVUS_COLLECTION_NAME", "chinese_traditional_colors")
EMBEDDING_MODEL = os.getenv("NVIDIA_EMBEDDING_MODEL", "nvidia/nv-embedqa-e5-v5")
EMBEDDING_DIMENSION = int(os.getenv("EMBEDDING_DIMENSION", "1024"))

def load_chinese_colors_data():
    """加载完整的中国传统颜色数据"""
    color_data = [
        {
            "name": "红色系",
            "poetry": [
                {"content": "红豆生南国，春来发几枝", "author": "王维", "title": "相思"},
                {"content": "千里莺啼绿映红，水村山郭酒旗风", "author": "杜牧", "title": "江南春"},
                {"content": "红酥手，黄縢酒，满城春色宫墙柳", "author": "陆游", "title": "钗头凤"}
            ],
            "colors": [
                {"hex": "#ffb3a7", "name": "粉红", "desc": "即浅红色。别称：妃色、杨妃色、湘妃色、妃红色"},
                {"hex": "#ed5736", "name": "妃色", "desc": "妃红色。古同\"绯\"，粉红色。杨妃色湘妃色粉红皆同义。"},
                {"hex": "#f00056", "name": "品红", "desc": "比大红浅的红色"},
                {"hex": "#f47983", "name": "桃红", "desc": "桃花的颜色，比粉红略鲜润的颜色"},
                {"hex": "#db5a6b", "name": "海棠红", "desc": "淡紫红色、较桃红色深一些，是非常妩媚娇艳的颜色"},
                {"hex": "#f20c00", "name": "石榴红", "desc": "石榴花的颜色，高色度和纯度的红色"},
                {"hex": "#c93756", "name": "樱桃色", "desc": "鲜红色"},
                {"hex": "#f05654", "name": "银红", "desc": "银朱和粉红色颜料配成的颜色"},
                {"hex": "#ff2121", "name": "大红", "desc": "正红色，三原色中的红，传统的中国红"},
                {"hex": "#8c4356", "name": "绛紫", "desc": "紫中略带红的颜色"},
                {"hex": "#c83c23", "name": "绯红", "desc": "艳丽的深红"},
                {"hex": "#9d2933", "name": "胭脂", "desc": "女子装扮时用的胭脂的颜色，国画暗红色颜料"},
                {"hex": "#ff4c00", "name": "朱红", "desc": "朱砂的颜色，比大红活泼"},
                {"hex": "#ff4e20", "name": "丹", "desc": "丹砂的鲜艳红色"},
                {"hex": "#f35336", "name": "彤", "desc": "赤色"},
                {"hex": "#cb3a56", "name": "茜色", "desc": "茜草染的色彩，呈深红色"},
                {"hex": "#ff2d51", "name": "火红", "desc": "火焰的红色，赤色"},
                {"hex": "#c91f37", "name": "赫赤", "desc": "深红，火红。泛指赤色、火红色"},
                {"hex": "#ef7a82", "name": "嫣红", "desc": "鲜艳的红色"},
                {"hex": "#ff0097", "name": "洋红", "desc": "色橘红"},
                {"hex": "#ff3300", "name": "炎", "desc": "引申为红色"},
                {"hex": "#c3272b", "name": "赤", "desc": "本义火的颜色，即红色"},
                {"hex": "#a98175", "name": "绾", "desc": "绛色；浅绛色"},
                {"hex": "#c32136", "name": "枣红", "desc": "即深红"},
                {"hex": "#b36d61", "name": "檀", "desc": "浅红色，浅绛色"},
                {"hex": "#be002f", "name": "殷红", "desc": "发黑的红色"},
                {"hex": "#dc3023", "name": "酡红", "desc": "像饮酒后脸上泛现的红色，泛指脸红"},
                {"hex": "#f9906f", "name": "酡颜", "desc": "饮酒脸红的样子。亦泛指脸红色"}
            ]
        },
        {
            "name": "黄色系",
            "poetry": [
                {"content": "黄河远上白云间，一片孤城万仞山", "author": "王之涣", "title": "凉州词"},
                {"content": "两个黄鹂鸣翠柳，一行白鹭上青天", "author": "杜甫", "title": "绝句"}
            ],
            "colors": [
                {"hex": "#fff143", "name": "鹅黄", "desc": "淡黄色"},
                {"hex": "#faff72", "name": "鸭黄", "desc": "小鸭毛的黄色"},
                {"hex": "#eaff56", "name": "樱草色", "desc": "淡黄绿色"},
                {"hex": "#ffa400", "name": "杏黄", "desc": "成熟杏子的黄色"},
                {"hex": "#ff8c31", "name": "杏红", "desc": "成熟杏子偏红色的一面"},
                {"hex": "#ff8936", "name": "橘黄", "desc": "柑橘的黄色"},
                {"hex": "#ffb61e", "name": "橙黄", "desc": "橙的黄色"},
                {"hex": "#ff6600", "name": "橘红", "desc": "柑橘的红色"},
                {"hex": "#ff8c00", "name": "姜黄", "desc": "中药名。别名黄姜。为姜科植物姜黄的根茎"},
                {"hex": "#ffc773", "name": "缃色", "desc": "浅黄色"},
                {"hex": "#fa8c35", "name": "橙色", "desc": "界于红色和黄色之间的混合色"},
                {"hex": "#b35c44", "name": "茶色", "desc": "一种比栗色稍红的棕橙色至浅棕色"},
                {"hex": "#a88462", "name": "驼色", "desc": "一种比咔叽色稍红而微淡、比肉桂色黄而稍淡和比核桃棕色黄而暗的浅黄棕色"},
                {"hex": "#c89b40", "name": "昏黄", "desc": "形容天色、灯光等呈幽暗的黄色"},
                {"hex": "#60281e", "name": "栗色", "desc": "栗壳的颜色。即紫黑色"},
                {"hex": "#b25d25", "name": "棕色", "desc": "棕毛的颜色，即褐色"},
                {"hex": "#827100", "name": "棕绿", "desc": "绿中泛棕色的一种颜色"},
                {"hex": "#7c4b00", "name": "棕黑", "desc": "深棕色"},
                {"hex": "#9b4400", "name": "棕红", "desc": "红褐色"},
                {"hex": "#ae7000", "name": "棕黄", "desc": "黄褐色"},
                {"hex": "#ca6924", "name": "赭", "desc": "红色、赤红色"},
                {"hex": "#9c5333", "name": "赭色", "desc": "红褐色"},
                {"hex": "#fc9d9a", "name": "琥珀", "desc": "一种较深的黄色"},
                {"hex": "#6e511e", "name": "褐色", "desc": "黄黑色"},
                {"hex": "#c3b370", "name": "枯黄", "desc": "干枯焦黄"},
                {"hex": "#e29c45", "name": "黄栌", "desc": "一种落叶灌木，叶子秋天变成红色"},
                {"hex": "#d9b611", "name": "秋色", "desc": "1、中等的或暗的棕黄色 2、古以秋为金，其色白，故代指白色"},
                {"hex": "#d2b48c", "name": "秋香色", "desc": "浅橄榄色 浅黄褐色"}
            ]
        },
        {
            "name": "绿色系",
            "poetry": [
                {"content": "春风又绿江南岸，明月何时照我还", "author": "王安石", "title": "泊船瓜洲"},
                {"content": "日出江花红胜火，春来江水绿如蓝", "author": "白居易", "title": "忆江南"}
            ],
            "colors": [
                {"hex": "#bddd22", "name": "嫩绿", "desc": "像刚长出的嫩叶的浅绿色"},
                {"hex": "#c9dd22", "name": "柳黄", "desc": "像柳树芽那样的浅黄色"},
                {"hex": "#afdd22", "name": "柳绿", "desc": "柳叶的浅绿色"},
                {"hex": "#00e09e", "name": "竹青", "desc": "竹子的绿色"},
                {"hex": "#93de00", "name": "葱黄", "desc": "黄绿色，嫩黄色"},
                {"hex": "#9ed900", "name": "葱绿", "desc": "1、浅绿又略显微黄的颜色 2、草木青翠的颜色"},
                {"hex": "#00e079", "name": "葱青", "desc": "淡淡的青绿色"},
                {"hex": "#44cef6", "name": "葱倩", "desc": "青绿色"},
                {"hex": "#00bc12", "name": "青葱", "desc": "翠绿色，青绿色"},
                {"hex": "#00bb00", "name": "油绿", "desc": "光润而浓绿的颜色。如油绿的叶子"},
                {"hex": "#0eb83a", "name": "绿沈", "desc": "深绿"},
                {"hex": "#1bd1a5", "name": "碧色", "desc": "青绿色"},
                {"hex": "#2add9c", "name": "碧绿", "desc": "清澈明亮的绿色"},
                {"hex": "#48c0a3", "name": "青碧", "desc": "鲜艳的青绿色"},
                {"hex": "#3de1ad", "name": "翡翠色", "desc": "1、翡翠鸟羽毛的青绿色 2、翡翠宝石的颜色"},
                {"hex": "#00e500", "name": "草绿", "desc": "绿而略黄的颜色"},
                {"hex": "#00e09e", "name": "青色", "desc": "1、一类带绿的蓝色，中等深浅，高度饱和 2、本义是蓝色 3、植物的绿色 4、喻年轻的"},
                {"hex": "#7bcfa6", "name": "青翠", "desc": "鲜绿"},
                {"hex": "#d0f0c0", "name": "青白", "desc": "白而发青，尤指脸没有血色"},
                {"hex": "#e0eee8", "name": "鸭卵青", "desc": "淡青灰色，极淡的青绿色"},
                {"hex": "#424c50", "name": "蟹壳青", "desc": "深灰绿色"},
                {"hex": "#2e4e7e", "name": "鸦青", "desc": "鸦羽的颜色。即黑而带有紫绿光的颜色"},
                {"hex": "#00fa54", "name": "绿色", "desc": "1、在光谱中介于蓝与黄之间的那种颜色 2、本义：青中带黄的颜色"},
                {"hex": "#c3f53c", "name": "豆绿", "desc": "浅黄绿色"},
                {"hex": "#96ce54", "name": "豆青", "desc": "浅青绿色"},
                {"hex": "#1685a9", "name": "石青", "desc": "淡灰绿色"},
                {"hex": "#41555d", "name": "玉色", "desc": "玉的颜色，高雅的淡绿、淡青色"},
                {"hex": "#7fecad", "name": "缥", "desc": "绿色而微白"},
                {"hex": "#a4e2c6", "name": "艾绿", "desc": "艾草的颜色。偏苍白的绿色"},
                {"hex": "#21a675", "name": "松柏绿", "desc": "经冬松柏叶的深绿"},
                {"hex": "#057748", "name": "松花绿", "desc": "亦作\"松花\"、\"松绿\"。偏黑的深绿色，墨绿"},
                {"hex": "#bce672", "name": "松花色", "desc": "淡黄绿色。（松树花粉的颜色）松花色即秋香色"}
            ]
        },
        {
            "name": "蓝色系",
            "poetry": [
                {"content": "蓝田日暖玉生烟，此情可待成追忆", "author": "李商隐", "title": "锦瑟"},
                {"content": "碧云天，黄叶地，秋色连波", "author": "范仲淹", "title": "苏幕遮"}
            ],
            "colors": [
                {"hex": "#70f3ff", "name": "蓝", "desc": "蓝色，一种颜色，它是红绿蓝光的三原色中的一元，在这三种原色中它的波长最短"},
                {"hex": "#177cb0", "name": "靛青", "desc": "也叫\"蓝靛\"。用蓼蓝叶泡水调和与石灰沉淀所得的蓝色染料。呈深蓝绿色"},
                {"hex": "#065279", "name": "靛蓝", "desc": "深蓝色"},
                {"hex": "#3eede7", "name": "碧蓝", "desc": "青蓝色"},
                {"hex": "#70f3ff", "name": "蔚蓝", "desc": "类似晴朗天空的颜色的一种蓝色"},
                {"hex": "#4b5cc4", "name": "宝蓝", "desc": "鲜艳明亮的蓝色"},
                {"hex": "#a1afc9", "name": "蓝灰色", "desc": "一种近于灰略带蓝的深灰色"},
                {"hex": "#2e4b89", "name": "藏青", "desc": "蓝而近黑"},
                {"hex": "#3b2e7e", "name": "藏蓝", "desc": "蓝里略透红色"},
                {"hex": "#4a4266", "name": "黛", "desc": "青黑色的颜料。古代女子用以画眉"},
                {"hex": "#426666", "name": "黛绿", "desc": "墨绿"},
                {"hex": "#3eede7", "name": "黛蓝", "desc": "深蓝色"},
                {"hex": "#574266", "name": "黛紫", "desc": "深紫色"},
                {"hex": "#8d4bbb", "name": "紫色", "desc": "蓝和红组成的颜色"},
                {"hex": "#815463", "name": "紫酱", "desc": "浑浊的紫色"},
                {"hex": "#815476", "name": "酱紫", "desc": "紫中略带红的颜色"},
                {"hex": "#4c221b", "name": "紫檀", "desc": "檀木的颜色，也称乌檀色、黑檀色"},
                {"hex": "#003371", "name": "绀青", "desc": "纯正的深蓝色"},
                {"hex": "#003472", "name": "绀紫", "desc": "略带红的深蓝色"},
                {"hex": "#8d5524", "name": "紫棠", "desc": "黑红色"},
                {"hex": "#801dae", "name": "青莲", "desc": "偏紫的蓝色"},
                {"hex": "#4c8dae", "name": "群青", "desc": "深蓝色"},
                {"hex": "#b0a4e3", "name": "雪青", "desc": "浅蓝紫色"},
                {"hex": "#cca4e3", "name": "丁香色", "desc": "紫丁香的颜色，浅浅的紫色，很娇嫩淡雅的色彩"},
                {"hex": "#edc9af", "name": "藕色", "desc": "浅灰而略带红的颜色"},
                {"hex": "#e4c6d0", "name": "藕荷色", "desc": "浅紫而略带红的颜色"}
            ]
        },
        {
            "name": "苍色系",
            "poetry": [
                {"content": "苍苍竹林寺，杳杳钟声晚", "author": "刘长卿", "title": "送灵澈上人"},
                {"content": "苍山如海，残阳如血", "author": "毛泽东", "title": "忆秦娥·娄山关"}
            ],
            "colors": [
                {"hex": "#75878a", "name": "苍色", "desc": "即青色。多指青绿色"},
                {"hex": "#519a73", "name": "苍翠", "desc": "深绿色"},
                {"hex": "#a29b7c", "name": "苍黄", "desc": "苍白而带黄色"},
                {"hex": "#88ada6", "name": "苍青", "desc": "深青色"},
                {"hex": "#395260", "name": "苍黑", "desc": "深黑色"},
                {"hex": "#d1d9e0", "name": "苍白", "desc": "白而略带青色；灰白"}
            ]
        },
        {
            "name": "水色系",
            "poetry": [
                {"content": "水光潋滟晴方好，山色空蒙雨亦奇", "author": "苏轼", "title": "饮湖上初晴后雨"},
                {"content": "问君能有几多愁，恰似一江春水向东流", "author": "李煜", "title": "虞美人"}
            ],
            "colors": [
                {"hex": "#88ada6", "name": "水色", "desc": "水的颜色"},
                {"hex": "#f3d3e7", "name": "水红", "desc": "浅淡的红色"},
                {"hex": "#d4f2e7", "name": "水绿", "desc": "浅淡的绿色"},
                {"hex": "#d2f0ff", "name": "水蓝", "desc": "浅蓝色"},
                {"hex": "#9ed1d3", "name": "淡青", "desc": "浅青色"},
                {"hex": "#30dff3", "name": "湖蓝", "desc": "湖水的蓝色"},
                {"hex": "#25f8cb", "name": "湖绿", "desc": "湖水的绿色"}
            ]
        },
        {
            "name": "灰白色系",
            "poetry": [
                {"content": "白日依山尽，黄河入海流", "author": "王之涣", "title": "登鹳雀楼"},
                {"content": "白头搔更短，浑欲不胜簪", "author": "杜甫", "title": "春望"}
            ],
            "colors": [
                {"hex": "#ffffff", "name": "精白", "desc": "纯白色"},
                {"hex": "#fffbf0", "name": "象牙白", "desc": "乳白色"},
                {"hex": "#f0fcff", "name": "雪白", "desc": "如雪花般的白色"},
                {"hex": "#d6ecf0", "name": "月白", "desc": "淡蓝色"},
                {"hex": "#e0f0e9", "name": "缟", "desc": "白色"},
                {"hex": "#f0f0f4", "name": "素", "desc": "白色，无色"},
                {"hex": "#f3f9f1", "name": "荼白", "desc": "如荼之白色"},
                {"hex": "#e9f1f6", "name": "霜色", "desc": "如霜的白色"},
                {"hex": "#fcefe8", "name": "花白", "desc": "白色和别的颜色相间"},
                {"hex": "#fdf6e3", "name": "鱼肚白", "desc": "似鱼腹部的颜色，多指黎明时东方的颜色"},
                {"hex": "#fcfff4", "name": "莹白", "desc": "晶莹洁白"},
                {"hex": "#808080", "name": "灰色", "desc": "黑色和白色混合成的一种颜色"},
                {"hex": "#eedeb0", "name": "牙色", "desc": "象牙的颜色，微带黄色的白"},
                {"hex": "#f0f0f0", "name": "铅白", "desc": "白而略带蓝的颜色"}
            ]
        },
        {
            "name": "黑色系",
            "poetry": [
                {"content": "黑云压城城欲摧，甲光向日金鳞开", "author": "李贺", "title": "雁门太守行"},
                {"content": "墨梅花开不争春，只留清气满乾坤", "author": "王冕", "title": "墨梅"}
            ],
            "colors": [
                {"hex": "#622a1d", "name": "玄色", "desc": "赤黑色，黑中带红"},
                {"hex": "#3d3b4f", "name": "玄青", "desc": "深黑色"},
                {"hex": "#392f41", "name": "乌色", "desc": "暗而呈黑的颜色"},
                {"hex": "#392f41", "name": "乌黑", "desc": "深黑色"},
                {"hex": "#161823", "name": "漆黑", "desc": "非常黑的"},
                {"hex": "#50616d", "name": "墨色", "desc": "即黑色"},
                {"hex": "#758a99", "name": "墨灰", "desc": "即黑灰"},
                {"hex": "#000000", "name": "黑色", "desc": "亮度最低的非彩色的或消色差的物体的颜色"},
                {"hex": "#493131", "name": "缁色", "desc": "帛黑色"},
                {"hex": "#312520", "name": "煤黑", "desc": "煤的颜色，深黑色"},
                {"hex": "#5d513c", "name": "黧", "desc": "黑中带黄的颜色"},
                {"hex": "#75664d", "name": "黎", "desc": "黑色"},
                {"hex": "#665757", "name": "黝", "desc": "青黑色"},
                {"hex": "#41555d", "name": "黝黑", "desc": "颜色深黑"},
                {"hex": "#41555d", "name": "黯", "desc": "深黑色；阴暗的样子"}
            ]
        },
        {
            "name": "金银色系",
            "poetry": [
                {"content": "金风玉露一相逢，便胜却人间无数", "author": "秦观", "title": "鹊桥仙"},
                {"content": "银烛秋光冷画屏，轻罗小扇扑流萤", "author": "杜牧", "title": "秋夕"}
            ],
            "colors": [
                {"hex": "#f2be45", "name": "赤金", "desc": "足金的颜色"},
                {"hex": "#eacd76", "name": "金色", "desc": "一种平均为深黄的颜色"},
                {"hex": "#e9e7ef", "name": "银白", "desc": "带银光的白色"},
                {"hex": "#b5b5bd", "name": "老银", "desc": "金属银的颜色"},
                {"hex": "#392f41", "name": "乌金", "desc": "黑而发亮的颜色"},
                {"hex": "#549688", "name": "铜绿", "desc": "铜绿的颜色"}
            ]
        }
    ]
    return color_data

def hex_to_rgb(hex_color):
    """将HEX颜色值转换为RGB"""
    hex_color = hex_color.lstrip('#')
    return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))

def create_color_documents(color_data):
    """将颜色数据转换为 Document 对象"""
    documents = []
    
    for category in color_data:
        category_name = category["name"]
        
        # 为每个颜色创建一个文档
        for color in category["colors"]:
            # 计算RGB值
            rgb = hex_to_rgb(color['hex'])
            
            # 创建丰富的文档内容
            content = f"""颜色名称: {color['name']}
色系分类: {category_name}
HEX色值: {color['hex']}
RGB色值: R{rgb[0]} G{rgb[1]} B{rgb[2]}
颜色描述: {color['desc']}

文化内涵与相关诗词:
"""
            # 添加相关诗词
            for poem in category.get("poetry", []):
                content += f'"{poem["content"]}" —— {poem["author"]}《{poem["title"]}》\n'
            
            content += f"\n这是中国传统颜色中{category_name}的代表色彩之一，体现了中华文化对色彩的独特理解和审美追求。"
            
            # 创建文档对象，包含丰富的元数据
            doc = Document(
                text=content,
                metadata={
                    "color_name": color['name'],
                    "category": category_name,
                    "hex_value": color['hex'],
                    "rgb_r": rgb[0],
                    "rgb_g": rgb[1],
                    "rgb_b": rgb[2],
                    "description": color['desc'],
                    "source": "中国传统颜色手册",
                    "type": "traditional_chinese_color",
                    "cultural_significance": "中华传统文化色彩"
                }
            )
            documents.append(doc)
    
    return documents

def main():
    print("🎨 开始加载中国传统颜色数据到 Milvus...")
    
    # 1. 加载颜色数据
    color_data = load_chinese_colors_data()
    print(f"📚 加载了 {len(color_data)} 个色系的数据")
    
    # 统计总颜色数量
    total_colors = sum(len(category["colors"]) for category in color_data)
    print(f"🌈 总共包含 {total_colors} 种传统颜色")
    
    # 2. 转换为文档对象
    documents = create_color_documents(color_data)
    print(f"📄 创建了 {len(documents)} 个颜色文档")
    
    # 3. 配置文本分割器
    splitter = TokenTextSplitter(
        chunk_size=512,  # 每个块的目标token数
        chunk_overlap=50,   # 相邻块之间的重叠token数
        backup_separators=["。", "！", "？", "\n", "——"]  # 中文文档分隔符
    )
    
    # 4. 配置嵌入模型
    print(f"🔧 配置 NVIDIA 嵌入模型: {EMBEDDING_MODEL}")
    embedder = NVIDIAEmbeddings(model=EMBEDDING_MODEL, truncate="END")
    Settings.embed_model = embedder
    
    # 5. 配置 Milvus 向量存储
    print(f"🗄️  配置 Milvus 向量存储: {MILVUS_URI}")
    vector_store = MilvusVectorStore(
        uri=MILVUS_URI,
        dim=EMBEDDING_DIMENSION,  # 嵌入模型的维度
        collection_name=COLLECTION_NAME,
        embedding_field="vector",
        overwrite=True  # 覆盖已存在的集合
    )
    storage_context = StorageContext.from_defaults(vector_store=vector_store)
    
    # 6. 创建索引并导入数据
    print("⚡ 正在创建向量索引并导入数据...")
    index = VectorStoreIndex.from_documents(
        documents,
        storage_context=storage_context,
        transformations=[splitter]
    )
    
    print("\n✅ 中国传统颜色数据已成功导入 Milvus!")
    print(f"📊 集合名称: chinese_traditional_colors")
    print(f"📈 文档数量: {len(documents)}")
    print(f"🎯 向量维度: 1024")
    print(f"🌈 色系数量: {len(color_data)}")
    print(f"🎨 颜色总数: {total_colors}")
    
    # 显示各色系的颜色数量
    print("\n📋 各色系详情:")
    for category in color_data:
        print(f"  • {category['name']}: {len(category['colors'])} 种颜色")
    
    return index

if __name__ == "__main__":
    index = main()
