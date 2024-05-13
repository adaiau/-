// console.log(lrc);

/**
 * 数据 界面  事件
 */

// 数值逻辑处理

/**
 * 解析歌词字符串
 * 得到一个歌词对象的数组
 * 每个歌词对象：{time：开始时间 word：歌词内容}
 */
function parseLrc(){
    var lines = lrc.split('\n');
    var result = []; // 歌词对象数组
    for(var i = 0; i<lines.length; i++){
        var str = lines[i];
        var parts = str.split(']');
        // console.log(parts); 
        var timeStr = parts[0].substring(1);
        // substring(1); 截去 [ 之后的字符串
        // console.log(timeStr);
        var obj = {
            time: parseTime(timeStr),
            words: parts[1],
        };
        // console.log(str);
        // console.log(obj);
        result.push(obj);
    }
    return result;
}

/**
 * 将一个时间字符串解析为数值（秒）
 * @param {String} timeStr 时间字符串
 */
function parseTime(timeStr){
    var parts = timeStr.split(':');
    // console.log(+parts[0]*60 + +parts[1]);
    return +parts[0]*60 + +parts[1];
}

var lrcData = parseLrc();
// parseLrc();
// console.log(lrcData);


// DOM 对象
var doms = {
    audio: document.querySelector('audio'),
    ul: document.querySelector('.container ul'),
    container: document.querySelector('.container'),
};

/**
 * 计算出 在当前播放器播放到第几秒的情况下
 * lrcData数组中 应该高亮显示的歌词下表
 */
function findIndex() {
    // 播放器当前的时间
    // console.log(doms.audio.currentTime);
    var curTime = doms.audio.currentTime;
    // console.log(lrcData);
    for(var i = 0; i < lrcData.length; i++){
        if(curTime < lrcData[i].time){
            return i - 1;
        }
    }
    // 循环结束 说明播放到最后一句
    return lrcData.length - 1;
}

// 界面逻辑设计
function createLrcElements() {
    var frag = document.createDocumentFragment(); // 文档片段
    for(var i = 0; i < lrcData.length; i++){
        var li = document.createElement('li');
        li.textContent = lrcData[i].words;
        // doms.ul.appendChild(li);  改动了 dom 树
        frag.appendChild(li);
    }
    doms.ul.appendChild(frag);
}

createLrcElements();

// 变量声明
var containerHeight = doms.container.clientHeight;// 容器高度
var liHeight = doms.ul.children[0].clientHeight; // 每段歌词高度
var maxOffset = doms.ul.clientHeight - containerHeight; // 最大偏移高度

function setOffset() {
    var index = findIndex();
    var offset = liHeight * index + liHeight/2 - containerHeight/2;
    if(offset < 0 ){
        offset = 0;
    }
    // var maxOffset = doms.ul.clientHeight - containerHeight;
    if(offset > maxOffset){
        offset = maxOffset;
    }

    // 去掉之前的 active 样式
    var li = doms.ul.querySelector('.active');
    if (li) {
        li.classList.remove('active');
    }

    li = doms.ul.children[index];
    if(li){
        li.classList.add('active');
    }
    doms.ul.style.transform = `translateY(-${offset}px`;
    // doms.ul.children[index].classList.add('active');
    console.log(offset);
}


// 事件逻辑
doms.audio.addEventListener('timeupdate', setOffset);