# weibo-crawler #

用于爬取新浪微博数据的工具。

## 依赖环境 ##

在[http://nodejs.org/](http://nodejs.org/)网站上下载安装Node环境。

在当前目录，`Shift + 右键菜单`打开命令窗口。输入`npm install`安装NPM依赖。

## 使用方法 ##

命令行：`node fetch.js - word`

## 设计需求 ##

参数：话题、TOP N、抓取间隔
输出：CSV

1. 话题，权重（子话题权重和）
2. 话题
	1. 子话题（微话题），权重（全部讨论、一周讨论、24小时讨论）huati.weibo.com
	2. 子话题，近一个月每天关注度 data.weibo.com/index
	3. 子话题，24小时关注度 data.weibo.com/index
	4. 子话题，热度top20微博列表（微博名、个人/机构、博文、时间、URL、点赞数、转发数、评论数）huati.weibo.com
	5. 子话题，最新top20微博列表（微博名、个人/机构、博文、时间、URL、点赞数、转发数、评论数）huati.weibo.com

子话题：

## TODO ##

1. 内容中的HTML标签还没有清理彻底。
2. Unicode编码需要转成汉字
3. 原内容中的转义斜杠还没有清理
4. 只能读取默认的15条信息
5. 需要规范化输入的话题配置文件的格式
6. 需要规范化输出CSV文件的格式

## 许可 ##

Copyright (c) 2014 周培公  
Licensed under the MIT license.