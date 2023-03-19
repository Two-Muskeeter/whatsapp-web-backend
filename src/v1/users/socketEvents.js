import fs from 'fs';

import { remove } from '../../array-lib'


const events = (socket) => {
    let onlineUsers = []
    socket.on("go_online", (data) => {
        if (data.connectionId && data.mobile) {
            const res = onlineUsers.find((item) => item?.mobile == data?.mobile)
            !res && onlineUsers.push(data)
            res && onlineUsers.map((item) => {
                if (item.mobile === data.mobile) {
                    item.connectionId = data.connectionId
                }
                return item
            })
        socket.emit('connected_users', { onlineUsers: onlineUsers })

        }

    })
    socket.on('disconnect', function () {
        onlineUsers = onlineUsers.filter((item) => item.connectionId != socket?.connectionId)
        socket.emit('connected_users', { onlineUsers: onlineUsers })
    });
}
export default events;