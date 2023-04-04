let users = []
const SocketServer = (socket) => {

    //User who logs in
    socket.on("joinUser", (id) => {
        const user = users.find(user => user.id === id)
        if (!user) {
            users.push({ id, socketId: socket.id })
        }
        //console.log(users)
    })

    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id)
        //console.log("disconnection")
    })

    //Like post
    socket.on("likePost", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('likePostToClient', payload)
            })
        }
    })

    //Add Comment
    socket.on("addComment", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('addCommentToClient', payload)
            })
        }
    })
    //Reply Comment
    socket.on("replyComment", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('replyCommentToClient', payload)
            })
        }
    })

    //Delete Comment
    socket.on("deleteComment", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('deleteCommentToClient', payload)
            })
        }
    })

    //Delete Comment
    socket.on("likeComment", (payload) => {
        const clients = users.filter(user => user.id !== payload.id)
        //console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('likeCommentToClient', payload)
            })
        }
    })

    ///Notifications
    socket.on("likePostNotification", (payload) => {
        const clients = users.filter(user => user.id !== payload.id)
        //console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('likePostNotificationToClient', payload)
            })
        }
    })

    socket.on("viewProfileNotification", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        //console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('viewProfileNotificationToClient', payload)
            })
        }
    })

    socket.on("commentNotification", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        //console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('commentNotificationToClient', payload)
            })
        }
    })

    socket.on("commentLikeNotification", (payload) => {
        //console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        //console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('commentLikeNotificationToClient', payload)
            })
        }
    })

    /* ---------CHATS------- */
    //New Message
    socket.on("newMessage", ({ data: newMessage, user: payload }) => {
        console.log(newMessage);
        const user = users.find(user => user.id === newMessage.recipient._id)
        console.log(user);
        if (user) {
            socket.to(`${user.socketId}`).emit('newMessageToClient', newMessage)
        }
    })
    //Delete Message
    socket.on("deleteAMessage", newMessage => {
        //console.log(newMessage);
        const user = users.find(user => user.id === newMessage.recipient._id)
        //console.log(user);
        if (user) {
            socket.to(`${user.socketId}`).emit('deleteAMessageToClient', newMessage)
        }
    })

    //Typing
    socket.on("openTyping", ({ id, id2 }) => {
        console.log(id, id2);
        const user = users.find(user => user.id === id)
        //console.log(user);
        if (user) {
            socket.to(`${user.socketId}`).emit('openTypingToClient', id2)
        }
    })
    //Stop Typing
    socket.on("closeTyping", userId => {
        //console.log(userId);
        const user = users.find(user => user.id === userId)
        //console.log(user);
        if (user) {
            socket.to(`${user.socketId}`).emit('closeTypingToClient')
        }
    })

}

module.exports = SocketServer