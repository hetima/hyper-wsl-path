
    
exports.onWindow = win => {

    // remove original listener
    let listeners = win.webContents.listeners('will-navigate');
    for (var i = listeners.length-1; i>= 0; i--) {
        if ( listeners[i].toString().indexOf("parseUrl(url).protocol") > -1 ){
            win.webContents.removeListener('will-navigate', listeners[i]);
            break;
        }
    }

    win.webContents.on('will-navigate', (event, url) => {
        if (typeof url === 'string' && url.length > 10 && url.indexOf('file:///') == 0){
            let path = url.substr(8);
            const colon = path.indexOf(':');
            const drive = path.substr(0, colon).toLowerCase(); // 'c'
            path = path.substr(colon + 1); // '/path/to~'
            const rootfs = path.match('/Users/.+/AppData/Local/Packages/.+/LocalState/rootfs(.+)');
            if (rootfs && rootfs.length > 1){
                win.rpc.emit('session data send', { data: rootfs[1], escaped: true });
            }else{
                win.rpc.emit('session data send', { data: '/mnt/' + drive + path, escaped: true });
            }
        }else{
            win.rpc.emit('session data send', { data: url, escaped: true });
        }
        event.preventDefault();
    });
};


