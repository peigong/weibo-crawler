# Weibo Crawler #

用于爬取新浪微博和twitter数据的工具。

## 依赖环境 ##

在[http://nodejs.org/](http://nodejs.org/)网站上下载安装Node环境。

在当前目录，`Shift + 右键菜单`打开命令窗口。输入`npm install`安装NPM依赖。

## 使用方法 ##

1. 抓取一个话题：`node fetch.js -t sina|twitter -w word`
2. 根据配置抓取一批话题：`node run.js -t sina|tweet`

## 抓取配置文件规范 ##

1. 新浪配置文件是`config/sina-keywords.conf`
2. twitter配置文件是`config/twitter-keywords.conf`。
2. 文件编码UTF-8 
3. 以“主话题:关键词,关键词,关键词,关键词,关键词”的格式存储数据。 
4. 冒号和逗号要是英文的标点符号。 
5. 一行一个主话题的数据，不换行。

## 许可 ##

Copyright (c) 2014 周培公  
Licensed under the MIT license.