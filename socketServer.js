const { notifySender } = require("./controllers/userController")
let users = []

exports.notifySender = () => {

}
const SocketServer = (socket) => {

    //User who logs in
    socket.on("joinUser", (id) => {
        const user = users.find(user => user.id === id)
        if (!user) {
            users.push({ id, socketId: socket.id })
        }
        console.log(users)
    })

    socket.on("disconnect", () => {
        users = users.filter(user => user.socketId !== socket.id)
        console.log("disconnection")
    })

    //Like post
    socket.on("likePost", (payload) => {
        console.log(payload)
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
        console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(`${client.socketId}`).emit('replyCommentToClient', payload)
            })
        }
    })

    //Delete Comment
    socket.on("deleteComment", (payload) => {
        console.log(payload)
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
        console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('likeCommentToClient', payload)
            })
        }
    })

    ///Notifications
    socket.on("likePostNotification", (payload) => {
        const clients = users.filter(user => user.id !== payload.id)
        console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('likePostNotificationToClient', payload)
            })
        }
    })

    socket.on("viewProfileNotification", (payload) => {
        console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('viewProfileNotificationToClient', payload)
            })
        }
    })

    socket.on("commentNotification", (payload) => {
        console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('commentNotificationToClient', payload)
            })
        }
    })

    socket.on("commentLikeNotification", (payload) => {
        console.log(payload)
        const clients = users.filter(user => user.id !== payload.id)
        console.log("users", clients)
        if (clients.length > 0) {
            clients.forEach(client => {
                socket.to(client.socketId).emit('commentLikeNotificationToClient', payload)
            })
        }
    })

}

module.exports = SocketServer