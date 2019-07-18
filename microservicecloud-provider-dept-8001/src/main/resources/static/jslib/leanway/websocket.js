com.leanway.webscoket = {
    isConnected : false,
    isClosed : true,
    isError : true,
    sessionId : null,
    answer : '',
    error : '',
    client : null,
    status : function(status, msg) {
        switch (status) {
            case 'onopen': {
                com.leanway.webscoket.isConnected = true;
                com.leanway.webscoket.isClosed = false;
                com.leanway.webscoket.isError = false;
                com.leanway.webscoket.log('连接打开,消息:' + msg);
                break;
            }
            case 'onclose': {
                com.leanway.webscoket.isConnected = false;
                com.leanway.webscoket.isClosed = true;
                com.leanway.webscoket.isError = true;
                com.leanway.webscoket.log('成功关闭');
                break;
            }
            case 'onerror': {
                com.leanway.webscoket.isConnected = false;
                com.leanway.webscoket.isClosed = true;
                com.leanway.webscoket.isError = true;
                com.leanway.webscoket.error = '连接异常,消息:';
                com.leanway.webscoket.log(com.leanway.webscoket.error);
                //alert(com.leanway.webscoket.error);
                break;
            }
            case 'success': {
                com.leanway.webscoket.isConnected = true;
                com.leanway.webscoket.isClosed = false;
                com.leanway.webscoket.isError = false;
                com.leanway.webscoket.answer = '服务执行成功，响应:' + msg;
                com.leanway.webscoket.log(com.leanway.webscoket.answer);
                break;
            }
            case 'fail': {
                com.leanway.webscoket.isConnected = true;
                com.leanway.webscoket.isClosed = false;
                com.leanway.webscoket.isError = true;
                com.leanway.webscoket.answer = '服务执行失败，响应:' + msg;
                com.leanway.webscoket.error = com.leanway.webscoket.answer;
                com.leanway.webscoket.log(com.leanway.webscoket.answer);
                alert(com.leanway.webscoket.answer);
                break;
            }
            case 'unknow': {
                com.leanway.webscoket.isConnected = true;
                com.leanway.webscoket.isClosed = false;
                com.leanway.webscoket.isError = false;
                com.leanway.webscoket.answer = '服务响应无法判别，响应:' + msg;
                com.leanway.webscoket.log(com.leanway.webscoket.answer);
                alert(com.leanway.webscoket.answer);
                break;
            }
            default: {
                com.leanway.webscoket.answer = '行为无法判别,状态:' + status + '消息:'
                        + msg;
                com.leanway.webscoket.error = com.leanway.webscoket.answer;
                com.leanway.webscoket.log(com.leanway.webscoket.answer);
                alert(com.leanway.webscoket.answer);
                break;
            }
        }
    },
    getSessionId : function() {
        var c_name = 'JSESSIONID';
        var c_start;
        var c_end;
        if (document.cookie.length > 0) {
            c_start = document.cookie.indexOf(c_name + "=")
            if (c_start != -1) {
                c_start = c_start + c_name.length + 1
                c_end = document.cookie.indexOf(";", c_start)
                if (c_end == -1) {
                    c_end = document.cookie.length
                    com.leanway.webscoket.sessionId = unescape(document.cookie
                            .substring(c_start, c_end));
                }
            }
        }
    },
    connect : function(url) {
    	
        if (null == url) {
            return '地址为空';
        }
        if (null == com.leanway.webscoket.sessionId) {
            com.leanway.webscoket.getSessionId();
        }
        if (!window.WebSocket) {
            if (!window.MozWebSocket) {
                return '请使用IE10以上浏览器或换装Chrome或火狐浏览器！';
            } else {
                window.WebSocket = window.MozWebSocket;
            }
        }
        if (null != com.leanway.webscoket.client) {
            com.leanway.webscoket.client.close();
        }
        com.leanway.webscoket.client = new WebSocket(url);
        com.leanway.webscoket.client.onopen = function(evt) {
            com.leanway.webscoket.status('onopen', JSON.stringify(evt));
        };
        com.leanway.webscoket.client.onerror = function(evt) {
            com.leanway.webscoket.status('onerror', JSON.stringify(evt));
        }
        com.leanway.webscoket.client.onclose = function() {
            com.leanway.webscoket.status('onclose');
        }
        com.leanway.webscoket.client.onmessage = function(evt) {

            if (null != evt.data) {
                if (evt.data.indexOf('success') >= 0||evt.data.indexOf('连接成功')>=0||evt.data.indexOf('OK') >= 0) {
                	
                    com.leanway.webscoket.status('success', evt.data);
                    
                }else if (evt.data.indexOf('fail') >= 0) {
                	
                    com.leanway.webscoket.status('fail', evt.data);
                    
                } else {
                	
                    com.leanway.webscoket.status('unknow', evt.data);
                }
            }
        }
    },
    send : function(msg) {    	

        if (com.leanway.webscoket.client.readyState == 1) {
        	
            var sendObj = {};
            sendObj.JSESSIONID = com.leanway.webscoket.sessionId;
            sendObj.message = msg;
            com.leanway.webscoket.client.send(sendObj);
            com.leanway.webscoket.log('发送开始');
        } else {
        	
            com.leanway.webscoket.error = '发送失败,连接状态异常，状态码:'
                    + com.leanway.webscoket.client.readyState;
            com.leanway.webscoket.log('发送失败,连接状态异常，状态码:'
                    + com.leanway.webscoket.client.readyState);
        }
    },
    sendDelay : function(msg, time) {
        setTimeout(com.leanway.webscoket.send(msg), time);
        com.leanway.webscoket.log('发送准备：' + time / 1000 + '秒后执行');
    },
    changeServer : function(url) {
        if (null != com.leanway.webscoket.client) {
            com.leanway.webscoket.client.close();
            com.leanway.webscoket.client = null;
        }
        com.leanway.webscoket.connect(url);
    },
    close : function() {
        com.leanway.webscoket.client.close();
    },
    log : function(msg) {
        console.log(msg);
        if (document.getElementById('log')) {
            document.getElementById('log').innerHTML += msg + '<br/>';
        }
    }
};